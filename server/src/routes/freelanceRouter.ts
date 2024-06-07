import express from "express";
const freelanceRouter = express.Router()
import verifyToken from '../middlewares/auth' 
import freelanceController from "../controllers/freelanceController";

freelanceRouter.get('/get-freelancers-by-serviceName',freelanceController.getFreelancersByService)
freelanceRouter.post('/add-freelance-service',freelanceController.addFreelanceService)
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
freelanceRouter.post('/service-payment',freelanceController.servicePaymentPending)
freelanceRouter.post('/upload-freelance-work',freelanceController.uploadFreelanceWork)
export default  freelanceRouter;
