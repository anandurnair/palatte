import { Request, Response } from "express";
import UserModal from "../models/user";
const adminController: any = {};
import bcrypt from "bcrypt";
import ServiceModal from "../models/service";
import STATUS_CODES from "../utils/constants";
import UserModel from "../models/user";
import CommentModel from "../models/comment";
import LikeModal from "../models/like";
import PostModel from "../models/post";
import OrderModel from "../models/orders";

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

adminController.listCounts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const usersCount = await UserModal.countDocuments();
    const postCount = await PostModel.countDocuments();
    const orderCount = await OrderModel.countDocuments();
    const commentCount = await CommentModel.countDocuments();

    return res
      .status(STATUS_CODES.OK)
      .json({
        message: "Data fetched successfully",
        usersCount,
        postCount,
        orderCount,
        commentCount,
      });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

adminController.getTransactions = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const orders = await OrderModel.find({status:"completed"})

    return res
      .status(STATUS_CODES.OK)
      .json({
        message: "Data fetched successfully",
        orders
      });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

adminController.getServiceCounts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const allServices = await ServiceModal.find(); 
      const completedOrders = await OrderModel.find({ status: "completed" });

      const serviceOrderCount = allServices.map((service :any) => ({
        serviceName: service.serviceName,
        orderCount: 0
      }));

      completedOrders.forEach(order => {
        const service = serviceOrderCount.find(s => s.serviceName === order.serviceName);
        if (service) {
          service.orderCount += 1;
        }
      });
    return res
      .status(STATUS_CODES.OK)
      .json({
        message: "Data fetched successfully",
        serviceOrderCount
      });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


module.exports = adminController;
