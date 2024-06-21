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
var freelanceController = {};
var cloudinary = require("../utils/cloudinary").cloudinary;
var review_1 = __importDefault(require("../models/review"));
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var freelanceDetails_1 = __importDefault(require("../models/freelanceDetails"));
var orders_1 = __importDefault(require("../models/orders"));
var mongoose_1 = __importDefault(require("mongoose"));
var date_fns_1 = require("date-fns");
var pendingPayments_1 = __importDefault(require("../models/pendingPayments"));
var wallet_1 = __importDefault(require("../models/wallet"));
var completedWorks_1 = __importDefault(require("../models/completedWorks"));
freelanceController.getFreelancersByService = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceName, freelanceDetails, filteredUsers, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                serviceName = req.query.serviceName;
                return [4 /*yield*/, freelanceDetails_1.default.find({
                        "services.title": serviceName,
                    }).populate("userId")];
            case 1:
                freelanceDetails = _a.sent();
                filteredUsers = freelanceDetails.map(function (detail) { return detail.userId; });
                return [4 /*yield*/, Promise.all(filteredUsers.map(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                        var reviews, reviewCount, avgRating;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, review_1.default.find({ freelancerId: user._id })];
                                case 1:
                                    reviews = _a.sent();
                                    reviewCount = reviews.length;
                                    avgRating = reviewCount > 0 ? reviews.reduce(function (sum, review) { return sum + review.rating; }, 0) / reviewCount : 0;
                                    avgRating = Math.round(avgRating);
                                    return [2 /*return*/, __assign(__assign({}, user.toObject()), { reviews: reviewCount, avgRating: avgRating })];
                            }
                        });
                    }); }))];
            case 2:
                filteredUsers = _a.sent();
                filteredUsers.sort(function (a, b) { return b.avgRating - a.avgRating; });
                res
                    .status(constants_1.default.OK)
                    .json({ message: "freelancers successfully fetched", freelancers: filteredUsers });
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
freelanceController.getUsersByServiceAndUsername = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, serviceName, userName, regex, users, userIds, freelanceDetails, filteredUsers, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.query, serviceName = _a.serviceName, userName = _a.userName;
                if (!serviceName || !userName) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Service name and username are required" })];
                }
                regex = new RegExp("^" + userName.toString().trim(), "i");
                return [4 /*yield*/, user_1.default.find({ username: regex })];
            case 1:
                users = _b.sent();
                if (users.length === 0) {
                    return [2 /*return*/, res
                            .status(constants_1.default.OK)
                            .json({ message: "No users found with the specified username", users: [] })];
                }
                userIds = users.map(function (user) { return user._id; });
                return [4 /*yield*/, freelanceDetails_1.default.find({
                        userId: { $in: userIds },
                        "services.title": serviceName,
                    }).populate("userId")];
            case 2:
                freelanceDetails = _b.sent();
                filteredUsers = freelanceDetails.map(function (detail) { return detail.userId; });
                return [4 /*yield*/, Promise.all(filteredUsers.map(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                        var reviews, reviewCount, avgRating;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, review_1.default.find({ freelancerId: user._id })];
                                case 1:
                                    reviews = _a.sent();
                                    reviewCount = reviews.length;
                                    avgRating = reviewCount > 0 ? reviews.reduce(function (sum, review) { return sum + review.rating; }, 0) / reviewCount : 0;
                                    return [2 /*return*/, __assign(__assign({}, user.toObject()), { reviews: reviewCount, avgRating: avgRating })];
                            }
                        });
                    }); }))];
            case 3:
                // Add review data to each user
                filteredUsers = _b.sent();
                filteredUsers.sort(function (a, b) { return b.avgRating - a.avgRating; });
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Users successfully fetched", freelancers: filteredUsers });
                return [3 /*break*/, 5];
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
freelanceController.addFreelanceService = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, serviceName_1, userId, description, basic, standard, premium, userFreelanceDetails, serviceExists, newFreelance, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, serviceName_1 = _a.serviceName, userId = _a.userId, description = _a.description, basic = _a.basic, standard = _a.standard, premium = _a.premium;
                if (!userId ||
                    !serviceName_1 ||
                    !description ||
                    !basic ||
                    !standard ||
                    !premium) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "All fields are required" })];
                }
                return [4 /*yield*/, freelanceDetails_1.default.findOne({
                        userId: userId,
                    })];
            case 1:
                userFreelanceDetails = _b.sent();
                if (!userFreelanceDetails) return [3 /*break*/, 3];
                serviceExists = userFreelanceDetails.services.some(function (service) { return service.title === serviceName_1; });
                if (serviceExists) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Service already exists" })];
                }
                userFreelanceDetails.services.push({
                    title: serviceName_1,
                    description: description,
                    plans: [basic, standard, premium],
                });
                return [4 /*yield*/, userFreelanceDetails.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({ message: "Service successfully added" })];
            case 3:
                newFreelance = new freelanceDetails_1.default({
                    userId: userId,
                    services: [
                        {
                            title: serviceName_1,
                            description: description,
                            plans: [basic, standard, premium],
                        },
                    ],
                });
                return [4 /*yield*/, newFreelance.save()];
            case 4:
                _b.sent();
                res.status(constants_1.default.OK).json({ message: "Service successfully added" });
                return [3 /*break*/, 6];
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
freelanceController.editFreelanceService = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, freelanceId, details, updatedService, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, freelanceId = _a.freelanceId, details = _a.details;
                if (!freelanceId ||
                    !details) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "All fields are required" })];
                }
                return [4 /*yield*/, freelanceDetails_1.default.findOneAndUpdate({ "services._id": freelanceId }, {
                        $set: {
                            "services.$.title": details.title,
                            "services.$.description": details.description,
                            "services.$.plans": details.plans
                        }
                    }, { new: true })];
            case 1:
                updatedService = _b.sent();
                if (!updatedService) {
                    return [2 /*return*/, res.status(constants_1.default.NOT_FOUND).json({ error: "Service not found" })];
                }
                res.status(constants_1.default.OK).json({
                    message: "Service updated",
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error(error_4);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
freelanceController.getFreelanceServiceList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, freelancerServices, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                return [4 /*yield*/, freelanceDetails_1.default.findOne({ userId: userId })];
            case 1:
                freelancerServices = _a.sent();
                res.status(constants_1.default.OK).json({
                    message: "freelancers successfully fetched",
                    freelancerServices: freelancerServices,
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error(error_5);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
freelanceController.getFreelanceServiceDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, serviceName_2, freelancerServices, service, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, userId = _a.userId, serviceName_2 = _a.serviceName;
                if (!userId || !serviceName_2) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "userId and serviceName are required" })];
                }
                return [4 /*yield*/, freelanceDetails_1.default.findOne({ userId: userId })];
            case 1:
                freelancerServices = _b.sent();
                if (!freelancerServices) {
                    return [2 /*return*/, res
                            .status(constants_1.default.NOT_FOUND)
                            .json({ error: "Freelancer not found" })];
                }
                service = freelancerServices.services.find(function (service) { return service.title === serviceName_2; });
                if (!service) {
                    return [2 /*return*/, res
                            .status(constants_1.default.NOT_FOUND)
                            .json({ error: "Service not found" })];
                }
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Service successfully fetched", service: service });
                return [3 /*break*/, 3];
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
freelanceController.deleteFreelanceService = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, serviceName_3, freelancerServices, serviceIndex, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, userId = _a.userId, serviceName_3 = _a.serviceName;
                if (!userId || !serviceName_3) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "userId and serviceName are required" })];
                }
                return [4 /*yield*/, freelanceDetails_1.default.findOne({ userId: userId })];
            case 1:
                freelancerServices = _b.sent();
                if (!freelancerServices) {
                    return [2 /*return*/, res
                            .status(constants_1.default.NOT_FOUND)
                            .json({ error: "Freelancer not found" })];
                }
                serviceIndex = freelancerServices.services.findIndex(function (service) { return service.title === serviceName_3; });
                if (serviceIndex === -1) {
                    return [2 /*return*/, res
                            .status(constants_1.default.NOT_FOUND)
                            .json({ error: "Service not found" })];
                }
                freelancerServices.services.splice(serviceIndex, 1);
                return [4 /*yield*/, freelancerServices.save()];
            case 2:
                _b.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Service successfully deleted" });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _b.sent();
                console.error(error_7);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
