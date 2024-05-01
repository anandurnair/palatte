import express from 'express'
const userRouter = express.Router()
const verifyToken = require('../middlewares/auth') 
const userController = require('../controllers/userController')
userRouter.post('/loginData',userController.loginData)

userRouter.post('/signupData',userController.signupData)
userRouter.post('/otp',userController.verifyOTP)
userRouter.post('/resendOTP',userController.resendOTP)
userRouter.post('/create-profile',userController.createProfile)
userRouter.get('/user-details',userController.userDetails)
userRouter.post('/change-password',userController.changePassword)
userRouter.post('/forgot-password',userController.forgotPassword)
userRouter.post('/verify-password-otp',userController.verifyPasswordOTP)
userRouter.post('/reset-password',userController.resetPassword)


export default userRouter   