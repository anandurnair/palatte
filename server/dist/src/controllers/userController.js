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
var userController = {};
var nodemailer = require("nodemailer");
var bcrypt_1 = __importDefault(require("bcrypt"));
var cloudinary = require("../utils/cloudinary").cloudinary;
var jwt = require("jsonwebtoken");
var generateToken = require("../utils/jwtHelper").generateToken;
var constants_1 = __importDefault(require("../utils/constants"));
var post_1 = __importDefault(require("../models/post"));
var collections_1 = __importDefault(require("../models/collections"));
var wallet_1 = __importDefault(require("../models/wallet"));
var generatedOTP = "";
var otpGeneratedTime;
var generateOTP = function () {
    otpGeneratedTime = Date.now();
    return Math.floor(1000 + Math.random() * 9000).toString();
};
userController.loginData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, passwordsMatch, token, allSavedPosts, allSaved, userWithSavedPosts, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                console.log("Working", email, password);
                return [4 /*yield*/, user_1.default.findOne({ email: email }).populate('wallet')];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ error: "User not exist" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                passwordsMatch = _b.sent();
                if (!passwordsMatch) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid password" })];
                }
                if (user.isBlocked) {
                    return [2 /*return*/, res.status(400).json({ error: "User Blocked" })];
                }
                token = generateToken(user);
                return [4 /*yield*/, collections_1.default.findOne({ user: user._id, name: 'All' })];
            case 3:
                allSavedPosts = _b.sent();
                allSaved = allSavedPosts ? allSavedPosts.posts : [];
                userWithSavedPosts = __assign(__assign({}, user.toObject()), { allSaved: allSaved });
                res.status(200).json({ message: "User logged in successfully!", user: userWithSavedPosts, token: token });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error(error_1);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
userController.signupData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullname, email, password, isExist, user, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, fullname = _a.fullname, email = _a.email, password = _a.password;
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 1:
                isExist = _b.sent();
                if (isExist) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "user already exists" })];
                }
                sendEmail(email);
                user = { fullname: fullname, email: email, password: password };
                res
                    .status(constants_1.default.OK)
                    .json({ message: "User created successfully!", user: user });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error(error_2);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
