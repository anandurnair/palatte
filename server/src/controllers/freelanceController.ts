import { Request, Response } from "express";
import UserModal from "../models/user";
import STATUS_CODES from "../utils/constants";
const freelanceController: any = {};
const { cloudinary } = require("../utils/cloudinary");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import FreelanceDetailsModel from "../models/freelanceDetails";
import OrderModel from "../models/orders";
import mongoose from "mongoose";
import { format } from "date-fns";
import PendingPaymentModel from "../models/pendingPayments";
import WalletModel from "../models/wallet";
import CompletedWorksModel from "../models/completedWorks";
freelanceController.getFreelancersByService = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { serviceName } = req.query;
    const freelanceDetails = await FreelanceDetailsModel.find({
      "services.title": serviceName,
    }).populate("userId");

    // Extract user details
    const freelancers = freelanceDetails.map((detail) => detail.userId);

    res
      .status(STATUS_CODES.OK)
      .json({ message: "freelancers successfully fetched", freelancers });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.addFreelanceService = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, serviceName, description, basic, standard, premium } =
      req.body;

    // Validation
    if (
      !userId ||
      !serviceName ||
      !description ||
      !basic ||
      !standard ||
      !premium
    ) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "All fields are required" });
    }

    // Check if the user exists
    const userFreelanceDetails = await FreelanceDetailsModel.findOne({
      userId,
    });

    if (userFreelanceDetails) {
      // Check if the service with the same name already exists
      const serviceExists = userFreelanceDetails.services.some(
        (service) => service.title === serviceName
      );

      if (serviceExists) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ error: "Service already exists" });
      }

      // Add new service to existing user
      userFreelanceDetails.services.push({
        title: serviceName,
        description,
        plans: [basic, standard, premium],
      });

      await userFreelanceDetails.save();

      return res
        .status(STATUS_CODES.OK)
        .json({ message: "Service successfully added" });
    }

    // If user does not exist, create a new entry
    const newFreelance = new FreelanceDetailsModel({
      userId,
      services: [
        {
          title: serviceName,
          description,
          plans: [basic, standard, premium],
        },
      ],
    });

    await newFreelance.save();
    res.status(STATUS_CODES.OK).json({ message: "Service successfully added" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.getFreelanceServiceList = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.query.userId;
    const freelancerServices = await FreelanceDetailsModel.findOne({ userId });

    res.status(STATUS_CODES.OK).json({
      message: "freelancers successfully fetched",
      freelancerServices,
    });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.getFreelanceServiceDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, serviceName } = req.query;

    if (!userId || !serviceName) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "userId and serviceName are required" });
    }

    const freelancerServices = await FreelanceDetailsModel.findOne({ userId });

    if (!freelancerServices) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: "Freelancer not found" });
    }

    const service = freelancerServices.services.find(
      (service) => service.title === serviceName
    );

    if (!service) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: "Service not found" });
    }

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Service successfully fetched", service });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.deleteFreelanceService = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, serviceName } = req.query;

    if (!userId || !serviceName) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "userId and serviceName are required" });
    }

    const freelancerServices = await FreelanceDetailsModel.findOne({ userId });

    if (!freelancerServices) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: "Freelancer not found" });
    }

    const serviceIndex = freelancerServices.services.findIndex(
      (service) => service.title === serviceName
    );

    if (serviceIndex === -1) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ error: "Service not found" });
    }

    freelancerServices.services.splice(serviceIndex, 1);

    await freelancerServices.save();

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Service successfully deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.postOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { freelancer, client, requirements, plan, serviceName } = req.body;

    // Create a new order
    const newOrder = new OrderModel({
      freelancer,
      client,
      requirements,
      serviceName,
      plan,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Send a response with the saved order
    res.status(STATUS_CODES.OK).json({ message: "Order send successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.getFreelancerOrders = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;
    const orders = await OrderModel.find({ freelancer: userId }).populate(
      "client"
    );

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.getClientOrders = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;
    const orders = await OrderModel.find({ client: userId }).populate(
      "freelancer"
    );

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.acceptOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId } = req.query;
    await OrderModel.findByIdAndUpdate(orderId, { status: "accepted" });

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Order acccepted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.rejectOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId } = req.query;
    await OrderModel.findByIdAndUpdate(orderId, { status: "rejected" });

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Order rejected successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.cancelOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId } = req.query;
    await OrderModel.findByIdAndUpdate(orderId, { status: "cancelled" });

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};
freelanceController.removeOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId } = req.query;
    await OrderModel.findByIdAndDelete(orderId);

    res.status(STATUS_CODES.OK).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.addWalletAmount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { addAmount, userId } = req.body;
    const BANK_OBJECT_ID = "60d5ec49b3b4cd39e4d8a4e5";
    if (typeof addAmount === "undefined" || typeof userId === "undefined") {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "addAmount and userId are required" });
    }

    const amountToAdd = parseFloat(addAmount);

    if (isNaN(amountToAdd)) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "addAmount must be a number" });
    }

    // Find the user's wallet
    let wallet = await WalletModel.findOne({ user: userId });

    // If wallet does not exist, create a new one
    if (!wallet) {
      wallet = new WalletModel({
        user: userId,
        balance: 0,
        transactions: [],
      });
    }
    const formattedDate = format(new Date(), "dd MMM yyyy hh:mm a");

    // Update the balance
    wallet.balance = parseFloat(wallet.balance.toString()) + amountToAdd;

    // Add the transaction
    wallet.transactions.push({
      amount: amountToAdd,
      type: "credit",
      payer: new mongoose.Types.ObjectId(BANK_OBJECT_ID), // Use ObjectId for the bank
      date: formattedDate,
    });

    // Save the wallet
    await wallet.save();

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Amount added successfully", balance: wallet.balance });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.getWalletByUserID = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;
    const wallet = await WalletModel.findOne({ user: userId }).populate(
      "transactions.payer"
    );

    res
      .status(STATUS_CODES.OK)
      .json({ message: "Wallet fetched successfully", wallet });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.servicePaymentPending = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId, clientId, freelancerId, amount } = req.body;
    const isExist = await PendingPaymentModel.findOne({ orderId });
    console.log("ORders : ", req.body);
    if (isExist) {
     return res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Already paid" });
    }
    const newPayment = new PendingPaymentModel({
      orderId,
      clientId,
      freelancerId,
      amount,
    });

    await newPayment.save();

    const currentTime = new Date();
    const deadlineDate = new Date(
      currentTime.getTime() + 2 * 24 * 60 * 60 * 1000
    );

    await OrderModel.findByIdAndUpdate(orderId, {
      status: "in progress",
      deadline: deadlineDate,
    });

    return res.status(STATUS_CODES.OK).json({ message: "Payment successfull" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.uploadFreelanceWork= async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId,image } = req.body;

    const isExist = await CompletedWorksModel.find({orderId})
    if(isExist){
      return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: "Work already uploaded" });
  
    }
    const uploadResponse = await cloudinary.uploader.upload(image, {
      resource_type: "auto",
    });
    const newCompletedWork = new CompletedWorksModel({
      orderId,
      image:uploadResponse.url
    })
    await newCompletedWork.save();
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Work Uploaded successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export default freelanceController;
// const session = await stripe.checkout.sessions.create({
//   payment_method_types: ['card'],
//   line_items: [{
//     price_data: {
//       currency: 'inr',
//       product_data: {
//         name: 'Wallet Top-up',
//       },
//       unit_amount: addAmount * 100,
//     },
//     quantity: 1,
//   }],
//   mode: 'payment',
//   success_url: 'http://localhost:3000/success',
//   cancel_url: 'http://localhost:3000/cancel',
// });
//  return  res.status(STATUS_CODES.OK).json({message:'Order deleted successfully',id: session.id});
