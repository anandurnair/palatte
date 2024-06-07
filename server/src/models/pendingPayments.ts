import mongoose, { Schema } from "mongoose";

const pendingPaymentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Orders", required: true },
  clientId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  freelancerId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now() },
});

const PendingPaymentModel =
  mongoose.models.PendingPayment ||
  mongoose.model("PendingPayment", pendingPaymentSchema);
export default PendingPaymentModel;
