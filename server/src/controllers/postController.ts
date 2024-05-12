import { Request, Response } from "express";
import PostModel from "../models/post";
import UserModal from "../models/user";
import STATUS_CODES from "../utils/constants";
import CommentModel from "../models/comment";
const {cloudinary} = require('../utils/cloudinary') 

const postController: any = {};
const formatDate = (date:any) => {
  const options :any = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};
postController.addPost = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log('Workinggg')
    const { userId, caption, images } = req.body;
    console.log("caption",caption)
    const user = await UserModal.findById(userId);
    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Invalid User" });
    }
    console.log("Img url : ", images)
    const uploadedImg = await cloudinary.uploader.upload(images);
      console.log('url :',uploadedImg)
      const formattedDate = formatDate(new Date());
    const newPost = new PostModel({
      caption,
      images:uploadedImg.url,
      userId,
      uploadedDate:formattedDate,
    });
    await newPost.save();
    const posts = await PostModel.find().sort({_id: -1}).populate('userId');

    res.status(STATUS_CODES.OK).json({ message: "Post uploaded successfully",posts });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//like post 
postController.likePost  = async (
  req: Request,
  res: Response
): Promise<any> =>{
  try {
    const {userId,postId} = req.body;
    const post = await PostModel.findById(postId)
    if(!post){
      res.status(STATUS_CODES.BAD_REQUEST).json({error:"Post is not found"})
    }
    await PostModel.findByIdAndUpdate(postId, { $push: { likes: userId } });

    res.status(STATUS_CODES.OK).json({message:'Liked successfully'})
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}
postController.unlikePost  = async (
  req: Request,
  res: Response
): Promise<any> =>{
  try {
    const {userId,postId} = req.body;
    const post = await PostModel.findById(postId)
    if(!post){
      res.status(STATUS_CODES.BAD_REQUEST).json({error:"Post is not found"})
    }
    await PostModel.findByIdAndUpdate(postId, { $pull: { likes: userId } });

    res.status(STATUS_CODES.OK).json({message:'unliked successfully'})
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

postController.getUserPosts = async (
  req: Request,
  res: Response
): Promise<any> => {
 try {
    console.log(('workied'));
    
    const {userId} = req.query;
    console.log(userId)
    const posts = await PostModel.find({userId});
    console.log("posts :",posts);
     
    res.status(STATUS_CODES.OK).json({message:'Posts fetched successfully',posts})
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};



postController.deletePost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//get Post detail

postController.getPostDetail = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {postId} = req.query;
    const post = await PostModel.findById(postId)
    if(!post){
      res.status(STATUS_CODES.BAD_REQUEST).json({error:"Post is not found"})
    }
    const commets = await CommentModel.find({postId})
  
    res.status(STATUS_CODES.OK).json({message:"Post data fetched",commets,post})
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


//save post

postController.savePost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {postId,userId} = req.body;
    const post = await PostModel.findById(postId)
    if(!post){
      res.status(STATUS_CODES.BAD_REQUEST).json({error:"Post is not found"})
    }
    const user = await UserModal.findById(userId)
    if (user.saved.includes(postId)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Post is already saved" });
    }
    const updatePost = await UserModal.findByIdAndUpdate(userId, { $push: { saved: postId } });
    res.status(STATUS_CODES.OK).json({message:"Post Saved",user})
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


postController.removeSavePost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {postId,userId} = req.body;
    const post = await PostModel.findById(postId)
    if(!post){
      res.status(STATUS_CODES.BAD_REQUEST).json({error:"Post is not found"})
    }
    const updatePost = await UserModal.findByIdAndUpdate(userId, { $pull: { saved: postId } });
    const user = await UserModal.findById(userId)
    res.status(STATUS_CODES.OK).json({message:"remove the Post",user})
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


postController.editPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postId, caption, images } = req.body;
    const updatedPost = await PostModel.findByIdAndUpdate(postId, {
      caption,
      images,
    });
    res.status(STATUS_CODES.OK).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

postController.getAllPosts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log('post fetched');
    
    const posts = await PostModel.find().sort({_id: -1}).populate('userId');
    console.log('posts',posts)
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Data fetched successfully", posts });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export default postController;
