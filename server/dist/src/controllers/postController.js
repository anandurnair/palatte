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
var post_1 = __importDefault(require("../models/post"));
var user_1 = __importDefault(require("../models/user"));
var constants_1 = __importDefault(require("../utils/constants"));
var comment_1 = __importDefault(require("../models/comment"));
var cloudinary = require("../utils/cloudinary").cloudinary;
var reportedPosts_1 = __importDefault(require("../models/reportedPosts"));
var collections_1 = __importDefault(require("../models/collections"));
var postController = {};
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
postController.addPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, caption, images, user, uploadedImgs, formattedDate, newPost, posts, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, userId = _a.userId, caption = _a.caption, images = _a.images;
                return [4 /*yield*/, user_1.default.findById(userId)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Invalid User" })];
                }
                return [4 /*yield*/, Promise.all(images.map(function (image) { return __awaiter(void 0, void 0, void 0, function () {
                        var uploadResponse;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, cloudinary.uploader.upload(image, {
                                        resource_type: "auto",
                                    })];
                                case 1:
                                    uploadResponse = _a.sent();
                                    return [2 /*return*/, uploadResponse.url];
                            }
                        });
                    }); }))];
            case 2:
                uploadedImgs = _b.sent();
                formattedDate = formatDate(new Date());
                newPost = new post_1.default({
                    caption: caption,
                    images: uploadedImgs,
                    userId: userId,
                    uploadedDate: formattedDate,
                });
                return [4 /*yield*/, newPost.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, post_1.default.find().sort({ _id: -1 }).populate("userId")];
            case 4:
                posts = _b.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Post uploaded successfully", posts: posts });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.error(error_1);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
//like post
postController.likePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, postId, post, posts, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                console.log("Liked post");
                _a = req.body, userId = _a.userId, postId = _a.postId;
                return [4 /*yield*/, post_1.default.findById(postId)];
            case 1:
                post = _b.sent();
                console.log("post : ", post);
                if (!post) {
                    return [2 /*return*/, res.status(constants_1.default.BAD_REQUEST).json({ error: "Post is not found" })];
                }
                return [4 /*yield*/, post_1.default.findByIdAndUpdate(postId, { $push: { likes: userId } })];
            case 2:
                _b.sent();
                return [4 /*yield*/, post_1.default.find()];
            case 3:
                posts = _b.sent();
                return [2 /*return*/, res.status(constants_1.default.OK).json({ message: "Liked successfully", posts: posts })];
            case 4:
                error_2 = _b.sent();
                console.error(error_2);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
//unlike post
postController.unlikePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, postId, post, posts, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("unliked post");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                _a = req.body, userId = _a.userId, postId = _a.postId;
                return [4 /*yield*/, post_1.default.findById(postId)];
            case 2:
                post = _b.sent();
                if (!post) {
                    return [2 /*return*/, res.status(constants_1.default.BAD_REQUEST).json({ error: "Post is not found" })];
                }
                return [4 /*yield*/, post_1.default.findByIdAndUpdate(postId, { $pull: { likes: userId } })];
            case 3:
                _b.sent();
                return [4 /*yield*/, post_1.default.find()];
            case 4:
                posts = _b.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: "unliked successfully", posts: posts })];
            case 5:
                error_3 = _b.sent();
                console.error(error_3);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
