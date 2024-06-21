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
var comment_1 = __importDefault(require("../models/comment"));
var reportComments_1 = __importDefault(require("../models/reportComments"));
var CommentRepository = /** @class */ (function () {
    function CommentRepository() {
    }
    CommentRepository.prototype.addComment = function (commentData) {
        return __awaiter(this, void 0, void 0, function () {
            var newComment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newComment = new comment_1.default(commentData);
                        return [4 /*yield*/, newComment.save()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommentRepository.prototype.findCommentsByPostId = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, comment_1.default.find({ postId: postId, parentCommentId: null })
                            .populate("userId")
                            .populate({
                            path: 'replies',
                            populate: {
                                path: 'userId',
                                model: 'Users',
                            },
                        })
                            .sort({ _id: -1 })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommentRepository.prototype.findCommentById = function (commentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, comment_1.default.findById(commentId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommentRepository.prototype.deleteCommentById = function (commentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, comment_1.default.findByIdAndDelete(commentId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommentRepository.prototype.findAllComments = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, comment_1.default.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommentRepository.prototype.addReply = function (replyData) {
        return __awaiter(this, void 0, void 0, function () {
            var newReply;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newReply = new comment_1.default(replyData);
                        return [4 /*yield*/, newReply.save()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommentRepository.prototype.updateComment = function (commentId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, comment_1.default.findByIdAndUpdate(commentId, updateData, { new: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommentRepository.prototype.reportComment = function (reportData) {
        return __awaiter(this, void 0, void 0, function () {
            var newReport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newReport = new reportComments_1.default(reportData);
                        return [4 /*yield*/, newReport.save()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommentRepository.prototype.getDistinctUserCount = function (commentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, reportComments_1.default.distinct("userId", { commentId: commentId })];
                    case 1: return [2 /*return*/, (_a.sent()).length];
                }
            });
        });
    };
    CommentRepository.prototype.deleteReportedComments = function (commentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, reportComments_1.default.deleteMany({ commentId: commentId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommentRepository.prototype.getAllReportedComments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allReports;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, reportComments_1.default.find()
                            .sort({ _id: -1 })
                            .populate('userId')
                            .populate('postId')
                            .populate('commentId')];
                    case 1:
                        allReports = _a.sent();
                        return [2 /*return*/, allReports.map(function (report) { return ({
                                reportId: report._id,
                                postImg: report.postId.images,
                                postId: report.postId._id,
                                username: report.userId.username,
                                comment: report.commentId.comment,
                                reason: report.reason,
                                status: report.commentId.isBlocked ? "Not active" : 'active',
                            }); })];
                }
            });
        });
    };
    return CommentRepository;
}());
exports.default = new CommentRepository();
//# sourceMappingURL=CommentRepository.js.map