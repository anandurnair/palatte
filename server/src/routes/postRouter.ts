import express from "express";
const postRouter = express.Router()
import postController from '../controllers/postController'
import commentController from "../controllers/commentController";

postRouter.post('/add-post',postController.addPost)
postRouter.get('/get-all-posts',postController.getAllPosts)
postRouter.post('/add-comment',commentController.addComment)
postRouter.get('/get-post-comment',commentController.getPostComment)
postRouter.get('/get-all-comments',commentController.getAllComments)
postRouter.get('/get-user-posts',postController.getUserPosts)
postRouter.post('/save-post',postController.savePost)
postRouter.post('/remove-save-Post',postController.removeSavePost)
postRouter.post('/like-post',postController.likePost)
postRouter.post('/unlike-post',postController.unlikePost)
postRouter.get('/get-post-details',postController.getPostDetail)

export default postRouter





