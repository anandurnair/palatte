import { Request, Response } from "express";
import PostModel from "../models/post";
import UserModal from "../models/user";
import STATUS_CODES from "../utils/constants";
import CommentModel from "../models/comment";
const { cloudinary } = require("../utils/cloudinary");
import ReportedPostsModal from "../models/reportedPosts";
import CollectionModel from "../models/collections";
const postController: any = {};
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
postController.addPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, caption, images } = req.body;
    const user = await UserModal.findById(userId);
    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Invalid User" });
    }
    const uploadedImgs = await Promise.all(
      images.map(async (image: string) => {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          resource_type: "auto",
        });
        return uploadResponse.url; 
      })
    );
    const formattedDate = formatDate(new Date());
    const newPost = new PostModel({
      caption,
      images: uploadedImgs,
      userId,
      uploadedDate: formattedDate,
    });
    await newPost.save();
    const posts = await PostModel.find().sort({ _id: -1 }).populate("userId");

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Post uploaded successfully", posts });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//like post
postController.likePost = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Liked post");
    
    const { userId, postId } = req.body;
    const post = await PostModel.findById(postId);
    console.log("post : ",post)
    if (!post) {
    return  res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Post is not found" });
    }
    await PostModel.findByIdAndUpdate(postId, { $push: { likes: userId } });
    const posts = await PostModel.find();
   return res.status(STATUS_CODES.OK).json({ message: "Liked successfully", posts });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//unlike post

postController.unlikePost = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("unliked post");
  try {
    const { userId, postId } = req.body;
    const post = await PostModel.findById(postId);
    if (!post) {
     return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Post is not found" });
    }

    await PostModel.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    const posts = await PostModel.find();

  return  res
      .status(STATUS_CODES.OK)
      .json({ message: "unliked successfully", posts });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//getuserPosts

postController.getUserPosts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {

    const { userId } = req.query;
    const posts = await PostModel.find({ userId });

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Posts fetched successfully", posts });
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
    const { postId } = req.query;
    const post = await PostModel.findById(postId).populate("userId");
    if (!post) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Post is not found" });
    }
    const commets = await CommentModel.find({ postId }).populate("userId");
    
    return res
      .status(STATUS_CODES.OK)
      .json({ message: "Post data fetched", commets, post });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//save post

postController.savePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postId, userId, collectionName } = req.body;
    console.log(postId,userId,collectionName)
    const user = await UserModal.findById(userId);
    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "User not found" });
    }

    let collection = await CollectionModel.findOne({
      user: userId,
      name: collectionName,
    });

    if (collection) {
      collection = await CollectionModel.findOneAndUpdate(
        { user: userId, name: collectionName },
        { $addToSet: { posts: postId } },
        { new: true } // Returns the updated document
      );
    } else {
      collection = new CollectionModel({
        user: userId,
        name: collectionName,
        posts: [postId],
      });
      await collection.save();
    }
    await CollectionModel.findOneAndUpdate(
      { user: userId, name: "All" },
      { $addToSet: { posts: postId } }
    );
    const allSavedPosts = await CollectionModel.findOne({
      user: userId,
      name: "All",
    }).populate("posts");
    const allSaved = allSavedPosts ? allSavedPosts.posts : [];

    const userWithSavedPosts = {
      ...user.toObject(),
      allSaved,
    };

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Post Saved", user: userWithSavedPosts });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//Remove save post

postController.removeSavePost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId, userId } = req.body;

    const user = await UserModal.findById(userId);
    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "User not found" });
    }

    const collections = await CollectionModel.find({
      user: userId,
      posts: postId,
    });

    for (const collection of collections) {
      collection.posts = collection.posts.filter(
        (post: any) => post.toString() !== postId
      );
      await collection.save();
    }

    res.status(STATUS_CODES.OK).json({ message: "Post removed successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//get all saved posts

postController.getAllSavedPosts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;
    const collections = await CollectionModel.find({ user: userId }).populate(
      "posts"
    );
    const allSavedPosts = await CollectionModel.find({ user: userId }).populate(
      "posts"
    );

    return res
      .status(STATUS_CODES.OK)
      .json({ message: "Post data fetched", savedPosts: allSavedPosts });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//get collections

postController.getCollections = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;
    const collections = await CollectionModel.find({ user: userId });
    const collectionNames = collections.map((item) => item.name);
    return res
      .status(STATUS_CODES.OK)
      .json({ message: "Post data fetched", collectionNames });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//delete post

postController.deletePost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId } = req.query;
    await CommentModel.deleteMany({ postId });
    await ReportedPostsModal.deleteMany({ postId });
    const deletedPost = await PostModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Post is not found" });
    }

    return res.status(STATUS_CODES.OK).json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


//list post

postController.listPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const postId = req.query.postId;
    const post = await PostModel.findById(postId);
    if(post.unListed){  
      await PostModel.findByIdAndUpdate(postId, {
        unListed :false
      });
    }else{
      await PostModel.findByIdAndUpdate(postId, {
        unListed :true
      });
    }
   
    res.status(STATUS_CODES.OK).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//Report post

postController.reportPost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId, userId, reason } = req.body;

    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Post is not found" });
    }
    const newReport = new ReportedPostsModal({ userId, postId, reason });
    await newReport.save();

    const distinctUserCount = (
      await ReportedPostsModal.distinct("userId", { postId })
    ).length;


    if (distinctUserCount === 2 || distinctUserCount > 2){
      await PostModel.findByIdAndUpdate(postId,{unListed:true});
    }
    
    
    res.status(STATUS_CODES.OK).json({ message: "Post reported" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//Get reported posts

postController.getReportedPosts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const allReportedPosts = await ReportedPostsModal.find()
      .sort({ _id: -1 })
      .populate("postId")
      .populate("userId");
    const reportedPosts = allReportedPosts.map((report) => {
      return {
        postId: report.postId._id,
        postImg: report.postId.images,
        username: report.userId.username,
        reason: report.reason,
        status: report.postId.unListed ? "Not active" : "active",
      };
    });
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Fetched all reported posts", reportedPosts });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//edit Post

postController.editPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postId, caption } = req.body;
    const updatedPost = await PostModel.findByIdAndUpdate(postId, {
      caption,
    });
    res.status(STATUS_CODES.OK).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//Get all posts

postController.getAllPosts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {

    let posts = await PostModel.find().sort({ _id: -1 }).populate("userId");

    // Create a new array of posts with comment counts
    const postsWithCommentCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await CommentModel.countDocuments({ postId: post._id });
        return { ...post._doc, commentCount }; // Spread operator to merge post document and comment count
      })
    );
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Data fetched successfully", posts :postsWithCommentCounts });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export default postController;
