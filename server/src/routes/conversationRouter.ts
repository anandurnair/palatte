import express from "express";
const conversationRouter = express.Router()
import conversationModal from "../models/conversation";
import messageController from '../controllers/messageController';
import verifyToken from '../middlewares/auth' 
import NotificationModel from "../models/notifications";

//Individual

conversationRouter.post('/conversation',verifyToken,messageController.startConversation)
conversationRouter.get('/conversation/:userId',verifyToken,messageController.getConversation)

//Group

conversationRouter.post('/conversation/group',verifyToken,messageController.createGroupConversation);
conversationRouter.get('/conversation/group/:userId',verifyToken, messageController.getGroupConversations);

//Messages

conversationRouter.post('/messages',verifyToken,messageController.sendMessage);
conversationRouter.get('/messages/:conversationId',verifyToken,messageController.getMessages)
conversationRouter.delete('/delete-message',verifyToken,messageController.deleteMessage);
//group  conversation 


//Notifications

conversationRouter.post('/post-notification',verifyToken,messageController.postNotification)
conversationRouter.get('/get-notifications',verifyToken,messageController.getNotification)
conversationRouter.delete('/remove-notification',verifyToken,messageController.removeNotification)
conversationRouter.delete('/remove-all-notifications',verifyToken,messageController.removeAllNotifications)

export default conversationRouter