//getuserPosts
postController.getUserPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, posts, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                return [4 /*yield*/, post_1.default.find({ userId: userId })];
            case 1:
                posts = _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Posts fetched successfully", posts: posts });
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
//get Post detail
postController.getPostDetail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, post, commets, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                postId = req.query.postId;
                return [4 /*yield*/, post_1.default.findById(postId).populate("userId")];
            case 1:
                post = _a.sent();
                if (!post) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Post is not found" })];
                }
                return [4 /*yield*/, comment_1.default.find({ postId: postId }).populate("userId")];
            case 2:
                commets = _a.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: "Post data fetched", commets: commets, post: post })];
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
//save post
postController.savePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId, userId, collectionName, user, collection, allSavedPosts, allSaved, userWithSavedPosts, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                _a = req.body, postId = _a.postId, userId = _a.userId, collectionName = _a.collectionName;
                console.log(postId, userId, collectionName);
                return [4 /*yield*/, user_1.default.findById(userId)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "User not found" })];
                }
                return [4 /*yield*/, collections_1.default.findOne({
                        user: userId,
                        name: collectionName,
                    })];
            case 2:
                collection = _b.sent();
                if (!collection) return [3 /*break*/, 4];
                return [4 /*yield*/, collections_1.default.findOneAndUpdate({ user: userId, name: collectionName }, { $addToSet: { posts: postId } }, { new: true } // Returns the updated document
                    )];
            case 3:
                collection = _b.sent();
                return [3 /*break*/, 6];
            case 4:
                collection = new collections_1.default({
                    user: userId,
                    name: collectionName,
                    posts: [postId],
                });
                return [4 /*yield*/, collection.save()];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6: return [4 /*yield*/, collections_1.default.findOneAndUpdate({ user: userId, name: "All" }, { $addToSet: { posts: postId } })];
            case 7:
                _b.sent();
                return [4 /*yield*/, collections_1.default.findOne({
                        user: userId,
                        name: "All",
                    }).populate("posts")];
            case 8:
                allSavedPosts = _b.sent();
                allSaved = allSavedPosts ? allSavedPosts.posts : [];
                userWithSavedPosts = __assign(__assign({}, user.toObject()), { allSaved: allSaved });
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Post Saved", user: userWithSavedPosts });
                return [3 /*break*/, 10];
            case 9:
                error_6 = _b.sent();
                console.error(error_6);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
//Remove save post
postController.removeSavePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId_1, userId, user, collections, _i, collections_2, collection, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, postId_1 = _a.postId, userId = _a.userId;
                return [4 /*yield*/, user_1.default.findById(userId)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "User not found" })];
                }
                return [4 /*yield*/, collections_1.default.find({
                        user: userId,
                        posts: postId_1,
                    })];
            case 2:
                collections = _b.sent();
                _i = 0, collections_2 = collections;
                _b.label = 3;
            case 3:
                if (!(_i < collections_2.length)) return [3 /*break*/, 6];
                collection = collections_2[_i];
                collection.posts = collection.posts.filter(function (post) { return post.toString() !== postId_1; });
                return [4 /*yield*/, collection.save()];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                res.status(constants_1.default.OK).json({ message: "Post removed successfully" });
                return [3 /*break*/, 8];
            case 7:
                error_7 = _b.sent();
                console.error(error_7);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
//get all saved posts
postController.getAllSavedPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, collections, allSavedPosts, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.query.userId;
                return [4 /*yield*/, collections_1.default.find({ user: userId }).populate("posts")];
            case 1:
                collections = _a.sent();
                return [4 /*yield*/, collections_1.default.find({ user: userId }).populate("posts")];
            case 2:
                allSavedPosts = _a.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: "Post data fetched", savedPosts: allSavedPosts })];
            case 3:
                error_8 = _a.sent();
                console.error(error_8);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
//get collections
postController.getCollections = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, collections, collectionNames, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                return [4 /*yield*/, collections_1.default.find({ user: userId })];
            case 1:
                collections = _a.sent();
                collectionNames = collections.map(function (item) { return item.name; });
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: "Post data fetched", collectionNames: collectionNames })];
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
//delete post
postController.deletePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, deletedPost, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                postId = req.query.postId;
                return [4 /*yield*/, comment_1.default.deleteMany({ postId: postId })];
            case 1:
                _a.sent();
                return [4 /*yield*/, reportedPosts_1.default.deleteMany({ postId: postId })];
            case 2:
                _a.sent();
                return [4 /*yield*/, post_1.default.findByIdAndDelete(postId)];
            case 3:
                deletedPost = _a.sent();
                console.log("Delte : ", deletedPost);
                if (!deletedPost) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Post is not found" })];
                }
                return [2 /*return*/, res.status(constants_1.default.OK).json({ message: "Post deleted" })];
            case 4:
                error_10 = _a.sent();
                console.error(error_10);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
