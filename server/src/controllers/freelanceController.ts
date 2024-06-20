import { Request, Response } from "express";
import UserModal from "../models/user";
import STATUS_CODES from "../utils/constants";
const freelanceController: any = {};
const { cloudinary } = require("../utils/cloudinary");
import ReviewsModal from "../models/review";
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

    let filteredUsers = freelanceDetails.map(detail => detail.userId);

    filteredUsers = await Promise.all(filteredUsers.map(async (user:any) => {
      const reviews = await ReviewsModal.find({ freelancerId: user._id });
      const reviewCount = reviews.length;
      let avgRating = reviewCount > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;
      avgRating = Math.round(avgRating);
      return {
        ...user.toObject(),
        reviews: reviewCount,
        avgRating: avgRating
      };
    }));
    filteredUsers.sort((a:any, b:any) => b.avgRating - a.avgRating);

    res
      .status(STATUS_CODES.OK)
      .json({ message: "freelancers successfully fetched", freelancers :filteredUsers });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


freelanceController.getUsersByServiceAndUsername = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { serviceName, userName } = req.query;

    if (!serviceName || !userName) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Service name and username are required" });
    }

    const regex = new RegExp("^" + userName.toString().trim(), "i");
    const users = await UserModal.find({ username: regex });

    if (users.length === 0) {
      return res
        .status(STATUS_CODES.OK)
        .json({ message: "No users found with the specified username", users: [] });
    }

    const userIds = users.map(user => user._id);
    const freelanceDetails = await FreelanceDetailsModel.find({
      userId: { $in: userIds },
      "services.title": serviceName,
    }).populate("userId");

    // Extract user details from freelanceDetails
    let filteredUsers = freelanceDetails.map(detail => detail.userId);

    // Add review data to each user
    filteredUsers = await Promise.all(filteredUsers.map(async (user:any) => {
      const reviews = await ReviewsModal.find({ freelancerId: user._id });
      const reviewCount = reviews.length;
      const avgRating = reviewCount > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;
      
      return {
        ...user.toObject(),
        reviews: reviewCount,
        avgRating: avgRating
      };
    }));
    filteredUsers.sort((a:any, b:any) => b.avgRating - a.avgRating);
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Users successfully fetched", freelancers: filteredUsers });
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
    const { serviceName, userId, description, basic, standard, premium } =
      req.body;

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

    const userFreelanceDetails = await FreelanceDetailsModel.findOne({
      userId,
    });

    if (userFreelanceDetails) {
      const serviceExists = userFreelanceDetails.services.some(
        (service) => service.title === serviceName
      );

      if (serviceExists) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ error: "Service already exists" });
      }

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