freelanceController.postOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, freelancer, client, requirements, plan, serviceName, newOrder, savedOrder, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, freelancer = _a.freelancer, client = _a.client, requirements = _a.requirements, plan = _a.plan, serviceName = _a.serviceName;
                newOrder = new orders_1.default({
                    freelancer: freelancer,
                    client: client,
                    requirements: requirements,
                    serviceName: serviceName,
                    plan: plan,
                });
                return [4 /*yield*/, newOrder.save()];
            case 1:
                savedOrder = _b.sent();
                // Send a response with the saved order
                res.status(constants_1.default.OK).json({ message: "Order send successfully" });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _b.sent();
                console.error(error_8);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
freelanceController.getFreelancerOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, orders, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                return [4 /*yield*/, orders_1.default.find({ freelancer: userId }).populate("client")];
            case 1:
                orders = _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Orders fetched successfully", orders: orders });
                return [3 /*break*/, 3];
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
freelanceController.getClientOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, orders, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                return [4 /*yield*/, orders_1.default.find({ client: userId })
                        .populate("freelancer")
                        .populate("workId")
                        .populate("reviewId")];
            case 1:
                orders = _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Orders fetched successfully", orders: orders });
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
freelanceController.acceptOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.query.orderId;
                return [4 /*yield*/, orders_1.default.findByIdAndUpdate(orderId, { status: "accepted" })];
            case 1:
                _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Order acccepted successfully" });
                return [3 /*break*/, 3];
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
freelanceController.rejectOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.query.orderId;
                return [4 /*yield*/, orders_1.default.findByIdAndUpdate(orderId, { status: "rejected" })];
            case 1:
                _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Order rejected successfully" });
                return [3 /*break*/, 3];
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
freelanceController.cancelOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.query.orderId;
                return [4 /*yield*/, orders_1.default.findByIdAndUpdate(orderId, { status: "cancelled" })];
            case 1:
                _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Order cancelled successfully" });
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
freelanceController.removeOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = req.query.orderId;
                return [4 /*yield*/, orders_1.default.findByIdAndDelete(orderId)];
            case 1:
                _a.sent();
                res.status(constants_1.default.OK).json({ message: "Order deleted successfully" });
                return [3 /*break*/, 3];
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
freelanceController.addWalletAmount = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, addAmount, userId, amountToAdd, session, error_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, addAmount = _a.addAmount, userId = _a.userId;
                if (typeof addAmount === 'undefined' || typeof userId === 'undefined') {
                    return [2 /*return*/, res.status(400).json({ error: 'addAmount and userId are required' })];
                }
                amountToAdd = parseFloat(addAmount);
                if (isNaN(amountToAdd)) {
                    return [2 /*return*/, res.status(400).json({ error: 'addAmount must be a valid number' })];
                }
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        line_items: [
                            {
                                price_data: {
                                    currency: "inr",
                                    product_data: { name: "Wallet Top-up" },
                                    unit_amount: amountToAdd * 100,
                                },
                                quantity: 1,
                            },
                        ],
                        mode: "payment",
                        success_url: "http://localhost:3000/wallet/success",
                        cancel_url: "http://localhost:3000/wallet/cancel",
                        payment_intent_data: {
                            metadata: { userId: userId, method: "wallet" },
                        }
                    })];
            case 1:
                session = _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Payment successfully created", id: session.id })];
            case 2:
                error_15 = _b.sent();
                console.error(error_15);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
