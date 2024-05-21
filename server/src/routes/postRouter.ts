import express from "express";
const postRouter = express.Router()
import postController from '../controllers/postController'
import commentController from "../controllers/commentController";

postRouter.post('/add-post',postController.addPost)
postRouter.get('/get-all-posts',postController.getAllPosts)
postRouter.post('/add-comment',commentController.addComment)
postRouter.post('/add-reply',commentController.addReply)
postRouter.get('/get-post-comment',commentController.getPostComment)
postRouter.get('/get-all-comments',commentController.getAllComments)
postRouter.get('/get-user-posts',postController.getUserPosts)
postRouter.post('/save-post',postController.savePost)
postRouter.get('/get-all-saved-posts',postController.getAllSavedPosts)
postRouter.post('/remove-save-Post',postController.removeSavePost)
postRouter.post('/like-post',postController.likePost)
postRouter.post('/unlike-post',postController.unlikePost)
postRouter.get('/get-post-details',postController.getPostDetail)
postRouter.delete('/delete-post',postController.deletePost)
postRouter.post('/report-post',postController.reportPost)
postRouter.get('/get-all-reportedPosts',postController.getReportedPosts)
postRouter.patch('/edit-post',postController.editPost)
postRouter.delete('/delete-comment',commentController.deleteComment)
postRouter.post('/report-comment',commentController.reportComment)
postRouter.get('/get-all-reported-comments',commentController.getAllReportedComments);
postRouter.get('/get-collections',postController.getCollections)
export default postRouter





function mid (){
    console.log('working....!')
}