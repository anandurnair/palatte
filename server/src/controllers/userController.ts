import { Request, Response } from "express";
import UserModal from "../models/user";
const userController: any = {};
const nodemailer = require("nodemailer");
import bcrypt from "bcrypt";

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

    res.status(201).json({ message: "User created successfully!" });
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

    // if (isExist) {
    //   console.log("Is exists : ", isExist);
    //   return res.status(400).json({ error: "user already exists" });
    // }
    sendEmail(email);

    let user = { fullname, email, password };
    res.status(201).json({ message: "User created successfully!", user });
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
    res.status(201).json({ message: "OTP VERIFICATION SUCCESSFULL ", newUser });
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
    console.log('working');
    
    const {email, fullname, username, bio, phone,country, isFreelance, selectedKeys } =
      req.body;
      console.log('email:',email)
      const user = await UserModal.findOne({email:email})
      console.log('user : ',user)
    const newUser: any = await  UserModal.findByIdAndUpdate(user._id,{
      fullname,
      username,
      phone,
      country,
      bio,
      freelance: isFreelance,
    });
    
    if(!newUser){
      return res.status(400).json({ error:"ERROR DURING PROFILE CREATION" });

    }

    res.status(201).json({ message: "PROFILE CREATED SUCCESSFULLY" });
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
    const {email} = req.query
    const user = await UserModal.findOne({email:email})
    console.log(user);
    
    res.status(201).json({ message: "USER DETAILS FETCHED SUCCESSFULLY" ,user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = userController;