freelanceController.addWalletSuccessfull = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, addAmount, userId, user, BANK_OBJECT_ID, amountToAdd, wallet, formattedDate, error_16;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, addAmount = _a.addAmount, userId = _a.userId;
                return [4 /*yield*/, user_1.default.findById(userId)];
            case 1:
                user = _b.sent();
                BANK_OBJECT_ID = "60d5ec49b3b4cd39e4d8a4e5";
                if (typeof addAmount === "undefined" || typeof userId === "undefined") {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "addAmount and userId are required" })];
                }
                amountToAdd = parseFloat(addAmount);
                if (isNaN(amountToAdd)) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "addAmount must be a number" })];
                }
                return [4 /*yield*/, wallet_1.default.findOne({ user: userId })];
            case 2:
                wallet = _b.sent();
                if (!wallet) {
                    wallet = new wallet_1.default({
                        user: userId,
                        balance: 0,
                        transactions: [],
                    });
                }
                formattedDate = (0, date_fns_1.format)(new Date(), "dd MMM yyyy hh:mm a");
                wallet.balance = parseFloat(wallet.balance.toString()) + amountToAdd;
                wallet.transactions.push({
                    amount: amountToAdd,
                    type: "credit",
                    payer: new mongoose_1.default.Types.ObjectId(BANK_OBJECT_ID), // Use ObjectId for the bank
                    date: formattedDate,
                });
                // Save the wallet
                return [4 /*yield*/, wallet.save()];
            case 3:
                // Save the wallet
                _b.sent();
                res.status(constants_1.default.OK).json({
                    message: "Amount added successfully",
                    balance: wallet.balance,
                    user: user,
                });
                return [3 /*break*/, 5];
            case 4:
                error_16 = _b.sent();
                console.error(error_16);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
