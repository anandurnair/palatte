import { Request, Response } from "express";
import UserModal from "../models/user";
const userController: any = {};
const nodemailer = require("nodemailer");
import bcrypt from "bcrypt";
const {cloudinary} = require('../utils/cloudinary') 
const jwt = require("jsonwebtoken");
const {generateToken} = require('../utils/jwtHelper')
let generatedOTP: string = "";
let otpGeneratedTime: Number;
const generateOTP = () => {
  otpGeneratedTime = Date.now();
  return Math.floor(100000 + Math.random() * 900000).toString();
};
  
userController.loginData = async (                                                      
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log("working");
    const { email, password } = req.body;
    const user = await UserModal.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "User not exist" });
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(400).json({ error: "Inavaid password" });
    }
    const token = await generateToken(user)
    res.cookie('auth_token', token, {
      maxAge: 60 * 60 * 24 * 7, // Set cookie expiration (adjust as needed)
    });

    res.status(200).json({ message: "User created successfully!" ,user,token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

userController.signupData = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log("working");

    const {
      fullname,
      email,
      password,
    }: { fullname: string; email: string; password: string } = req.body;
    const isExist = await UserModal.findOne({ email });

    if (isExist) {
      console.log("Is exists : ", isExist);
      return res.status(400).json({ error: "user already exists" });
    }
    console.log('working it')
    sendEmail(email);

    let user = { fullname, email, password };
    res.status(200).json({ message: "User created successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
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
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

userController.resendOTP = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { tempUser } = req.body;
    console.log("Email : ", tempUser);
    const { email } = tempUser;
    generatedOTP =''
    sendEmail(email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

userController.verifyOTP = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { OTP, tempUser } = req.body;
    let newTime = Date.now();
    console.log("New Time : ", newTime);
    console.log("Old time : ", otpGeneratedTime);
    let timeDifference: Number =
      (Number(newTime) - Number(otpGeneratedTime)) / 1000;
    console.log("Difference : ", timeDifference);

    let isExpired = Number(timeDifference) > 60;

    const isOtpValid = OTP === generatedOTP;
    if (!isOtpValid) {
      console.log("verification failed");
      return res.status(400).json({ error: "OTP VERIFICATION FAILED" });
    }
    if (isExpired) {
      console.log("OTP Expired");
      return res.status(400).json({ error: "OTP EXPIRED" });
    }
    console.log("Verification successfull");
    const { fullname, email, password } = tempUser;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: any = new UserModal({
      fullname,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(200).json({ message: "OTP VERIFICATION SUCCESSFULL ", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

userController.createProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log("working createProfile");

    const {
      profilePic,
      email,
      fullname,
      username,
      bio,
      phone,
      country,
      isFreelance,
      selectedKeys,
    } = req.body;
    console.log('bio',email)
    const uploadedImg = await cloudinary.uploader.upload(profilePic)
    console.log("photo :", uploadedImg.url);
    const user = await UserModal.findOne({ email: email });
    console.log("user : ", user);
    const newUser: any = await UserModal.findByIdAndUpdate(user._id, {
      profileImg : uploadedImg.url,
      fullname,
      username,
      phone,
      country,
      bio,
      freelance: isFreelance,
    });

    if (!newUser) {
      return res.status(400).json({ error: "ERROR DURING PROFILE CREATION" });
    }

    const updatedUser = await UserModal.findOne({ email: email });

    console.log('worked create profile',newUser)
    console.log('worked create profile 2 :',updatedUser)
    res.status(200).json({ message: "PROFILE CREATED SUCCESSFULLY",updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

userController.userDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.query;
    const user = await UserModal.findOne({ email: email });
    console.log(user);

    res
      .status(200)
      .json({ message: "USER DETAILS FETCHED SUCCESSFULLY", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

userController.changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    console.log(email, oldPassword, newPassword);
    
    const user = await UserModal.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "Invalid User" });
    }

    const passwordsMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordsMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModal.findByIdAndUpdate(user._id, { password: hashedPassword });
    
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


userController.forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log('forgot password is working')
    const { email } = req.body;
    console.log(email)
    const user = await UserModal.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "INVALID USER" });
    }
    sendEmail(email);
    console.log('otp sended')
    res.status(200).json({ message: "OTP SENT" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

userController.verifyPasswordOTP = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { OTP, email } = req.body;
    console.log('verify otp is working')

    let newTime = Date.now();
    console.log("New Time : ", newTime);
    console.log("Old time : ", otpGeneratedTime);
    let timeDifference: Number =
      (Number(newTime) - Number(otpGeneratedTime)) / 1000;
    console.log("Difference : ", timeDifference);

    let isExpired = Number(timeDifference) > 60;

    const isOtpValid = OTP === generatedOTP;
    if (!isOtpValid) {
      console.log("verification failed");
      return res.status(400).json({ error: "OTP VERIFICATION FAILED" });
    }
    if (isExpired) {
      console.log("OTP Expired");
      return res.status(400).json({ error: "OTP EXPIRED" });
    }
    return res.status(200).json({ messsge: "VERIFICATION SUCCESSFULL" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

userController.resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log('reset password is working')

    const { email, newPassword } = req.body;
    const user = await UserModal.findOne({ email: email });
    if (!user) {
    return res.status(400).json({ error: "Invalid User" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModal.findByIdAndUpdate(user._id, { password: hashedPassword });
   return res.status(200).json({ message: "PASSWORD UPDATED SUCCESSFULLY" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = userController;
