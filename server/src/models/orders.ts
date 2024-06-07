import mongoose, { Schema } from "mongoose";

// Define the Plan schema
const PlanSchema = new Schema({
  name: { type: String, required: true }, 
  price: { type: Number, required: true },
  deliveryTime: { type: Number, required: true },
  revision: { type: Number, required: true } 
});

// Define the Order schema
const orderSchema = new Schema({
  freelancer: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  serviceName : String,
  requirements: {
    type: String,
    required: true
  },
  plan: {
    type: PlanSchema,
    required: true
  },
  status: {
    type: String,
    enum: ["pending" , "accepted", "in progress", "completed", "cancelled","rejected"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deadline :{
    type:Date
  }
});

// Create the Order model
const OrderModel = mongoose.models.Orders || mongoose.model("Orders", orderSchema);

export default OrderModel;