freelanceController.getWalletByUserID = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, wallet, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                return [4 /*yield*/, wallet_1.default.findOne({ user: userId }).populate("transactions.payer")];
            case 1:
                wallet = _a.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Wallet fetched successfully", wallet: wallet });
                return [3 /*break*/, 3];
            case 2:
                error_17 = _a.sent();
                console.error(error_17);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
freelanceController.servicePaymentPending = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, orderId, clientId, freelancerId, amount, isExist, newPayment, order, currentTime, deadlineDate, clientWallet, formattedDate, error_18;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, orderId = _a.orderId, clientId = _a.clientId, freelancerId = _a.freelancerId, amount = _a.amount;
                return [4 /*yield*/, pendingPayments_1.default.findOne({ orderId: orderId })];
            case 1:
                isExist = _b.sent();
                if (isExist) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Already paid" })];
                }
                newPayment = new pendingPayments_1.default({
                    orderId: orderId,
                    clientId: clientId,
                    freelancerId: freelancerId,
                    amount: amount,
                });
                return [4 /*yield*/, newPayment.save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, orders_1.default.findById(orderId)];
            case 3:
                order = _b.sent();
                currentTime = new Date();
                deadlineDate = new Date(currentTime.getTime() +
                    parseInt(order.plan.deliveryTime) * 24 * 60 * 60 * 1000);
                return [4 /*yield*/, orders_1.default.findByIdAndUpdate(orderId, {
                        status: "in progress",
                        deadline: deadlineDate,
                        remainingRevisions: order.plan.revision,
                    })];
            case 4:
                _b.sent();
                return [4 /*yield*/, wallet_1.default.findOne({
                        user: clientId,
                    })];
            case 5:
                clientWallet = _b.sent();
                if (!clientWallet) {
                    clientWallet = new wallet_1.default({
                        user: clientId,
                        balance: 0,
                        transactions: [],
                    });
                }
                formattedDate = (0, date_fns_1.format)(new Date(), "dd MMM yyyy hh:mm a");
                clientWallet.balance = parseFloat(clientWallet.balance.toString()) - amount;
                clientWallet.transactions.push({
                    amount: amount,
                    type: "debit",
                    payer: freelancerId,
                    date: formattedDate,
                });
                return [4 /*yield*/, clientWallet.save()];
            case 6:
                _b.sent();
                return [2 /*return*/, res.status(constants_1.default.OK).json({ message: "Payment successfull" })];
            case 7:
                error_18 = _b.sent();
                console.error(error_18);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
