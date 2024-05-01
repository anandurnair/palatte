import { Request, Response } from "express";
import UserModal from "../models/user";
const adminController: any = {};
import bcrypt from "bcrypt";

const adminUsername = "admin123";
const adminPassword = "123";
adminController.adminLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { username, password } = req.body;
    if (username === adminUsername && password === adminPassword) {
      res.status(201).json({ message: "LOGIN SUCCESSFULLY" });
    } else {
      res.status(400).json({ error: "INVALID USERNAME OR PASSOWORD" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

adminController.getUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await UserModal.find();
    if (users) {
      return res
        .status(200)
        .json({ message: "Data fetched successfully", users });
    } else {
      return res.status(400).json({ error: "INVALID USERNAME OR PASSOWORD" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


adminController.blockUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
   const {email} = req.body;
   console.log('User eamil',email)
   const user = await UserModal.findOne({email:email})
   if(!user){
    return res.status(400).json({error:'User is not found'})
   }
   if(user.isBlocked){
    await UserModal.findByIdAndUpdate(user._id,{status:'active',isBlocked:false})
    return res.status(201).json({message:'Unblocked sucessfully'})

  }else{
     await UserModal.findByIdAndUpdate(user._id,{status:'blocked',isBlocked:true})
     return res.status(201).json({message:'Blocked sucessfully'})
   }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = adminController;
