"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __importDefault(require("../models/user"));
var constants_1 = __importDefault(require("../utils/constants"));
var conversation_1 = __importDefault(require("../models/conversation"));
var message_1 = __importDefault(require("../models/message"));
var groupConversation_1 = __importDefault(require("../models/groupConversation"));
var notifications_1 = __importDefault(require("../models/notifications"));
var calls_1 = __importDefault(require("../models/calls"));
var messageController = {};
//start converstation
messageController.startConversation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var existingConversation, newConversation, savedConversation, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                console.log("new conversation :", req.body);
                return [4 /*yield*/, conversation_1.default.findOne({
                        members: { $all: [req.body.senderId, req.body.receiverId] },
                    })];
            case 1:
                existingConversation = _a.sent();
                if (existingConversation) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ message: "Conversation already exists" })];
                }
                newConversation = new conversation_1.default({
                    members: [req.body.senderId, req.body.receiverId],
                });
                return [4 /*yield*/, newConversation.save()];
            case 2:
                savedConversation = _a.sent();
                res.status(constants_1.default.OK).json({
                    message: "conversation created successfully",
                    conversation: savedConversation,
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
//get conversation
messageController.getConversation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, conversations, updatedConversations, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.params.userId;
                if (!userId) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "User ID is required" })];
                }
                return [4 /*yield*/, conversation_1.default.find({
                        members: { $in: [userId] },
                    })];
            case 1:
                conversations = _a.sent();
                if (!conversations || conversations.length === 0) {
                    return [2 /*return*/, res
                            .status(constants_1.default.NOT_FOUND)
                            .json({ message: "No conversations found" })];
                }
                return [4 /*yield*/, Promise.all(conversations.map(function (conversation) { return __awaiter(void 0, void 0, void 0, function () {
                        var messages, lastSender, unreadMessageCount;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, message_1.default.find({ conversationId: conversation._id })];
                                case 1:
                                    messages = _a.sent();
                                    if (!(messages.length > 0)) return [3 /*break*/, 3];
                                    lastSender = messages[messages.length - 1].sender;
                                    return [4 /*yield*/, message_1.default.countDocuments({
                                            conversationId: conversation._id,
                                            status: "delivered"
                                        })];
                                case 2:
                                    unreadMessageCount = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, conversation._doc), { unreadCount: unreadMessageCount, lastSenderId: lastSender })];
                                case 3: return [2 /*return*/, __assign(__assign({}, conversation._doc), { unreadCount: 0, lastSenderId: null })];
                            }
                        });
                    }); }))];
            case 2:
                updatedConversations = _a.sent();
                //last sender
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Conversation fetched successfully", conversations: updatedConversations });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error fetching conversation:", error_2);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
//Group conversation
messageController.createGroupConversation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, groupName, members, admin, description, groupImage, newConversation, savedConversation, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, groupName = _a.groupName, members = _a.members, admin = _a.admin, description = _a.description, groupImage = _a.groupImage;
                members.push(admin);
                newConversation = new groupConversation_1.default({
                    groupName: groupName,
                    members: members,
                    admin: admin,
                    description: description,
                    groupImage: groupImage,
                });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, newConversation.save()];
            case 2:
                savedConversation = _b.sent();
                res.status(constants_1.default.OK).json(savedConversation);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                res.status(constants_1.default.INTERNAL_SERVER_ERROR).json(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
messageController.getGroupConversations = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var conversations, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, groupConversation_1.default.find({
                        members: { $in: [req.params.userId] },
                    })];
            case 1:
                conversations = _a.sent();
                res.status(constants_1.default.OK).json(conversations);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(constants_1.default.INTERNAL_SERVER_ERROR).json(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//send message
messageController.sendMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, conversationId, sender, text, newMessage, savedMessage, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, conversationId = _a.conversationId, sender = _a.sender, text = _a.text;
                newMessage = new message_1.default({ conversationId: conversationId, sender: sender, text: text });
                return [4 /*yield*/, newMessage.save()];
            case 1:
                savedMessage = _b.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "New message sent", savedMessage: savedMessage });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error(error_3);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
messageController.getMessages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var conversationId, messages, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                conversationId = req.params.conversationId;
                return [4 /*yield*/, message_1.default.find({ conversationId: conversationId })];
            case 1:
                messages = _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Conversations fetched", messages: messages });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error(error_4);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
messageController.deleteMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messageId, message, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                messageId = req.query.messageId;
                return [4 /*yield*/, message_1.default.findById(messageId)];
            case 1:
                message = _a.sent();
                if (!message) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ message: "Messge is not found" })];
                }
                return [4 /*yield*/, message_1.default.findByIdAndDelete(messageId)];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Message Deleted" })];
            case 3:
                error_5 = _a.sent();
                console.error(error_5);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
//Notifications
messageController.postNotification = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, text, user, newNotification, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, userId = _a.userId, text = _a.text, user = _a.user;
                newNotification = new notifications_1.default({
                    toUser: userId,
                    text: text,
                    fromUser: user._id,
                });
                return [4 /*yield*/, newNotification.save()];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Notification added" })];
            case 2:
                error_6 = _b.sent();
                console.error(error_6);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
messageController.getNotification = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, notifications, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                return [4 /*yield*/, notifications_1.default.find({
                        toUser: userId,
                    }).populate("fromUser")];
            case 1:
                notifications = _a.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "Notification fetched", notifications: notifications })];
            case 2:
                error_7 = _a.sent();
                console.error(error_7);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
messageController.removeNotification = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var index, userId, notifications, notificationId, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                index = parseInt(req.query.index, 10);
                userId = req.query.userId;
                if (isNaN(index)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid index parameter" })];
                }
                return [4 /*yield*/, notifications_1.default.find({ toUser: userId }).exec()];
            case 1:
                notifications = _a.sent();
                if (index < 0 || index >= notifications.length) {
                    return [2 /*return*/, res.status(400).json({ error: "Index out of range" })];
                }
                notificationId = notifications[index]._id;
                return [4 /*yield*/, notifications_1.default.findByIdAndDelete(notificationId)];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Notification deleted" })];
            case 3:
                error_8 = _a.sent();
                console.error(error_8);
                res.status(constants_1.default.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
messageController.removeAllNotifications = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, notifications, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                return [4 /*yield*/, notifications_1.default.deleteMany({
                        toUser: userId,
                    })];
            case 1:
                notifications = _a.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "Notifications cleared" })];
            case 2:
                error_9 = _a.sent();
                console.error(error_9);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
messageController.updateMessageStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, conversationId, senderId, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, conversationId = _a.conversationId, senderId = _a.senderId;
                return [4 /*yield*/, message_1.default.updateMany({ conversationId: conversationId, sender: { $ne: senderId } }, { status: "seen" })];
            case 1:
                _b.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "Notifications cleared" })];
            case 2:
                error_10 = _b.sent();
                console.error(error_10);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
messageController.saveCalls = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var members, newCall, savedCall, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                members = req.body;
                newCall = new calls_1.default({
                    members: members,
                });
                return [4 /*yield*/, newCall.save()];
            case 1:
                savedCall = _a.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "Call saved" })];
            case 2:
                error_11 = _a.sent();
                console.error(error_11);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
messageController.getCallHistory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, calls, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                return [4 /*yield*/, calls_1.default.find({ members: { $in: userId } }).populate({
                        path: "members",
                        model: user_1.default
                    })];
            case 1:
                calls = _a.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "Calls fetched successfully", calls: calls })];
            case 2:
                error_12 = _a.sent();
                console.error(error_12);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.default = messageController;
//# sourceMappingURL=messageController.js.map