freelanceController.editFreelanceService = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {freelanceId, details} = req.body
    

  if (
    !freelanceId ||
    !details 
   
  ) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: "All fields are required" });
  }

     const updatedService = await FreelanceDetailsModel.findOneAndUpdate(
      { "services._id": freelanceId },
      {
        $set: {
          "services.$.title": details.title,
          "services.$.description": details.description,
          "services.$.plans": details.plans
        }
      },
      { new: true } 
    );

    if (!updatedService) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ error: "Service not found" });
    }

    res.status(STATUS_CODES.OK).json({
      message: "Service updated",
      
    });
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
    const orders = await OrderModel.find({ client: userId })
      .populate("freelancer")
      .populate("workId")
      .populate("reviewId");
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
freelanceController.addWalletAmount = async (req: Request, res: Response): Promise<any> => {
  try {
    const { addAmount, userId } = req.body;

    if (typeof addAmount === 'undefined' || typeof userId === 'undefined') {
      return res.status(400).json({ error: 'addAmount and userId are required' });
    }

    const amountToAdd = parseFloat(addAmount);
    if (isNaN(amountToAdd)) {
      return res.status(400).json({ error: 'addAmount must be a valid number' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Wallet Top-up" },
            unit_amount: amountToAdd * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/wallet/success",
      cancel_url: "http://localhost:3000/wallet/cancel",
      payment_intent_data: {
        metadata: { userId ,method : "wallet"},
      }
    });

    return res.status(200).json({ message: "Payment successfully created", id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

freelanceController.addWalletSuccessfull = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { addAmount, userId } = req.body;
    const user = await UserModal.findById(userId);
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

    let wallet = await WalletModel.findOne({ user: userId });

    if (!wallet) {
      wallet = new WalletModel({
        user: userId,
        balance: 0,
        transactions: [],
      });
    }
    const formattedDate = format(new Date(), "dd MMM yyyy hh:mm a");

    wallet.balance = parseFloat(wallet.balance.toString()) + amountToAdd;

    wallet.transactions.push({
      amount: amountToAdd,
      type: "credit",
      payer: new mongoose.Types.ObjectId(BANK_OBJECT_ID), // Use ObjectId for the bank
      date: formattedDate,
    });

    // Save the wallet
    await wallet.save();

    res.status(STATUS_CODES.OK).json({
      message: "Amount added successfully",
      balance: wallet.balance,
      user,
    });
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
    if (isExist) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Already paid" });
    }
    const newPayment = new PendingPaymentModel({
      orderId,
      clientId,
      freelancerId,
      amount,
    });

    await newPayment.save();
    const order = await OrderModel.findById(orderId);

    const currentTime = new Date();
    const deadlineDate = new Date(
      currentTime.getTime() +
        parseInt(order.plan.deliveryTime) * 24 * 60 * 60 * 1000
    );

    await OrderModel.findByIdAndUpdate(orderId, {
      status: "in progress",
      deadline: deadlineDate,
      remainingRevisions: order.plan.revision,
    });

    let clientWallet = await WalletModel.findOne({
      user: clientId,
    });


    if (!clientWallet) {
      clientWallet = new WalletModel({
        user: clientId,
        balance: 0,
        transactions: [],
      });
    }
    const formattedDate = format(new Date(), "dd MMM yyyy hh:mm a");

    clientWallet.balance = parseFloat(clientWallet.balance.toString()) - amount;

    clientWallet.transactions.push({
      amount: amount,
      type: "debit",
      payer: freelancerId,
      date: formattedDate,
    });

    await clientWallet.save();
    return res.status(STATUS_CODES.OK).json({ message: "Payment successfull" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

//workUncomplete

freelanceController.workUncomplete = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId } = req.body;
    await OrderModel.findByIdAndUpdate(orderId, { status: "uncompleted" });
    const payment = await PendingPaymentModel.findOne({ orderId });
    const amountToAdd = parseFloat(payment.amount);

    let clientWallet = await WalletModel.findOne({
      user: payment.clientId,
    });

    if (!clientWallet) {
      clientWallet = new WalletModel({
        user: payment.clientId,
        balance: 0,
        transactions: [],
      });
    }
    const formattedDate = format(new Date(), "dd MMM yyyy hh:mm a");

    clientWallet.balance =
      parseFloat(clientWallet.balance.toString()) + amountToAdd;

    clientWallet.transactions.push({
      amount: amountToAdd,
      type: "credit",
      payer: payment.clientId,
      date: formattedDate,
    });

    await PendingPaymentModel.findByIdAndDelete(payment._id);
    await clientWallet.save();
    res.status(STATUS_CODES.OK).json({ message: "Work Uploaded successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.uploadFreelanceWork = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId, image } = req.body;
    const isExist = await CompletedWorksModel.find({ orderId });
    // if (isExist) {
    //   return res
    //     .status(STATUS_CODES.BAD_REQUEST)
    //     .json({ message: "Work already uploaded" });
    // }
    const uploadResponse = await cloudinary.uploader.upload(image, {
      resource_type: "auto",
    });
    const newCompletedWork = new CompletedWorksModel({
      orderId,
      image: uploadResponse.url,
    });
    await newCompletedWork.save();
    const work = await CompletedWorksModel.findOne({ orderId });
    await OrderModel.findByIdAndUpdate(orderId, {
      status: "waiting for approval",
      workId: work._id,
    });

    res.status(STATUS_CODES.OK).json({ message: "Work Uploaded successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.approveWork = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId } = req.body;
    await OrderModel.findByIdAndUpdate(orderId, { status: "completed" });
    const payment = await PendingPaymentModel.findOne({ orderId });
    const amountToAdd = parseFloat(payment.amount);

    let freelancerWallet = await WalletModel.findOne({
      user: payment.freelancerId,
    });

    if (!freelancerWallet) {
      freelancerWallet = new WalletModel({
        user: payment.freelancerId,
        balance: 0,
        transactions: [],
      });
    }
    const formattedDate = format(new Date(), "dd MMM yyyy hh:mm a");

    // Update the balance
    freelancerWallet.balance =
      parseFloat(freelancerWallet.balance.toString()) + amountToAdd;

    // Add the transaction
    freelancerWallet.transactions.push({
      amount: amountToAdd,
      type: "credit",
      payer: payment.clientId, // Use ObjectId for the bank
      date: formattedDate,
    });

    await PendingPaymentModel.findByIdAndDelete(payment._id);
    // Save the wallet
    await freelancerWallet.save();
    res.status(STATUS_CODES.OK).json({ message: "Approved successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.addReview = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId, ratedUser, freelancerId, serviceName, review, rating } =
      req.body;
    const isExist = await ReviewsModal.findOne({
      orderId,
      ratedUser,
      freelancerId,
      serviceName,
    });

    if (isExist) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ messge: "Review already exists" });
    }

    const newReview = new ReviewsModal({
      orderId,
      ratedUser,
      freelancerId,
      serviceName,
      review,
      rating,
    });
    await newReview.save();

    const latestReview = await ReviewsModal.findOne({
      orderId,
      ratedUser,
      freelancerId,
      serviceName,
    });
    await OrderModel.findByIdAndUpdate(orderId, { reviewId: latestReview._id });
    res.status(STATUS_CODES.OK).json({ message: "Review added" });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.getReviewList = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { freelancerId, serviceName } = req.query;
    const serviceReviews = await ReviewsModal.find({
      freelancerId,
      serviceName,
    }).populate("ratedUser");
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Reviews fetched successfully", serviceReviews });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.reviseWork = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { orderId, additionalRequirements } = req.body;
    const order = await OrderModel.findById(orderId);
    const currentTime = new Date();
    const deadlineDate = new Date(
      currentTime.getTime() +
        parseInt(order.plan.deliveryTime) * 24 * 60 * 60 * 1000
    );

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        status: "revision",
        $set: { additionalRequirements },
        $inc: { remainingRevisions: -1 },
        deadline: deadlineDate,
      },
      { new: true }
    );
    res.status(STATUS_CODES.OK).json({ message: "Revision sended" });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.editReview = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { reviewId, editRating, editReview } = req.body;
    const updateReview = await ReviewsModal.findByIdAndUpdate(reviewId, {
      review: editReview,
      rating: editRating,
    });
    res.status(STATUS_CODES.OK).json({ message: "Review edited" });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

freelanceController.deleteReview = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { reviewId } = req.query;
    const review = await ReviewsModal.findById(reviewId);
    if (!review) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: "Review not exists" });
    }
    await ReviewsModal.findByIdAndDelete(reviewId);
    res.status(STATUS_CODES.OK).json({ message: "Review deleted" });
  } catch (error) {
    console.error(error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const handleCheckoutSessionCompleted = async (session: any) => {
  const userId = session.metadata.userId;
  const newAmount = parseInt(session.amount)
  const addAmount = newAmount / 100;

  try {
    const user = await UserModal.findById(userId);
    const BANK_OBJECT_ID = "60d5ec49b3b4cd39e4d8a4e5";

    if (!user) {
      throw new Error('User not found');
    }

    let wallet = await WalletModel.findOne({ user: userId });

    if (!wallet) {
      wallet = new WalletModel({
        user: userId,
        balance: 0,
        transactions: [],
      });
    }

    const formattedDate = new Date().toISOString();
    wallet.balance = parseFloat(wallet.balance.toString()) + addAmount;
    wallet.transactions.push({
      amount: addAmount,
      type: "credit",
      payer: new mongoose.Types.ObjectId(BANK_OBJECT_ID),
      date: formattedDate,
    });

    await wallet.save();
  } catch (error: any) {
    console.error(`Failed to handle checkout.session.completed: ${error.message}`);
  }
};
const handleOrderPayment = async (session: any) => {
  try {
    const { orderId, clientId, freelancerId, amount } = session.metadata;
    console.log("MEtta data : ",session.metadata)
    const newPayment = new PendingPaymentModel({ orderId, clientId, freelancerId, amount });
    await newPayment.save();

    const order = await OrderModel.findById(orderId);
    const currentTime = new Date();
    const deadlineDate = new Date(currentTime.getTime() + parseInt(order.plan.deliveryTime) * 24 * 60 * 60 * 1000);

    await OrderModel.findByIdAndUpdate(orderId, {
      status: "in progress",
      deadline: deadlineDate,
      remainingRevisions: order.plan.revision,
    });

  } catch (error: any) {
    console.error(`Failed to handle checkout.session.completed: ${error.message}`);
  }
};

freelanceController.webhook = async (req: Request, res: Response): Promise<any> => {
  try {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET1!;

    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    if (event.type === "payment_intent.succeeded") {
      const session = event.data.object;
      if(session.metadata.method =="wallet"){

        await handleCheckoutSessionCompleted(session);
      }else{
        await handleOrderPayment(session);

      }
    }

    res.status(200).json({ message: "Webhook received successfully" });
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};



freelanceController.servicePaymentByStripe = async (req: Request, res: Response): Promise<any> => {
  try {
    const { orderId, clientId, freelancerId, amount } = req.body;
    if (typeof amount === 'undefined') {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const amountToAdd = parseFloat(amount);
    if (isNaN(amountToAdd)) {
      return res.status(400).json({ error: 'Amount must be a valid number' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Order payment" },
            unit_amount: amountToAdd * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/hiredHistory/success",
      cancel_url: "http://localhost:3000/hiredHistory/cancel",
      payment_intent_data: {
        metadata: { orderId, clientId, freelancerId:freelancerId._id, amount ,method:"order"},
      }
    });

    return res.status(200).json({ message: "Payment successfully created", id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



freelanceController.servicePaymentByStripeWebhook = async (req: Request, res: Response): Promise<any> => {
  try {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET2!;

    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await handleOrderPayment(session);
    }

    res.status(200).json({ message: "Webhook received successfully" });
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
export default freelanceController;

