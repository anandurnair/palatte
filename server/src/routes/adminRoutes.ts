import express from 'express'
const adminRouter = express.Router()
const adminController = require('../controllers/adminController')
adminRouter.post('/admin-login',adminController.adminLogin)
adminRouter.get('/getUsers',adminController.getUsers)
adminRouter.post('/block-user',adminController.blockUser)
export default adminRouter   