import { Request, Response } from "express";
import UserModal from "../models/user"; // Assuming UserModal is exported as default and User interface is defined in 'user' module

const userController: any = {}; // Define type for userController if possible

userController.signupData = async (
  req: Request,
  res: Response
):  Promise<void> => {
  try {
    console.log('working');
    
    const {
      fullname,
      email,
      password,
    }: { fullname: string; email: string; password: string } = req.body;
    const user: any = new UserModal({ fullname, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = userController;