//workUncomplete
freelanceController.workUncomplete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, payment, amountToAdd, clientWallet, formattedDate, error_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                orderId = req.body.orderId;
                return [4 /*yield*/, orders_1.default.findByIdAndUpdate(orderId, { status: "uncompleted" })];
            case 1:
                _a.sent();
                return [4 /*yield*/, pendingPayments_1.default.findOne({ orderId: orderId })];
            case 2:
                payment = _a.sent();
                amountToAdd = parseFloat(payment.amount);
                return [4 /*yield*/, wallet_1.default.findOne({
                        user: payment.clientId,
                    })];
            case 3:
                clientWallet = _a.sent();
                if (!clientWallet) {
                    clientWallet = new wallet_1.default({
                        user: payment.clientId,
                        balance: 0,
                        transactions: [],
                    });
                }
                formattedDate = (0, date_fns_1.format)(new Date(), "dd MMM yyyy hh:mm a");
                clientWallet.balance =
                    parseFloat(clientWallet.balance.toString()) + amountToAdd;
                clientWallet.transactions.push({
                    amount: amountToAdd,
                    type: "credit",
                    payer: payment.clientId,
                    date: formattedDate,
                });
                return [4 /*yield*/, pendingPayments_1.default.findByIdAndDelete(payment._id)];
            case 4:
                _a.sent();
                return [4 /*yield*/, clientWallet.save()];
            case 5:
                _a.sent();
                res.status(constants_1.default.OK).json({ message: "Work Uploaded successfully" });
                return [3 /*break*/, 7];
            case 6:
                error_19 = _a.sent();
                console.error(error_19);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
freelanceController.uploadFreelanceWork = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, orderId, image, isExist, uploadResponse, newCompletedWork, work, error_20;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, orderId = _a.orderId, image = _a.image;
                return [4 /*yield*/, completedWorks_1.default.find({ orderId: orderId })];
            case 1:
                isExist = _b.sent();
                return [4 /*yield*/, cloudinary.uploader.upload(image, {
                        resource_type: "auto",
                    })];
            case 2:
                uploadResponse = _b.sent();
                newCompletedWork = new completedWorks_1.default({
                    orderId: orderId,
                    image: uploadResponse.url,
                });
                return [4 /*yield*/, newCompletedWork.save()];
            case 3:
                _b.sent();
                return [4 /*yield*/, completedWorks_1.default.findOne({ orderId: orderId })];
            case 4:
                work = _b.sent();
                return [4 /*yield*/, orders_1.default.findByIdAndUpdate(orderId, {
                        status: "waiting for approval",
                        workId: work._id,
                    })];
            case 5:
                _b.sent();
                res.status(constants_1.default.OK).json({ message: "Work Uploaded successfully" });
                return [3 /*break*/, 7];
            case 6:
                error_20 = _b.sent();
                console.error(error_20);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
