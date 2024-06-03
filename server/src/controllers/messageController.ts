import { Request, Response } from "express";

import UserModal from "../models/user";
import STATUS_CODES from "../utils/constants";
import ConversationModal from "../models/conversation";
import MessageModel from "../models/message";
import GroupConversationModal from "../models/groupConversation";
import NotificationModel from "../models/notifications";
const messageController: any = {};

//start converstation

messageController.startConversation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log("new conversation :", req.body);
    const existingConversation = await ConversationModal.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });
    console.log("is conversation exists : ", existingConversation);
    if (existingConversation) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Conversation already exists" });
    }
    const newConversation = new ConversationModal({
      members: [req.body.senderId, req.body.receiverId],
    });
    const savedConversation = await newConversation.save();
    console.log(newConversation);
    res.status(STATUS_CODES.OK).json({
      message: "conversation created successfully",
      conversation: savedConversation,
    });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//get conversation

messageController.getConversation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "User ID is required" });
    }

    const conversation = await ConversationModal.find({
      members: { $in: [userId] },
    });

    if (!conversation) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "No conversations found" });
    }

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Conversation fetched successfully", conversation });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//Group conversation

messageController.createGroupConversation = async (
  req: Request,
  res: Response
) => {
  const { groupName, members, admin, description, groupImage } = req.body;
  members.push(admin);
  console.log("group info : ", req.body);
  const newConversation = new GroupConversationModal({
    groupName,
    members,
    admin,
    description,
    groupImage,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(STATUS_CODES.OK).json(savedConversation);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
  }
};

messageController.getGroupConversations = async (
  req: Request,
  res: Response
) => {
  try {
    const conversations = await GroupConversationModal.find({
      members: { $in: [req.params.userId] },
    });
    res.status(STATUS_CODES.OK).json(conversations);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(err);
  }
};

//send message
messageController.sendMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log("Body :", req.body);
    const { conversationId, sender, text }: any = req.body;
    console.log("conversation Id : ", conversationId);
    const newMessage = new MessageModel({ conversationId, sender, text });
    const savedMessage = await newMessage.save();
    res
      .status(STATUS_CODES.OK)
      .json({ message: "New message sent", savedMessage });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

messageController.getMessages = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const conversationId = req.params.conversationId;
    const messages = await MessageModel.find({ conversationId });
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Conversations fetched", messages });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

messageController.deleteMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const messageId = req.query.messageId;
    const message = await MessageModel.findById(messageId);
    console.log(message);
    if (!message) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Messge is not found" });
    }
    await MessageModel.findByIdAndDelete(messageId);
    return res.status(200).json({ message: "Message Deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//Notifications

messageController.postNotification = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, text, user } = req.body;
    const newNotification = new NotificationModel({
      toUser: userId,
      text,
      fromUser: user._id,
    });
    await newNotification.save();
    return res.status(200).json({ message: "Notification added" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

messageController.getNotification = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.query.userId;
    console.log("user  id : ", userId);
    const notifications = await NotificationModel.find({
      toUser: userId,
    }).populate("fromUser");
    console.log("Notifications :", notifications);
    return res
      .status(200)
      .json({ message: "Notification fetched", notifications });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

messageController.removeNotification = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const index = parseInt(req.query.index as string, 10);
    const userId = req.query.userId as string;

    if (isNaN(index)) {
      return res.status(400).json({ error: "Invalid index parameter" });
    }

    const notifications = await NotificationModel.find({ toUser: userId }).exec();

    if (index < 0 || index >= notifications.length) {
      return res.status(400).json({ error: "Index out of range" });
    }

    const notificationId = notifications[index]._id;
    await NotificationModel.findByIdAndDelete(notificationId);

    return res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};


messageController.removeAllNotifications = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.query.userId;
    const notifications = await NotificationModel.deleteMany({
      toUser: userId,
    })
    return res
      .status(200)
      .json({ message: "Notifications cleared" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export default messageController;