userController.getUserById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, posts, allSavedPosts, allSaved, userWithSavedPosts, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                userId = req.query.userId;
                return [4 /*yield*/, user_1.default.findById(userId).populate('wallet')];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, post_1.default.find({ userId: userId })];
            case 2:
                posts = _a.sent();
                return [4 /*yield*/, collections_1.default.findOne({ user: user._id, name: 'All' })];
            case 3:
                allSavedPosts = _a.sent();
                allSaved = allSavedPosts ? allSavedPosts.posts : [];
                userWithSavedPosts = __assign(__assign({}, user.toObject()), { allSaved: allSaved });
                res
                    .status(constants_1.default.OK)
                    .json({ message: "USER DETAILS FETCHED SUCCESSFULLY", user: userWithSavedPosts, posts: posts });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.error(error_3);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var sendEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var transporter, mailOptions, info, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "anandurpallam@gmail.com",
                        pass: "gxej hquc oifu hzdo",
                    },
                });
                generatedOTP = generateOTP();
                mailOptions = {
                    from: "anandurpallam@gmail.com",
                    to: email,
                    subject: "Your OTP Code",
                    text: "Your OTP code is: ".concat(generatedOTP),
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                info = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error("Error sending email:", error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
userController.resendOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tempUser, email;
    return __generator(this, function (_a) {
        try {
            tempUser = req.body.tempUser;
            email = tempUser.email;
            generatedOTP = "";
            sendEmail(email);
        }
        catch (error) {
            console.error(error);
            res
                .status(constants_1.default.INTERNAL_SERVER_ERROR)
                .json({ error: "Internal server error" });
        }
        return [2 /*return*/];
    });
}); };
userController.verifyOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, OTP, tempUser, newTime, timeDifference, isExpired, isOtpValid, fullname, email, password, hashedPassword, newUser, user, token, allCollection, newWallet, walletId, allSavedPosts, allSaved, userWithSavedPosts, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                _a = req.body, OTP = _a.OTP, tempUser = _a.tempUser;
                newTime = Date.now();
                timeDifference = (Number(newTime) - Number(otpGeneratedTime)) / 1000;
                isExpired = Number(timeDifference) > 60;
                isOtpValid = OTP === generatedOTP;
                if (!isOtpValid) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "OTP VERIFICATION FAILED" })];
                }
                if (isExpired) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "OTP EXPIRED" })];
                }
                fullname = tempUser.fullname, email = tempUser.email, password = tempUser.password;
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 1:
                hashedPassword = _b.sent();
                newUser = new user_1.default({
                    fullname: fullname,
                    email: email,
                    password: hashedPassword,
                });
                return [4 /*yield*/, newUser.save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 3:
                user = _b.sent();
                token = generateToken(user);
                allCollection = new collections_1.default({ name: 'All', user: user._id, isDefault: true });
                return [4 /*yield*/, allCollection.save()];
            case 4:
                _b.sent();
                user.allCollection = allCollection._id;
                user.savedCollections.push(allCollection._id);
                return [4 /*yield*/, user.save()];
            case 5:
                _b.sent();
                newWallet = new wallet_1.default({
                    user: user._id
                });
                return [4 /*yield*/, newWallet.save()];
            case 6:
                _b.sent();
                return [4 /*yield*/, wallet_1.default.findOne({ user: user._id })];
            case 7:
                walletId = _b.sent();
                return [4 /*yield*/, user_1.default.findByIdAndUpdate(user._id, { wallet: walletId === null || walletId === void 0 ? void 0 : walletId._id })];
            case 8:
                _b.sent();
                return [4 /*yield*/, collections_1.default.findOne({ user: user._id, name: 'All' })];
            case 9:
                allSavedPosts = _b.sent();
                allSaved = allSavedPosts ? allSavedPosts.posts : [];
                return [4 /*yield*/, user_1.default.findOne({ email: email }).populate('wallet')];
            case 10:
                user = _b.sent();
                userWithSavedPosts = __assign(__assign({}, user.toObject()), { allSaved: allSaved });
                res
                    .status(constants_1.default.OK)
                    .json({ message: "OTP VERIFICATION SUCCESSFULL ", user: userWithSavedPosts, token: token });
                return [3 /*break*/, 12];
            case 11:
                error_5 = _b.sent();
                console.error(error_5);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
userController.createProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, profilePic, email, fullname, username, bio, phone, country, isUser, uploadedImg, user, newUser, updatedUser, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, profilePic = _a.profilePic, email = _a.email, fullname = _a.fullname, username = _a.username, bio = _a.bio, phone = _a.phone, country = _a.country;
                return [4 /*yield*/, user_1.default.findOne({ username: username })];
            case 1:
                isUser = _b.sent();
                if (isUser) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Username already exists" })];
                }
                return [4 /*yield*/, cloudinary.uploader.upload(profilePic, {
                        folder: "profile",
                    })];
            case 2:
                uploadedImg = _b.sent();
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 3:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "User not found" })];
                }
                return [4 /*yield*/, user_1.default.findByIdAndUpdate(user._id, {
                        profileImg: uploadedImg.url,
                        fullname: fullname,
                        username: username,
                        phone: phone,
                        country: country,
                        bio: bio,
                    }, { new: true })];
            case 4:
                newUser = _b.sent();
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 5:
                updatedUser = _b.sent();
                if (!newUser) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Error during profile update" })];
                }
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Profile created successfully", updatedUser: updatedUser });
                return [3 /*break*/, 7];
            case 6:
                error_6 = _b.sent();
                console.error(error_6);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
//Edit Profile
userController.editProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, profilePic, email, fullname, username, bio, phone, country, isUser, uploadedImg, user, newUser, updatedUser, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, profilePic = _a.profilePic, email = _a.email, fullname = _a.fullname, username = _a.username, bio = _a.bio, phone = _a.phone, country = _a.country;
                return [4 /*yield*/, user_1.default.findOne({ username: username })];
            case 1:
                isUser = _b.sent();
                return [4 /*yield*/, cloudinary.uploader.upload(profilePic)];
            case 2:
                uploadedImg = _b.sent();
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 3:
                user = _b.sent();
                return [4 /*yield*/, user_1.default.findByIdAndUpdate(user._id, {
                        profileImg: uploadedImg.url,
                        fullname: fullname,
                        username: username,
                        phone: phone,
                        country: country,
                        bio: bio,
                    })];
            case 4:
                newUser = _b.sent();
                if (!newUser) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "ERROR DURING PROFILE EDIT" })];
                }
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 5:
                updatedUser = _b.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "PROFILE CREATED SUCCESSFULLY", updatedUser: updatedUser });
                return [3 /*break*/, 7];
            case 6:
                error_7 = _b.sent();
                console.error(error_7);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
