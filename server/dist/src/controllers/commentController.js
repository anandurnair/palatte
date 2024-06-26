"use strict";
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
var constants_1 = __importDefault(require("../utils/constants"));
var comment_1 = __importDefault(require("../models/comment"));
var reportComments_1 = __importDefault(require("../models/reportComments"));
var commentController = {};
var formatDate = function (date) {
    var options = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        day: "2-digit",
        month: "long",
        year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
};
commentController.addComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId, userId, comment, newComment, comments, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                console.log('comment added');
                _a = req.body, postId = _a.postId, userId = _a.userId, comment = _a.comment;
                newComment = new comment_1.default({
                    postId: postId,
                    userId: userId,
                    comment: comment,
                    parentCommentId: null,
                    date: formatDate(new Date()),
                });
                return [4 /*yield*/, newComment.save()];
            case 1:
                _b.sent();
                return [4 /*yield*/, comment_1.default.find({ postId: postId, parentCommentId: null })
                        .populate("userId").populate({
                        path: 'replies',
                        populate: { path: 'replies' },
                    }).sort({ _id: -1 })];
            case 2:
                comments = _b.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Successfully added", comments: comments });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error(error_1);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
commentController.addReply = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId, userId, comment, parentCommentId, parentComment, newReply, comments, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, postId = _a.postId, userId = _a.userId, comment = _a.comment, parentCommentId = _a.parentCommentId;
                return [4 /*yield*/, comment_1.default.findById(parentCommentId)];
            case 1:
                parentComment = _b.sent();
                if (!parentComment) {
                    return [2 /*return*/, res.status(constants_1.default.BAD_REQUEST).json({ error: 'Parent comment not found' })];
                }
                console.log("parent Comment");
                newReply = new comment_1.default({
                    postId: postId,
                    userId: userId,
                    comment: comment,
                    parentCommentId: parentCommentId,
                    date: formatDate(new Date()),
                });
                return [4 /*yield*/, newReply.save()];
            case 2:
                _b.sent();
                parentComment.replies.push(newReply._id);
                return [4 /*yield*/, parentComment.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, comment_1.default.find({ postId: postId, parentCommentId: null })
                        .populate("userId").populate({
                        path: 'replies',
                        populate: { path: 'replies' },
                    }).sort({ _id: -1 })];
            case 4:
                comments = _b.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: 'Reply added successfully', comments: comments });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.error(error_2);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
commentController.getPostComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, comments, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                postId = req.query.postId;
                return [4 /*yield*/, comment_1.default.find({ postId: postId, parentCommentId: null })
                        .populate("userId")
                        .populate({
                        path: 'replies',
                        populate: {
                            path: 'userId',
                            model: 'Users',
                        },
                    })
                        .sort({ _id: -1 })];
            case 1:
                comments = _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Comments successfully fetched", comments: comments });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error(error_3);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
commentController.getAllComments = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allComments, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, comment_1.default.find()];
            case 1:
                allComments = _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Comments successfully fetched", allComments: allComments });
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
//delete comment
commentController.deleteComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, isExist, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                commentId = req.query.commentId;
                return [4 /*yield*/, comment_1.default.findById(commentId)];
            case 1:
                isExist = _a.sent();
                if (!isExist) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Comment is not found" })];
                }
                return [4 /*yield*/, comment_1.default.findByIdAndDelete(commentId)];
            case 2:
                _a.sent();
                return [4 /*yield*/, reportComments_1.default.findOneAndDelete({ commentId: commentId })];
            case 3:
                _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Comment successfully deleted" });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error(error_5);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
//report comment
commentController.reportComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, commentId, postId, userId, reason, comment, newReport, distinctUserCount, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, commentId = _a.commentId, postId = _a.postId, userId = _a.userId, reason = _a.reason;
                return [4 /*yield*/, comment_1.default.findById(commentId)];
            case 1:
                comment = _b.sent();
                if (!comment) {
                    return [2 /*return*/, res.status(constants_1.default.BAD_REQUEST).json({ error: "Comment is not found" })];
                }
                newReport = new reportComments_1.default({ userId: userId, postId: postId, commentId: commentId, reason: reason });
                return [4 /*yield*/, newReport.save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, reportComments_1.default.distinct("userId", { commentId: commentId })];
            case 3:
                distinctUserCount = (_b.sent()).length;
                if (!(distinctUserCount === 3 && distinctUserCount > 3)) return [3 /*break*/, 6];
                return [4 /*yield*/, comment_1.default.findByIdAndDelete(commentId)];
            case 4:
                _b.sent();
                return [4 /*yield*/, reportComments_1.default.deleteMany({ commentId: commentId })];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6: return [2 /*return*/, res.status(constants_1.default.OK).json({ message: "Comment reported" })];
            case 7:
                error_6 = _b.sent();
                console.error(error_6);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
//get all reported comments
commentController.getAllReportedComments = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allReports, reportedComments, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, reportComments_1.default.find().sort({ _id: -1 }).populate('userId').populate('postId').populate('commentId')];
            case 1:
                allReports = _a.sent();
                reportedComments = allReports.map(function (report) {
                    return {
                        reportId: report._id,
                        postImg: report.postId.images,
                        postId: report.postId._id,
                        username: report.userId.username,
                        comment: report.commentId.comment,
                        reason: report.reason,
                        status: report.commentId.isBlocked ? "Not active" : 'active'
                    };
                });
                return [2 /*return*/, res.status(constants_1.default.OK).json({ message: "fetched reports successfully", reportedComments: reportedComments })];
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
exports.default = commentController;
//# sourceMappingURL=commentController.js.map