import express from "express";
const conversationRouter = express.Router()
import conversationModal from "../models/conversation";
import messageController from '../controllers/messageController';
import verifyToken from '../middlewares/auth' 


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


export default conversationRouter