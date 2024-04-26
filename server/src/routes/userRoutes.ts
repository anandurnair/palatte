import express from 'express'
const userRouter = express.Router()
import { Request, Response } from 'express';

const userController = require('../controllers/userController')
userRouter.post('/loginData',middleware,userController.loginData)

function middleware():void{
    console.log('working');
    
}
userRouter.post('/signupData',userController.signupData)

userRouter.post('/otp',userController.verifyOTP)

userRouter.post('/resendOTP',userController.resendOTP)
userRouter.post('/create-profile',userController.createProfile)
userRouter.get('/user-details',userController.userDetails)
export default userRouter   