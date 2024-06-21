"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var freelanceRouter = express_1.default.Router();
var freelanceController_1 = __importDefault(require("../controllers/freelanceController"));
var bodyParser = require('body-parser');
freelanceRouter.get('/get-freelancers-by-serviceName', freelanceController_1.default.getFreelancersByService);
freelanceRouter.get('/getUsersByServiceAndUsername', freelanceController_1.default.getUsersByServiceAndUsername);
freelanceRouter.post('/add-freelance-service', freelanceController_1.default.addFreelanceService);
freelanceRouter.post('/edit-freelance-sevice', freelanceController_1.default.editFreelanceService);
freelanceRouter.get('/get-freelance-service-list', freelanceController_1.default.getFreelanceServiceList);
freelanceRouter.get('/get-freelance-service-details', freelanceController_1.default.getFreelanceServiceDetails);
freelanceRouter.delete('/remove-freelance-service', freelanceController_1.default.deleteFreelanceService);
freelanceRouter.post('/post-order', freelanceController_1.default.postOrder);
freelanceRouter.get('/get-freelance-orders', freelanceController_1.default.getFreelancerOrders);
freelanceRouter.get('/get-client-orders', freelanceController_1.default.getClientOrders);
freelanceRouter.patch('/accept-order', freelanceController_1.default.acceptOrder);
freelanceRouter.patch('/reject-order', freelanceController_1.default.rejectOrder);
freelanceRouter.patch('/cancel-order', freelanceController_1.default.cancelOrder);
freelanceRouter.delete('/remove-order', freelanceController_1.default.removeOrder);
freelanceRouter.post('/add-wallet-amount', freelanceController_1.default.addWalletAmount);
freelanceRouter.get('/get-wallet-by-userId', freelanceController_1.default.getWalletByUserID);
freelanceRouter.post('/service-payment-by-wallet', freelanceController_1.default.servicePaymentPending);
freelanceRouter.post('/service-payment-by-stripe', freelanceController_1.default.servicePaymentByStripe);
freelanceRouter.post('/upload-freelance-work', freelanceController_1.default.uploadFreelanceWork);
freelanceRouter.post('/approve-Work', freelanceController_1.default.approveWork);
freelanceRouter.post('/add-review', freelanceController_1.default.addReview);
freelanceRouter.get('/get-review-list', freelanceController_1.default.getReviewList);
freelanceRouter.post('/revise-work', freelanceController_1.default.reviseWork);
freelanceRouter.patch('/edit-review', freelanceController_1.default.editReview);
freelanceRouter.delete('/delete-review', freelanceController_1.default.deleteReview);
freelanceRouter.post("/work-uncompleted", freelanceController_1.default.workUncomplete);
// freelanceRouter.post('/webhook', express.raw({ type: 'application/json' }),freelanceController.webhook)
exports.default = freelanceRouter;
//# sourceMappingURL=freelanceRouter.js.map