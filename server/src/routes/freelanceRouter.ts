import express from "express";
const freelanceRouter = express.Router()
import verifyToken from '../middlewares/auth' 
import freelanceController from "../controllers/freelanceController";

freelanceRouter.get('/get-freelancers-by-Id',freelanceController.getFreelancersByService)

export default  freelanceRouter;
