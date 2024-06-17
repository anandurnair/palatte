import mongoose, { Schema } from "mongoose";

// Define the Plan schema
const PlanSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  deliveryTime: { type: Number, required: true },
  revision: { type: Number, required: true },
});

// Define the Order schema
const orderSchema = new Schema({
  freelancer: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  serviceName: String,
  requirements: {
    type: String,
    required: true,
  },
  additionalRequirements: String,
  plan: {
    type: PlanSchema,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "in progress",
      "waiting for approval",
      "completed",
      "cancelled",
      "rejected",
      "revision",
      "uncompleted"
    ],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
  },
  workId: {
    type: Schema.Types.ObjectId,
    ref: "CompletedWorks",
  },
  reviewId: {
    type: Schema.Types.ObjectId,
    ref: "Reviews",
  },
  remainingRevisions: Number,
});

// Create the Order model
const OrderModel =
  mongoose.models.Orders || mongoose.model("Orders", orderSchema);

export default OrderModel;
