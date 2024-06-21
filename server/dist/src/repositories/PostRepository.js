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
var post_1 = __importDefault(require("../models/post"));
var comment_1 = __importDefault(require("../models/comment"));
var collections_1 = __importDefault(require("../models/collections"));
var reportedPosts_1 = __importDefault(require("../models/reportedPosts"));
var PostRepository = /** @class */ (function () {
    function PostRepository() {
    }
    PostRepository.prototype.createPost = function (postData) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        post = new post_1.default(postData);
                        return [4 /*yield*/, post.save()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostRepository.prototype.findPostById = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_1.default.findById(postId).populate("userId")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostRepository.prototype.findAllPosts = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_1.default.find().sort({ _id: -1 }).populate("userId")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostRepository.prototype.findPostsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_1.default.find({ userId: userId }).sort({ _id: -1 })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostRepository.prototype.likePost = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_1.default.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostRepository.prototype.unlikePost = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_1.default.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostRepository.prototype.deletePost = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, comment_1.default.deleteMany({ postId: postId })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, reportedPosts_1.default.deleteMany({ postId: postId })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, post_1.default.findByIdAndDelete(postId)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostRepository.prototype.updatePost = function (postId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, post_1.default.findByIdAndUpdate(postId, updateData, { new: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostRepository.prototype.reportPost = function (reportData) {
        return __awaiter(this, void 0, void 0, function () {
            var report;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        report = new reportedPosts_1.default(reportData);
                        return [4 /*yield*/, report.save()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostRepository.prototype.getReportedPosts = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, reportedPosts_1.default.find()
                            .sort({ _id: -1 })
                            .populate("postId")
                            .populate("userId")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostRepository.prototype.savePostToCollection = function (userId, postId, collectionName) {
        return __awaiter(this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, collections_1.default.findOne({ user: userId, name: collectionName })];
                    case 1:
                        collection = _a.sent();
                        if (!collection) return [3 /*break*/, 3];
                        return [4 /*yield*/, collections_1.default.findOneAndUpdate({ user: userId, name: collectionName }, { $addToSet: { posts: postId } }, { new: true })];
                    case 2:
                        collection = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        collection = new collections_1.default({ user: userId, name: collectionName, posts: [postId] });
                        return [4 /*yield*/, collection.save()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, collections_1.default.findOneAndUpdate({ user: userId, name: "All" }, { $addToSet: { posts: postId } })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, collection];
                }
            });
        });
    };
    PostRepository.prototype.removePostFromCollections = function (userId, postId) {
        return __awaiter(this, void 0, void 0, function () {
            var collections, _i, collections_2, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, collections_1.default.find({ user: userId, posts: postId })];
                    case 1:
                        collections = _a.sent();
                        _i = 0, collections_2 = collections;
                        _a.label = 2;
                    case 2:
                        if (!(_i < collections_2.length)) return [3 /*break*/, 5];
                        collection = collections_2[_i];
                        collection.posts = collection.posts.filter(function (post) { return post.toString() !== postId; });
                        return [4 /*yield*/, collection.save()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, collections];
                }
            });
        });
    };
    PostRepository.prototype.getAllSavedPosts = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, collections_1.default.find({ user: userId }).populate("posts")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostRepository.prototype.getCollectionsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, collections_1.default.find({ user: userId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return PostRepository;
}());
exports.default = new PostRepository();
//# sourceMappingURL=PostRepository.js.map