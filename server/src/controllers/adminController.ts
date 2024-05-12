import { Request, Response } from "express";
import UserModal from "../models/user";
const adminController: any = {};
import bcrypt from "bcrypt";
import ServiceModal from "../models/service";
import STATUS_CODES from "../utils/constants";

const adminUsername = "admin123";
const adminPassword = "123";
adminController.adminLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { username, password } = req.body;
    if (username === adminUsername && password === adminPassword) {
      res.status(STATUS_CODES.OK).json({ message: "LOGIN SUCCESSFULLY" });
    } else {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "INVALID USERNAME OR PASSOWORD" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
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
        .status(STATUS_CODES.OK)
        .json({ message: "Data fetched successfully", users });
    } else {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "INVALID USERNAME OR PASSOWORD" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

adminController.blockUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    console.log("User eamil", email);
    const user = await UserModal.findOne({ email: email });
    if (!user) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "User is not found" });
    }
    if (user.isBlocked) {
      await UserModal.findByIdAndUpdate(user._id, {
        status: "active",
        isBlocked: false,
      });
      return res
        .status(STATUS_CODES.CREATED)
        .json({ message: "Unblocked sucessfully" });
    } else {
      await UserModal.findByIdAndUpdate(user._id, {
        status: "blocked",
        isBlocked: true,
      });
      return res
        .status(STATUS_CODES.CREATED)
        .json({ message: "Blocked sucessfully" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

adminController.serviceList = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log("Working");
    const services = await ServiceModal.find();
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Services fetched successfully!", services });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

adminController.createService = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { serviceName } = req.body;
    const isExist = await ServiceModal.findOne({ serviceName });
    if (isExist) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Service already exists" });
    }
    const newService: any = new ServiceModal({
      serviceName,
    });
    await newService.save();
    res.status(STATUS_CODES.OK).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};
module.exports = adminController;
