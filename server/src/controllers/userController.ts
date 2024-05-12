import { Request, Response } from "express";
import UserModal from "../models/user";
const userController: any = {};
const nodemailer = require("nodemailer");
import bcrypt from "bcrypt";
const { cloudinary } = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwtHelper");
import STATUS_CODES from "../utils/constants";
import fetch from "node-fetch"; // Import node-fetch
import PostModel from "../models/post";

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
    const { email, password } = req.body;
    const user = await UserModal.findOne({ email: email }).populate("saved");

    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "User not exist" });
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Inavaid password" });
    }
    if (user.isBlocked) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "User Blocked" });
    }
    const token = generateToken(user);
    console.log("logged successfully");
    res
      .status(STATUS_CODES.OK)
      .json({ message: "User created successfully!", user, token });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

userController.signupData = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      fullname,
      email,
      password,
    }: { fullname: string; email: string; password: string } = req.body;
    const isExist = await UserModal.findOne({ email });

    if (isExist) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "user already exists" });
    }
    sendEmail(email);

    let user = { fullname, email, password };
    res
      .status(STATUS_CODES.OK)
      .json({ message: "User created successfully!", user });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

userController.getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;

    const user = await UserModal.findById(userId).populate("saved");
    const posts = await PostModel.find({ userId });
    res
      .status(STATUS_CODES.OK)
      .json({ message: "USER DETAILS FETCHED SUCCESSFULLY", user, posts });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
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
    const { email } = tempUser;
    generatedOTP = "";
    sendEmail(email);
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

userController.verifyOTP = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { OTP, tempUser } = req.body;
    let newTime = Date.now();

    let timeDifference: Number =
      (Number(newTime) - Number(otpGeneratedTime)) / 1000;

    let isExpired = Number(timeDifference) > 60;

    const isOtpValid = OTP === generatedOTP;
    if (!isOtpValid) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "OTP VERIFICATION FAILED" });
    }
    if (isExpired) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "OTP EXPIRED" });
    }
    const { fullname, email, password } = tempUser;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: any = new UserModal({
      fullname,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const user = await UserModal.findOne({ email });
    const token = generateToken(user);

    res
      .status(STATUS_CODES.OK)
      .json({ message: "OTP VERIFICATION SUCCESSFULL ", user, token });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

userController.createProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
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

    const isUser = await UserModal.findOne({ username });

    if (isUser) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Username already exists" });
    }

    const uploadedImg = await cloudinary.uploader.upload(profilePic, {
      folder: "profile",
    });

    const user = await UserModal.findOne({ email: email });

    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "User not found" });
    }

    const newUser = await UserModal.findByIdAndUpdate(
      user._id,
      {
        profileImg: uploadedImg.url,
        fullname,
        username,
        phone,
        country,
        bio,
        freelance: isFreelance,
      },
      { new: true }
    );

    const updatedUser = await UserModal.findOne({ email });
    if (!newUser) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Error during profile update" });
    }

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Profile created successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//Edit Profile

userController.editProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { profilePic, email, fullname, username, bio, phone, country } =
      req.body;

    const isUser = await UserModal.findOne({ username });
    const uploadedImg = await cloudinary.uploader.upload(profilePic);
    const user = await UserModal.findOne({ email: email });
    const newUser: any = await UserModal.findByIdAndUpdate(user._id, {
      profileImg: uploadedImg.url,
      fullname,
      username,
      phone,
      country,
      bio,
    });

    if (!newUser) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "ERROR DURING PROFILE EDIT" });
    }

    const updatedUser = await UserModal.findOne({ email: email });

    res
      .status(STATUS_CODES.OK)
      .json({ message: "PROFILE CREATED SUCCESSFULLY", updatedUser });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

userController.userDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.query;
    const user = await UserModal.findOne({ email: email }).populate("saved");

    res
      .status(STATUS_CODES.OK)
      .json({ message: "USER DETAILS FETCHED SUCCESSFULLY", user });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

userController.changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const user = await UserModal.findOne({ email: email });
    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Invalid User" });
    }

    const passwordsMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordsMatch) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModal.findByIdAndUpdate(user._id, { password: hashedPassword });

    return res
      .status(STATUS_CODES.OK)
      .json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

userController.forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await UserModal.findOne({ email: email });
    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "INVALID USER" });
    }
    sendEmail(email);
    res.status(STATUS_CODES.OK).json({ message: "OTP SENT" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

userController.verifyPasswordOTP = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { OTP, email } = req.body;

    let newTime = Date.now();

    let timeDifference: Number =
      (Number(newTime) - Number(otpGeneratedTime)) / 1000;

    let isExpired = Number(timeDifference) > 60;

    const isOtpValid = OTP === generatedOTP;
    if (!isOtpValid) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "OTP VERIFICATION FAILED" });
    }
    if (isExpired) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "OTP EXPIRED" });
    }
    return res
      .status(STATUS_CODES.OK)
      .json({ messsge: "VERIFICATION SUCCESSFULL" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

userController.resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, newPassword } = req.body;
    const user = await UserModal.findOne({ email: email });
    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Invalid User" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModal.findByIdAndUpdate(user._id, { password: hashedPassword });
    return res
      .status(STATUS_CODES.OK)
      .json({ message: "PASSWORD UPDATED SUCCESSFULLY" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

userController.searchUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { username } = req.body;
    const prefix = username.trim();
    const regex = new RegExp("^" + prefix, "i");
    const users = await UserModal.find({ username: regex });

    return res
      .status(STATUS_CODES.OK)
      .json({ message: "Searched successfully", users });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

userController.followUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { currentUserId, userId } = req.body;

    const currentUser = await UserModal.findById(currentUserId);

    if (!currentUser) {
      return res.status(STATUS_CODES.OK).json({ error: "User not found" });
    }
    console.log(currentUser);

    const isFollowed = currentUser.following.includes(userId);
    console.log("Is followed", isFollowed, userId);

    if (!isFollowed) {
      await UserModal.findOneAndUpdate(
        { _id: currentUserId },
        { $push: { following: userId } } 
      );
      await UserModal.findByIdAndUpdate(
        {
          _id: userId,
        },
        { $push: { followers: currentUserId } }
      );
      const user = await UserModal.findById(currentUserId);
      return res
        .status(STATUS_CODES.OK)
        .json({ message: "Followed", user });
    } else {
      await UserModal.findOneAndUpdate(
        { _id: currentUserId },
        { $pull: { following: userId } } 
      );
      await UserModal.findByIdAndUpdate(
        {
          _id: userId,
        },
        { $pull: { followers: currentUserId } }
      );
      const user = await UserModal.findById(currentUserId);
      return res
        .status(STATUS_CODES.OK)
        .json({ message: "Unfollowed", user });
    }
   
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


userController.getFollowers  = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {userId} = req.query
    const user = await UserModal.findById(userId).populate('followers')
    const followers = user.followers
    return res
      .status(STATUS_CODES.OK)
      .json({ message: " successfully fetched followers", followers });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


userController.getFollowing  = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    
    const {userId} = req.query
    const user = await UserModal.findById(userId).populate('following')
    const following = user.following
    return res
      .status(STATUS_CODES.OK)
      .json({ message: " successfully fetched followings",following  });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};
module.exports = userController;