userController.userDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, allSavedPosts, allSaved, userWithSavedPosts, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                email = req.query.email;
                return [4 /*yield*/, user_1.default.findOne({ email: email }).populate('wallet')];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, collections_1.default.findOne({ user: user._id, name: 'All' })];
            case 2:
                allSavedPosts = _a.sent();
                allSaved = allSavedPosts ? allSavedPosts.posts : [];
                userWithSavedPosts = __assign(__assign({}, user.toObject()), { allSaved: allSaved });
                res
                    .status(constants_1.default.OK)
                    .json({ message: "USER DETAILS FETCHED SUCCESSFULLY", user: userWithSavedPosts });
                return [3 /*break*/, 4];
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
//change password
userController.changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, oldPassword, newPassword, user, passwordsMatch, hashedPassword, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Invalid User" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(oldPassword, user.password)];
            case 2:
                passwordsMatch = _b.sent();
                if (!passwordsMatch) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Invalid password" })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
            case 3:
                hashedPassword = _b.sent();
                return [4 /*yield*/, user_1.default.findByIdAndUpdate(user._id, { password: hashedPassword })];
            case 4:
                _b.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: "Password updated successfully" })];
            case 5:
                error_9 = _b.sent();
                console.error(error_9);
                return [2 /*return*/, res
                        .status(constants_1.default.INTERNAL_SERVER_ERROR)
                        .json({ error: "Internal server error" })];
            case 6: return [2 /*return*/];
        }
    });
}); };
userController.forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.body.email;
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "INVALID USER" })];
                }
                sendEmail(email);
                res.status(constants_1.default.OK).json({ message: "OTP SENT" });
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.error(error_10);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
userController.verifyPasswordOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, OTP, email, newTime, timeDifference, isExpired, isOtpValid;
    return __generator(this, function (_b) {
        try {
            _a = req.body, OTP = _a.OTP, email = _a.email;
            newTime = Date.now();
            timeDifference = (Number(newTime) - Number(otpGeneratedTime)) / 1000;
            isExpired = Number(timeDifference) > 60;
            isOtpValid = OTP === generatedOTP;
            if (!isOtpValid) {
                return [2 /*return*/, res
                        .status(constants_1.default.BAD_REQUEST)
                        .json({ error: "OTP VERIFICATION FAILED" })];
            }
            if (isExpired) {
                return [2 /*return*/, res
                        .status(constants_1.default.BAD_REQUEST)
                        .json({ error: "OTP EXPIRED" })];
            }
            return [2 /*return*/, res
                    .status(constants_1.default.OK)
                    .json({ messsge: "VERIFICATION SUCCESSFULL" })];
        }
        catch (error) {
            console.error(error);
            res
                .status(constants_1.default.INTERNAL_SERVER_ERROR)
                .json({ error: "Internal server error" });
        }
        return [2 /*return*/];
    });
}); };
userController.resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, newPassword, user, hashedPassword, error_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, newPassword = _a.newPassword;
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Invalid User" })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, user_1.default.findByIdAndUpdate(user._id, { password: hashedPassword })];
            case 3:
                _b.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: "PASSWORD UPDATED SUCCESSFULLY" })];
            case 4:
                error_11 = _b.sent();
                console.error(error_11);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
userController.searchUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, prefix, regex, users, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                username = req.body.username;
                prefix = username.trim();
                regex = new RegExp("^" + prefix, "i");
                return [4 /*yield*/, user_1.default.find({ username: regex })];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: "Searched successfully", users: users })];
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
userController.followUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, currentUserId, userId, currentUser, isFollowed, user, user, error_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                _a = req.body, currentUserId = _a.currentUserId, userId = _a.userId;
                return [4 /*yield*/, user_1.default.findById(currentUserId)];
            case 1:
                currentUser = _b.sent();
                if (!currentUser) {
                    return [2 /*return*/, res.status(constants_1.default.OK).json({ error: "User not found" })];
                }
                isFollowed = currentUser.following.includes(userId);
                if (!!isFollowed) return [3 /*break*/, 5];
                return [4 /*yield*/, user_1.default.findOneAndUpdate({ _id: currentUserId }, { $push: { following: userId } })];
            case 2:
                _b.sent();
                return [4 /*yield*/, user_1.default.findByIdAndUpdate({
                        _id: userId,
                    }, { $push: { followers: currentUserId } })];
            case 3:
                _b.sent();
                return [4 /*yield*/, user_1.default.findById(currentUserId)];
            case 4:
                user = _b.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: "Followed", user: user })];
            case 5: return [4 /*yield*/, user_1.default.findOneAndUpdate({ _id: currentUserId }, { $pull: { following: userId } })];
            case 6:
                _b.sent();
                return [4 /*yield*/, user_1.default.findByIdAndUpdate({
                        _id: userId,
                    }, { $pull: { followers: currentUserId } })];
            case 7:
                _b.sent();
                return [4 /*yield*/, user_1.default.findById(currentUserId)];
            case 8:
                user = _b.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: "Unfollowed", user: user })];
            case 9: return [3 /*break*/, 11];
            case 10:
                error_13 = _b.sent();
                console.error(error_13);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
userController.getFollowers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, followers, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                return [4 /*yield*/, user_1.default.findById(userId).populate('followers')];
            case 1:
                user = _a.sent();
                followers = user.followers;
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: " successfully fetched followers", followers: followers })];
            case 2:
                error_14 = _a.sent();
                console.error(error_14);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
userController.getFollowing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, following, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                return [4 /*yield*/, user_1.default.findById(userId).populate('following')];
            case 1:
                user = _a.sent();
                following = user.following;
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: " successfully fetched followings", following: following })];
            case 2:
                error_15 = _a.sent();
                console.error(error_15);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
module.exports = userController;
//# sourceMappingURL=userController.js.map