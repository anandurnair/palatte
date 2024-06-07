import express from 'express'
const userRouter = express.Router()
import verifyToken from '../middlewares/auth' 
const userController = require('../controllers/userController')
userRouter.post('/loginData',userController.loginData)

userRouter.post('/signupData',userController.signupData)
userRouter.post('/otp',userController.verifyOTP)
userRouter.post('/resendOTP',userController.resendOTP)
userRouter.post('/create-profile',userController.createProfile)
userRouter.get('/user-details',userController.userDetails)
userRouter.post('/change-password',userController.changePassword)
userRouter.post('/verify-password-otp' ,userController.verifyPasswordOTP)
userRouter.post('/reset-password' ,userController.resetPassword)
userRouter.post('/edit-profile' ,userController.editProfile)
userRouter.post('/forgot-password' ,userController.forgotPassword)
userRouter.post('/search-user' ,userController.searchUser)
userRouter.get('/getUserById' ,userController.getUserById)
userRouter.post('/follow-user' ,userController.followUser)
userRouter.get('/get-followers' ,userController.getFollowers)
userRouter.get('/get-following' ,userController.getFollowing)

export default userRouter   