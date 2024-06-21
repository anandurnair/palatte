"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
// Define the Plan schema
var PlanSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    deliveryTime: { type: Number, required: true },
    revision: { type: Number, required: true },
});
// Define the Order schema
var orderSchema = new mongoose_1.Schema({
    freelancer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    client: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "CompletedWorks",
    },
    reviewId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Reviews",
    },
    remainingRevisions: Number,
});
// Create the Order model
var OrderModel = mongoose_1.default.models.Orders || mongoose_1.default.model("Orders", orderSchema);
exports.default = OrderModel;
//# sourceMappingURL=orders.js.map