freelanceController.approveWork = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, payment, amountToAdd, freelancerWallet, formattedDate, error_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                orderId = req.body.orderId;
                return [4 /*yield*/, orders_1.default.findByIdAndUpdate(orderId, { status: "completed" })];
            case 1:
                _a.sent();
                return [4 /*yield*/, pendingPayments_1.default.findOne({ orderId: orderId })];
            case 2:
                payment = _a.sent();
                amountToAdd = parseFloat(payment.amount);
                return [4 /*yield*/, wallet_1.default.findOne({
                        user: payment.freelancerId,
                    })];
            case 3:
                freelancerWallet = _a.sent();
                if (!freelancerWallet) {
                    freelancerWallet = new wallet_1.default({
                        user: payment.freelancerId,
                        balance: 0,
                        transactions: [],
                    });
                }
                formattedDate = (0, date_fns_1.format)(new Date(), "dd MMM yyyy hh:mm a");
                // Update the balance
                freelancerWallet.balance =
                    parseFloat(freelancerWallet.balance.toString()) + amountToAdd;
                // Add the transaction
                freelancerWallet.transactions.push({
                    amount: amountToAdd,
                    type: "credit",
                    payer: payment.clientId, // Use ObjectId for the bank
                    date: formattedDate,
                });
                return [4 /*yield*/, pendingPayments_1.default.findByIdAndDelete(payment._id)];
            case 4:
                _a.sent();
                // Save the wallet
                return [4 /*yield*/, freelancerWallet.save()];
            case 5:
                // Save the wallet
                _a.sent();
                res.status(constants_1.default.OK).json({ message: "Approved successfully" });
                return [3 /*break*/, 7];
            case 6:
                error_21 = _a.sent();
                console.error(error_21);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
