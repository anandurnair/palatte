import express from "express";
const conversationRouter = express.Router()
import conversationModal from "../models/conversation";
import messageController from '../controllers/messageController';
import verifyToken from '../middlewares/auth' 
import NotificationModel from "../models/notifications";

//Individual

conversationRouter.post('/conversation',messageController.startConversation)
conversationRouter.get('/conversation/:userId',messageController.getConversation)

//Group

conversationRouter.post('/conversation/group',messageController.createGroupConversation);
conversationRouter.get('/conversation/group/:userId', messageController.getGroupConversations);

//Messages

conversationRouter.post('/messages',messageController.sendMessage);
conversationRouter.get('/messages/:conversationId',messageController.getMessages)
conversationRouter.delete('/delete-message',messageController.deleteMessage);
//group  conversation 


//Notifications

conversationRouter.post('/post-notification',messageController.postNotification)
conversationRouter.get('/get-notifications',messageController.getNotification)
conversationRouter.delete('/remove-notification',messageController.removeNotification)
conversationRouter.delete('/remove-all-notifications',messageController.removeAllNotifications)

export default conversationRouter