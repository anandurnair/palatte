import { Request, Response } from "express";
import PostModel from "../models/post";
import UserModal from "../models/user";
import STATUS_CODES from "../utils/constants";
import CommentModel from "../models/comment";
import ReportedCommentsModal from "../models/reportComments";
const commentController: any = {};
const formatDate = (date: any) => {
  const options: any = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

commentController.addComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log("working commnet");
    const { postId, userId, comment } = req.body;
    console.log(postId, userId, comment);
    const newComment = new CommentModel({
      postId,
      userId,
      comment,
      parentCommentId :null,
      date: formatDate(new Date()),
    });
    await newComment.save();
    const comments = await CommentModel.find({ postId, parentCommentId: null })
      .populate("userId").populate({
        path: 'replies',
        populate: { path: 'replies' }, 
      }).sort({ _id: -1 });
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Successfully added", comments });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


commentController.addReply = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId, userId, comment, parentCommentId } = req.body;

    const parentComment = await CommentModel.findById(parentCommentId);
    if (!parentComment) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'Parent comment not found' });
    }

    const newReply = new CommentModel({
      postId,
      userId,
      comment,
      parentCommentId,
      date: formatDate(new Date()),
    });

    await newReply.save();

    parentComment.replies.push(newReply._id);
    await parentComment.save();
    const comments = await CommentModel.find({ postId, parentCommentId: null })
    .populate("userId").populate({
      path: 'replies',
      populate: { path: 'replies' }, 
    }).sort({ _id: -1 });
    
    res
      .status(STATUS_CODES.OK)
      .json({ message: 'Reply added successfully', comments });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};




commentController.getPostComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId } = req.query;
   
    const comments = await CommentModel.find({ postId, parentCommentId: null })
    .populate("userId")
    .populate({
      path: 'replies',
      populate: {
        path: 'userId', 
        model: 'Users', 
      },
    })
    .sort({ _id: -1 });
    console.log("Comments of a post : ", comments);
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Comments successfully fetched", comments });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

commentController.getAllComments = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const allComments = await CommentModel.find();
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Comments successfully fetched", allComments });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//delete comment

commentController.deleteComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { commentId } = req.query;
    console.log('cpmmmet id : ',commentId)
    console.log("Delete working")
    const isExist = await CommentModel.findById(commentId);
  
    console.log("isExist : ",isExist)
    if (!isExist) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Comment is not found" });
    }
    await CommentModel.findByIdAndDelete(commentId);
    await ReportedCommentsModal.findOneAndDelete({commentId})
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Comment successfully deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


//report comment
commentController.reportComment = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      const {commentId,postId,userId,reason} = req.body;
      console.log(commentId,postId,userId,reason);
      
      const comment = await CommentModel.findById(commentId)
      if(!comment){
       return res.status(STATUS_CODES.BAD_REQUEST).json({error:"Comment is not found"})
      }
      const newReport = new ReportedCommentsModal({userId,postId,commentId,reason})
      await newReport.save()
  
      const distinctUserCount = (await ReportedCommentsModal.distinct("userId", {commentId })).length;
  
       console.log("count reports : ",distinctUserCount);
      
      if(distinctUserCount === 3 && distinctUserCount > 3) {
        await CommentModel.findByIdAndDelete(commentId );
        await ReportedCommentsModal.deleteMany({commentId})
      }
     return  res.status(STATUS_CODES.OK).json({message:"Comment reported"})
    } catch (error) {
      console.error(error);
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };

  //get all reported comments
  commentController.getAllReportedComments = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      
      const allReports = await ReportedCommentsModal.find().sort({_id:-1}).populate('userId').populate('postId').populate('commentId')
      console.log(allReports)
      const reportedComments = allReports.map((report)=>{
        return {
          reportId : report._id,  
          postImg :report.postId.images,
          postId : report.postId._id,
          username : report.userId.username,
          comment : report.commentId.comment,
          reason : report.reason,
          status: report.commentId.isBlocked ? "Not active" : 'active'
        }
      })
      
     return  res.status(STATUS_CODES.OK).json({message:"fetched reports successfully",reportedComments})
    } catch (error) {
      console.error(error);
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };

export default commentController;
