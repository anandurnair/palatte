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
// Define the schema for the different plans
var PlanSchema = new mongoose_1.Schema({
    name: { type: String, required: true }, // e.g., Basic, Standard, Premium
    price: { type: Number, required: true },
    deliveryTime: { type: Number, required: true },
    revision: { type: Number, required: true } // Delivery time in days
});
// Define the schema for services
var ServiceSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    plans: [PlanSchema] // Array of plans
});
// Define the schema for freelance details
var FreelanceDetailsSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Users', required: true }, // Reference to the User model
    services: [ServiceSchema] // Array of services
});
// Create the model from the schema
var FreelanceDetailsModel = mongoose_1.default.model('FreelanceDetails', FreelanceDetailsSchema);
exports.default = FreelanceDetailsModel;
//# sourceMappingURL=freelanceDetails.js.map