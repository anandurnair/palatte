// src/controllers/userController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { cloudinary } from "../utils/cloudinary";
import jwt from "jsonwebtoken";
import STATUS_CODES from "../utils/constants";
import fetch from "node-fetch";
import { generateToken } from "../utils/jwtHelper";
import UserRepository from "../repositories/UserRepository";

const userController: any = {};
let generatedOTP: string = "";
let otpGeneratedTime: number;

const generateOTP = () => {
  otpGeneratedTime = Date.now();
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anandurpallam@gmail.com",
      pass: "gxej hquc oifu hzdo",
    },
  });

  generatedOTP = generateOTP();

  const mailOptions = {
    from: "anandurpallam@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${generatedOTP}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

userController.loginData = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      return res.status(400).json({ error: "User not exist" });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    if (user.isBlocked) {
      return res.status(400).json({ error: "User Blocked" });
    }

    const token = generateToken(user);

    const allSaved = await UserRepository.getAllSavedPosts(user._id);
    const userWithSavedPosts = { ...user.toObject(), allSaved };

    res.status(200).json({ message: "User logged in successfully!", user: userWithSavedPosts, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

userController.signupData = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fullname, email, password } = req.body;
    const isExist = await UserRepository.findOne({ email });

    if (isExist) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "user already exists" });
    }
    sendEmail(email);

    const user = { fullname, email, password };
    res.status(STATUS_CODES.OK).json({ message: "User created successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

userController.getUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.query;
    const user = await UserRepository.findById(userId);
    const posts = await UserRepository.getPostsByUserId(userId);
    const allSaved = await UserRepository.getAllSavedPosts(user._id);

    const userWithSavedPosts = { ...user.toObject(), allSaved };
    res.status(STATUS_CODES.OK).json({ message: "USER DETAILS FETCHED SUCCESSFULLY", user: userWithSavedPosts, posts });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

userController.verifyOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { OTP, tempUser } = req.body;
    const newTime = Date.now();
    const timeDifference = (newTime - otpGeneratedTime) / 1000;
    const isExpired = timeDifference > 60;
    const isOtpValid = OTP === generatedOTP;

    if (!isOtpValid || isExpired) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: isOtpValid ? "OTP EXPIRED" : "OTP VERIFICATION FAILED" });
    }

    const { fullname, email, password } = tempUser;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.createUser({ fullname, email, password: hashedPassword });
    const token = generateToken(newUser);

    const allCollection = await UserRepository.createCollection({ name: 'All', user: newUser._id, isDefault: true });
    newUser.allCollection = allCollection._id;
    newUser.savedCollections.push(allCollection._id);
    await newUser.save();

    const allSaved = await UserRepository.getAllSavedPosts(newUser._id);
    const userWithSavedPosts = { ...newUser.toObject(), allSaved };

    res.status(STATUS_CODES.OK).json({ message: "OTP VERIFICATION SUCCESSFUL", user: userWithSavedPosts, token });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

// Similar changes to other methods of userController, replacing direct model calls with repository methods

userController.createProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, profileData } = req.body;
    const updatedUser = await UserRepository.updateUser(userId, profileData);
    res.status(STATUS_CODES.OK).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

userController.userDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.query;
    const user = await UserRepository.findById(userId);
    res.status(STATUS_CODES.OK).json({ message: "User details fetched successfully", user });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

userController.changePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const user = await UserRepository.findById(userId);

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(STATUS_CODES.OK).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

userController.verifyPasswordOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { OTP, userId } = req.body;
    const newTime = Date.now();
    const timeDifference = (newTime - otpGeneratedTime) / 1000;
    const isExpired = timeDifference > 60;
    const isOtpValid = OTP === generatedOTP;

    if (!isOtpValid || isExpired) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: isOtpValid ? "OTP EXPIRED" : "OTP VERIFICATION FAILED" });
    }

    res.status(STATUS_CODES.OK).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

userController.resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, newPassword } = req.body;
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(STATUS_CODES.OK).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

userController.editProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, profileData } = req.body;
    const updatedUser = await UserRepository.updateUser(userId, profileData);
    res.status(STATUS_CODES.OK).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};


