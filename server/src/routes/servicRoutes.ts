import express from 'express'
const serviceRouter = express.Router()
import ServiceModal from '../models/service'
import serviceController from '../controllers/serviceController'


serviceRouter.get('/getServices',serviceController.serviceList)
serviceRouter.post('/addService',serviceController.createService)
serviceRouter.delete('/delete-service',serviceController.deleteService)

export default serviceRouter;
