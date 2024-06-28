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
var user_1 = __importDefault(require("../models/user"));
var adminController = {};
var service_1 = __importDefault(require("../models/service"));
var constants_1 = __importDefault(require("../utils/constants"));
var comment_1 = __importDefault(require("../models/comment"));
var post_1 = __importDefault(require("../models/post"));
var orders_1 = __importDefault(require("../models/orders"));
var adminUsername = "admin123";
var adminPassword = "123";
adminController.adminLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password;
    return __generator(this, function (_b) {
        try {
            _a = req.body, username = _a.username, password = _a.password;
            if (username === adminUsername && password === adminPassword) {
                res.status(constants_1.default.OK).json({ message: "LOGIN SUCCESSFULLY" });
            }
            else {
                res
                    .status(constants_1.default.BAD_REQUEST)
                    .json({ error: "INVALID USERNAME OR PASSOWORD" });
            }
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
adminController.getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_1.default.find()];
            case 1:
                users = _a.sent();
                if (users) {
                    return [2 /*return*/, res
                            .status(constants_1.default.OK)
                            .json({ message: "Data fetched successfully", users: users })];
                }
                else {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "INVALID USERNAME OR PASSOWORD" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
adminController.blockUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                email = req.body.email;
                console.log("User eamil", email);
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(constants_1.default.BAD_REQUEST)
                            .json({ error: "User is not found" })];
                }
                if (!user.isBlocked) return [3 /*break*/, 3];
                return [4 /*yield*/, user_1.default.findByIdAndUpdate(user._id, {
                        status: "active",
                        isBlocked: false,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.CREATED)
                        .json({ message: "Unblocked sucessfully" })];
            case 3: return [4 /*yield*/, user_1.default.findByIdAndUpdate(user._id, {
                    status: "blocked",
                    isBlocked: true,
                })];
            case 4:
                _a.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.CREATED)
                        .json({ message: "Blocked sucessfully" })];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.error(error_2);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
adminController.listCounts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usersCount, postCount, orderCount, commentCount, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, user_1.default.countDocuments()];
            case 1:
                usersCount = _a.sent();
                return [4 /*yield*/, post_1.default.countDocuments()];
            case 2:
                postCount = _a.sent();
                return [4 /*yield*/, orders_1.default.countDocuments()];
            case 3:
                orderCount = _a.sent();
                return [4 /*yield*/, comment_1.default.countDocuments()];
            case 4:
                commentCount = _a.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({
                        message: "Data fetched successfully",
                        usersCount: usersCount,
                        postCount: postCount,
                        orderCount: orderCount,
                        commentCount: commentCount,
                    })];
            case 5:
                error_3 = _a.sent();
                console.error(error_3);
                res
                    .status(constants_1.default.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
adminController.getTransactions = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, orders_1.default.find()];
            case 1:
                orders = _a.sent();
                return [2 /*return*/, res
                        .status(constants_1.default.OK)
                        .json({
                        message: "Data fetched successfully",
                        orders: orders
                    })];
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
adminController.getServiceCounts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allServices, completedOrders, serviceOrderCount_1, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, service_1.default.find()];
            case 1:
                allServices = _a.sent();
                return [4 /*yield*/, orders_1.default.find()];
            case 2:
                completedOrders = _a.sent();
                serviceOrderCount_1 = allServices.map(function (service) { return ({
                    serviceName: service.serviceName,
                    orderCount: 0
                }); });
                completedOrders.forEach(function (order) {
                    var service = serviceOrderCount_1.find(function (s) { return s.serviceName === order.serviceName; });
                    if (service) {
                        service.orderCount += 1;
                    }
                });
                return [2 /*return*/, res.status(constants_1.default.OK).json({
                        message: "Data fetched successfully",
                        serviceOrderCount: serviceOrderCount_1
                    })];
            case 3:
                error_5 = _a.sent();
                console.error(error_5);
                res.status(constants_1.default.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
module.exports = adminController;
//# sourceMappingURL=adminController.js.map