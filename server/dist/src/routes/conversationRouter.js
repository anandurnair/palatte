"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var conversationRouter = express_1.default.Router();
var messageController_1 = __importDefault(require("../controllers/messageController"));
//Individual
conversationRouter.post('/conversation', messageController_1.default.startConversation);
conversationRouter.get('/conversation/:userId', messageController_1.default.getConversation);
//Group
conversationRouter.post('/conversation/group', messageController_1.default.createGroupConversation);
conversationRouter.get('/conversation/group/:userId', messageController_1.default.getGroupConversations);
//Messages
conversationRouter.post('/messages', messageController_1.default.sendMessage);
conversationRouter.get('/messages/:conversationId', messageController_1.default.getMessages);
conversationRouter.delete('/delete-message', messageController_1.default.deleteMessage);
conversationRouter.patch('/update-message-status', messageController_1.default.updateMessageStatus);
//group  conversation 
conversationRouter.post('/saveCalls', messageController_1.default.saveCalls);
conversationRouter.get('/get-call-history', messageController_1.default.getCallHistory);
//Notifications
conversationRouter.post('/post-notification', messageController_1.default.postNotification);
conversationRouter.get('/get-notifications', messageController_1.default.getNotification);
conversationRouter.delete('/remove-notification', messageController_1.default.removeNotification);
conversationRouter.delete('/remove-all-notifications', messageController_1.default.removeAllNotifications);
exports.default = conversationRouter;
//# sourceMappingURL=conversationRouter.js.map