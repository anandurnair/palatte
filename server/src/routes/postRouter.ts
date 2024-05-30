import express from "express";
const postRouter = express.Router()
import postController from '../controllers/postController'
import commentController from "../controllers/commentController";
import verifyToken from '../middlewares/auth' 

postRouter.post('/add-post',verifyToken,postController.addPost)
postRouter.get('/get-all-posts',verifyToken,postController.getAllPosts)
postRouter.post('/add-comment',verifyToken,commentController.addComment)
postRouter.post('/add-reply',verifyToken,commentController.addReply)
postRouter.get('/get-post-comment',verifyToken,commentController.getPostComment)
postRouter.get('/get-all-comments',verifyToken,commentController.getAllComments)
postRouter.get('/get-user-posts',verifyToken,postController.getUserPosts)
postRouter.post('/save-post',verifyToken, postController.savePost)
postRouter.get('/get-all-saved-posts',verifyToken,postController.getAllSavedPosts)
postRouter.post('/remove-save-Post',verifyToken,postController.removeSavePost)
postRouter.post('/like-post',verifyToken,postController.likePost)
postRouter.post('/unlike-post',verifyToken,postController.unlikePost)
postRouter.get('/get-post-details',verifyToken,postController.getPostDetail)
postRouter.delete('/delete-post',verifyToken,postController.deletePost)
postRouter.post('/report-post',verifyToken,postController.reportPost)
postRouter.get('/get-all-reportedPosts',postController.getReportedPosts)
postRouter.patch('/edit-post',verifyToken,postController.editPost)
postRouter.delete('/delete-comment',verifyToken,commentController.deleteComment)
postRouter.post('/report-comment',verifyToken,commentController.reportComment)
postRouter.get('/get-all-reported-comments',commentController.getAllReportedComments);
postRouter.get('/get-collections',verifyToken,postController.getCollections)
postRouter.patch('/list-post',postController.listPost)
export default postRouter