freelanceController.addReview = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, orderId, ratedUser, freelancerId, serviceName, review, rating, isExist, newReview, latestReview, error_22;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, orderId = _a.orderId, ratedUser = _a.ratedUser, freelancerId = _a.freelancerId, serviceName = _a.serviceName, review = _a.review, rating = _a.rating;
                return [4 /*yield*/, review_1.default.findOne({
                        orderId: orderId,
                        ratedUser: ratedUser,
                        freelancerId: freelancerId,
                        serviceName: serviceName,
                    })];
            case 1:
                isExist = _b.sent();
                if (isExist) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ messge: "Review already exists" })];
                }
                newReview = new review_1.default({
                    orderId: orderId,
                    ratedUser: ratedUser,
                    freelancerId: freelancerId,
                    serviceName: serviceName,
                    review: review,
                    rating: rating,
                });
                return [4 /*yield*/, newReview.save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, review_1.default.findOne({
                        orderId: orderId,
                        ratedUser: ratedUser,
                        freelancerId: freelancerId,
                        serviceName: serviceName,
                    })];
            case 3:
                latestReview = _b.sent();
                return [4 /*yield*/, orders_1.default.findByIdAndUpdate(orderId, { reviewId: latestReview._id })];
            case 4:
                _b.sent();
                res.status(constants_1.default.OK).json({ message: "Review added" });
                return [3 /*break*/, 6];
            case 5:
                error_22 = _b.sent();
                console.error(error_22);
                return [2 /*return*/, res
                        .status(constants_1.default.INTERNAL_SERVER_ERROR)
                        .json({ error: "Internal server error" })];
            case 6: return [2 /*return*/];
        }
    });
}); };
freelanceController.getReviewList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, freelancerId, serviceName, serviceReviews, error_23;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, freelancerId = _a.freelancerId, serviceName = _a.serviceName;
                return [4 /*yield*/, review_1.default.find({
                        freelancerId: freelancerId,
                        serviceName: serviceName,
                    }).populate("ratedUser")];
            case 1:
                serviceReviews = _b.sent();
                res
                    .status(constants_1.default.OK)
                    .json({ message: "Reviews fetched successfully", serviceReviews: serviceReviews });
                return [3 /*break*/, 3];
            case 2:
                error_23 = _b.sent();
                console.error(error_23);
                return [2 /*return*/, res
                        .status(constants_1.default.INTERNAL_SERVER_ERROR)
                        .json({ error: "Internal server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
freelanceController.reviseWork = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, orderId, additionalRequirements, order, currentTime, deadlineDate, updatedOrder, error_24;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, orderId = _a.orderId, additionalRequirements = _a.additionalRequirements;
                return [4 /*yield*/, orders_1.default.findById(orderId)];
            case 1:
                order = _b.sent();
                currentTime = new Date();
                deadlineDate = new Date(currentTime.getTime() +
                    parseInt(order.plan.deliveryTime) * 24 * 60 * 60 * 1000);
                return [4 /*yield*/, orders_1.default.findByIdAndUpdate(orderId, {
                        status: "revision",
                        $set: { additionalRequirements: additionalRequirements },
                        $inc: { remainingRevisions: -1 },
                        deadline: deadlineDate,
                    }, { new: true })];
            case 2:
                updatedOrder = _b.sent();
                res.status(constants_1.default.OK).json({ message: "Revision sended" });
                return [3 /*break*/, 4];
            case 3:
                error_24 = _b.sent();
                console.error(error_24);
                return [2 /*return*/, res
                        .status(constants_1.default.INTERNAL_SERVER_ERROR)
                        .json({ error: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
freelanceController.editReview = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, reviewId, editRating, editReview, updateReview, error_25;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, reviewId = _a.reviewId, editRating = _a.editRating, editReview = _a.editReview;
                return [4 /*yield*/, review_1.default.findByIdAndUpdate(reviewId, {
                        review: editReview,
                        rating: editRating,
                    })];
            case 1:
                updateReview = _b.sent();
                res.status(constants_1.default.OK).json({ message: "Review edited" });
                return [3 /*break*/, 3];
            case 2:
                error_25 = _b.sent();
                console.error(error_25);
                return [2 /*return*/, res
                        .status(constants_1.default.INTERNAL_SERVER_ERROR)
                        .json({ error: "Internal server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
freelanceController.deleteReview = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reviewId, review, error_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                reviewId = req.query.reviewId;
                return [4 /*yield*/, review_1.default.findById(reviewId)];
            case 1:
                review = _a.sent();
                if (!review) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "Review not exists" })];
                }
                return [4 /*yield*/, review_1.default.findByIdAndDelete(reviewId)];
            case 2:
                _a.sent();
                res.status(constants_1.default.OK).json({ message: "Review deleted" });
                return [3 /*break*/, 4];
            case 3:
                error_26 = _a.sent();
                console.error(error_26);
                return [2 /*return*/, res
                        .status(constants_1.default.INTERNAL_SERVER_ERROR)
                        .json({ error: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
var handleCheckoutSessionCompleted = function (session) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, newAmount, addAmount, user, BANK_OBJECT_ID, wallet, formattedDate, error_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = session.metadata.userId;
                newAmount = parseInt(session.amount);
                addAmount = newAmount / 100;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, user_1.default.findById(userId)];
            case 2:
                user = _a.sent();
                BANK_OBJECT_ID = "60d5ec49b3b4cd39e4d8a4e5";
                if (!user) {
                    throw new Error('User not found');
                }
                return [4 /*yield*/, wallet_1.default.findOne({ user: userId })];
            case 3:
                wallet = _a.sent();
                if (!wallet) {
                    wallet = new wallet_1.default({
                        user: userId,
                        balance: 0,
                        transactions: [],
                    });
                }
                formattedDate = new Date().toISOString();
                wallet.balance = parseFloat(wallet.balance.toString()) + addAmount;
                wallet.transactions.push({
                    amount: addAmount,
                    type: "credit",
                    payer: new mongoose_1.default.Types.ObjectId(BANK_OBJECT_ID),
                    date: formattedDate,
                });
                return [4 /*yield*/, wallet.save()];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                error_27 = _a.sent();
                console.error("Failed to handle checkout.session.completed: ".concat(error_27.message));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var handleOrderPayment = function (session) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, orderId, clientId, freelancerId, amount, newPayment, order, currentTime, deadlineDate, error_28;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = session.metadata, orderId = _a.orderId, clientId = _a.clientId, freelancerId = _a.freelancerId, amount = _a.amount;
                console.log("MEtta data : ", session.metadata);
                newPayment = new pendingPayments_1.default({ orderId: orderId, clientId: clientId, freelancerId: freelancerId, amount: amount });
                return [4 /*yield*/, newPayment.save()];
            case 1:
                _b.sent();
                return [4 /*yield*/, orders_1.default.findById(orderId)];
            case 2:
                order = _b.sent();
                currentTime = new Date();
                deadlineDate = new Date(currentTime.getTime() + parseInt(order.plan.deliveryTime) * 24 * 60 * 60 * 1000);
                return [4 /*yield*/, orders_1.default.findByIdAndUpdate(orderId, {
                        status: "in progress",
                        deadline: deadlineDate,
                        remainingRevisions: order.plan.revision,
                    })];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                error_28 = _b.sent();
                console.error("Failed to handle checkout.session.completed: ".concat(error_28.message));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
freelanceController.webhook = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sig, endpointSecret, event_1, session, error_29;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                sig = req.headers["stripe-signature"];
                endpointSecret = process.env.STRIPE_WEBHOOK_SECRET1;
                event_1 = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
                if (!(event_1.type === "payment_intent.succeeded")) return [3 /*break*/, 4];
                session = event_1.data.object;
                if (!(session.metadata.method == "wallet")) return [3 /*break*/, 2];
                return [4 /*yield*/, handleCheckoutSessionCompleted(session)];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, handleOrderPayment(session)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                res.status(200).json({ message: "Webhook received successfully" });
                return [3 /*break*/, 6];
            case 5:
                error_29 = _a.sent();
                console.error("Error:", error_29.message);
                res.status(400).send("Webhook Error: ".concat(error_29.message));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
freelanceController.servicePaymentByStripe = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, orderId, clientId, freelancerId, amount, amountToAdd, session, error_30;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, orderId = _a.orderId, clientId = _a.clientId, freelancerId = _a.freelancerId, amount = _a.amount;
                if (typeof amount === 'undefined') {
                    return [2 /*return*/, res.status(400).json({ error: 'Amount is required' })];
                }
                amountToAdd = parseFloat(amount);
                if (isNaN(amountToAdd)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Amount must be a valid number' })];
                }
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        line_items: [
                            {
                                price_data: {
                                    currency: "inr",
                                    product_data: { name: "Order payment" },
                                    unit_amount: amountToAdd * 100,
                                },
                                quantity: 1,
                            },
                        ],
                        mode: "payment",
                        success_url: "http://localhost:3000/hiredHistory/success",
                        cancel_url: "http://localhost:3000/hiredHistory/cancel",
                        payment_intent_data: {
                            metadata: { orderId: orderId, clientId: clientId, freelancerId: freelancerId._id, amount: amount, method: "order" },
                        }
                    })];
            case 1:
                session = _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Payment successfully created", id: session.id })];
            case 2:
                error_30 = _b.sent();
                console.error(error_30);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
freelanceController.servicePaymentByStripeWebhook = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sig, endpointSecret, event_2, session, error_31;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                sig = req.headers["stripe-signature"];
                endpointSecret = process.env.STRIPE_WEBHOOK_SECRET2;
                event_2 = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
                if (!(event_2.type === "checkout.session.completed")) return [3 /*break*/, 2];
                session = event_2.data.object;
                return [4 /*yield*/, handleOrderPayment(session)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                res.status(200).json({ message: "Webhook received successfully" });
                return [3 /*break*/, 4];
            case 3:
                error_31 = _a.sent();
                console.error("Error:", error_31.message);
                res.status(400).send("Webhook Error: ".concat(error_31.message));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = freelanceController;
//# sourceMappingURL=freelanceController.js.map