import { Request, Response } from "express";
import PostModel from "../models/post";
import UserModal from "../models/user";
import STATUS_CODES from "../utils/constants";
import CommentModel from "../models/comment";


const commentController :any = {}

commentController.addComment =async (req: Request, res: Response): Promise<any> =>{
    try {
        console.log('working')
        const {postId, userId,comment} = req.body;
        console.log(postId, userId,comment)
        const newComment = new CommentModel({postId,userId,comment,date : new Date()})
        await newComment.save();
        const comments = await CommentModel.find()
        res.status(STATUS_CODES.OK).json({message:'Successfully added',comments})
    } catch (error) {
        console.error(error);
        res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal server error" });
    }
}

commentController.getPostComment=async (req: Request, res: Response): Promise<any> =>{
    try {
        const {postId} =  req.query
        const comments = await CommentModel.find({postId}).populate('userId')
        console.log("Comments of a post : ",comments)
        res.status(STATUS_CODES.OK).json({message:'Comments successfully fetched',comments})
    } catch (error) {
        console.error(error);
        res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal server error" });
    }
}

commentController.getAllComments=async (req: Request, res: Response): Promise<any> =>{
    try {
        const allComments = await CommentModel.find()
        res.status(STATUS_CODES.OK).json({message:'Comments successfully fetched',allComments})
    } catch (error) {
        console.error(error);
        res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal server error" });
    }
}



export default commentController