import express from 'express'
const userRouter = express.Router()
import verifyToken from '../middlewares/auth' 
const userController = require('../controllers/userController')
userRouter.post('/loginData',userController.loginData)

userRouter.post('/signupData',userController.signupData)
userRouter.post('/otp',userController.verifyOTP)
userRouter.post('/resendOTP',userController.resendOTP)
userRouter.post('/create-profile',verifyToken,userController.createProfile)
userRouter.get('/user-details',verifyToken,userController.userDetails)
userRouter.post('/change-password',verifyToken,userController.changePassword)
userRouter.post('/verify-password-otp',verifyToken,userController.verifyPasswordOTP)
userRouter.post('/reset-password',verifyToken,userController.resetPassword)
userRouter.post('/edit-profile',verifyToken,userController.editProfile)
userRouter.post('/forgot-password',verifyToken,userController.forgotPassword)
userRouter.post('/search-user',verifyToken,userController.searchUser)
userRouter.get('/getUserById',verifyToken,userController.getUserById)
userRouter.post('/follow-user',verifyToken,userController.followUser)
userRouter.get('/get-followers',verifyToken,userController.getFollowers)
userRouter.get('/get-following',verifyToken,userController.getFollowing)

export default userRouter   