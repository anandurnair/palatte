import express from 'express'
const userRouter = express.Router()
import { Request, Response } from 'express';

const userController = require('../controllers/userController')

userRouter.post('/signupData',userController.signupData)

function middleware(req :Request,res : Response):void{
    console.log('working')
    
}
export default userRouter