//list post
postController.listPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, post, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                postId = req.query.postId;
                return [4 /*yield*/, post_1.default.findById(postId)];
            case 1:
                post = _a.sent();
                if (!post.unListed) return [3 /*break*/, 3];
                return [4 /*yield*/, post_1.default.findByIdAndUpdate(postId, {
                        unListed: false
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, post_1.default.findByIdAndUpdate(postId, {
                    unListed: true
                })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                res.status(constants_1.default.OK).json({ message: "Post updated successfully" });
                return [3 /*break*/, 7];
            case 6:
                error_11 = _a.sent();
                console.error(error_11);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
//Report post
postController.reportPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId, userId, reason, post, newReport, distinctUserCount, error_12;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, postId = _a.postId, userId = _a.userId, reason = _a.reason;
                return [4 /*yield*/, post_1.default.findById(postId)];
            case 1:
                post = _b.sent();
                if (!post) {
                    res.status(constants_1.default.BAD_REQUEST).json({ error: "Post is not found" });
                }
                newReport = new reportedPosts_1.default({ userId: userId, postId: postId, reason: reason });
                return [4 /*yield*/, newReport.save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, reportedPosts_1.default.distinct("userId", { postId: postId })];
            case 3:
                distinctUserCount = (_b.sent()).length;
                if (!(distinctUserCount === 2 || distinctUserCount > 2)) return [3 /*break*/, 5];
                return [4 /*yield*/, post_1.default.findByIdAndUpdate(postId, { unListed: true })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                res.status(constants_1.default.OK).json({ message: "Post reported" });
                return [3 /*break*/, 7];
            case 6:
                error_12 = _b.sent();
                console.error(error_12);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
//Get reported posts
postController.getReportedPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allReportedPosts, reportedPosts, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, reportedPosts_1.default.find()
                        .sort({ _id: -1 })
                        .populate("postId")
                        .populate("userId")];
            case 1:
                allReportedPosts = _a.sent();
                reportedPosts = allReportedPosts.map(function (report) {
                    return {
                        postId: report.postId._id,
                        postImg: report.postId.images,
                        username: report.userId.username,
                        reason: report.reason,
                        status: report.postId.unListed ? "Not active" : "active",
                    };
                });
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Fetched all reported posts", reportedPosts: reportedPosts });
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                console.error(error_13);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//edit Post
postController.editPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId, caption, updatedPost, error_14;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, postId = _a.postId, caption = _a.caption;
                return [4 /*yield*/, post_1.default.findByIdAndUpdate(postId, {
                        caption: caption,
                    })];
            case 1:
                updatedPost = _b.sent();
                res.status(constants_1.default.OK).json({ message: "Post updated successfully" });
                return [3 /*break*/, 3];
            case 2:
                error_14 = _b.sent();
                console.error(error_14);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//Get all posts
postController.getAllPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, postsWithCommentCounts, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, post_1.default.find().sort({ _id: -1 }).populate("userId")];
            case 1:
                posts = _a.sent();
                return [4 /*yield*/, Promise.all(posts.map(function (post) { return __awaiter(void 0, void 0, void 0, function () {
                        var commentCount;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, comment_1.default.countDocuments({ postId: post._id })];
                                case 1:
                                    commentCount = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, post._doc), { commentCount: commentCount })]; // Spread operator to merge post document and comment count
                            }
                        });
                    }); }))];
            case 2:
                postsWithCommentCounts = _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Data fetched successfully", posts: postsWithCommentCounts });
                return [3 /*break*/, 4];
            case 3:
                error_15 = _a.sent();
                console.error(error_15);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = postController;
//# sourceMappingURL=postController.js.map