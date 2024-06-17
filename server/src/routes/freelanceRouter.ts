import express from "express";
const freelanceRouter = express.Router()
import verifyToken from '../middlewares/auth' 
import freelanceController from "../controllers/freelanceController";
const bodyParser = require('body-parser');

freelanceRouter.get('/get-freelancers-by-serviceName',freelanceController.getFreelancersByService)
freelanceRouter.get('/getUsersByServiceAndUsername',freelanceController.getUsersByServiceAndUsername)
freelanceRouter.post('/add-freelance-service',freelanceController.addFreelanceService)
freelanceRouter.post('/edit-freelance-sevice',freelanceController.editFreelanceService)
freelanceRouter.get('/get-freelance-service-list',freelanceController.getFreelanceServiceList)
freelanceRouter.get('/get-freelance-service-details',freelanceController.getFreelanceServiceDetails)
freelanceRouter.delete('/remove-freelance-service',freelanceController.deleteFreelanceService)
freelanceRouter.post('/post-order',freelanceController.postOrder);
freelanceRouter.get('/get-freelance-orders',freelanceController.getFreelancerOrders)
freelanceRouter.get('/get-client-orders',freelanceController.getClientOrders)
freelanceRouter.patch('/accept-order',freelanceController.acceptOrder);
freelanceRouter.patch('/reject-order',freelanceController.rejectOrder);
freelanceRouter.patch('/cancel-order',freelanceController.cancelOrder);
freelanceRouter.delete('/remove-order',freelanceController.removeOrder);
freelanceRouter.post('/add-wallet-amount',freelanceController.addWalletAmount)
freelanceRouter.get('/get-wallet-by-userId',freelanceController.getWalletByUserID)
freelanceRouter.post('/service-payment-by-wallet',freelanceController.servicePaymentPending);
freelanceRouter.post('/service-payment-by-stripe',freelanceController.servicePaymentByStripe)
freelanceRouter.post('/upload-freelance-work',freelanceController.uploadFreelanceWork)
freelanceRouter.post('/approve-Work',freelanceController.approveWork);
freelanceRouter.post('/add-review',freelanceController.addReview)
freelanceRouter.get('/get-review-list',freelanceController.getReviewList)
freelanceRouter.post('/revise-work',freelanceController.reviseWork);
freelanceRouter.patch('/edit-review',freelanceController.editReview);
freelanceRouter.delete('/delete-review',freelanceController.deleteReview);
freelanceRouter.post("/work-uncompleted",freelanceController.workUncomplete)
// freelanceRouter.post('/webhook', express.raw({ type: 'application/json' }),freelanceController.webhook)
export default  freelanceRouter;
