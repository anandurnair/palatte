"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var adminRouter = express_1.default.Router();
var adminController = require('../controllers/adminController');
var serviceController = require('../controllers/serviceController');
adminRouter.post('/admin-login', adminController.adminLogin);
adminRouter.get('/getUsers', adminController.getUsers);
adminRouter.post('/block-user', adminController.blockUser);
adminRouter.get('/list-counts', adminController.listCounts);
adminRouter.get('/get-transactions', adminController.getTransactions);
adminRouter.get('/get-service-counts', adminController.getServiceCounts);
exports.default = adminRouter;
//# sourceMappingURL=adminRoutes.js.map