  import mongoose, { Schema } from "mongoose";


  // Define the schema for the different plans
  const PlanSchema = new Schema({
    name: { type: String, required: true }, // e.g., Basic, Standard, Premium
    price: { type: Number, required: true },
    deliveryTime: { type: Number, required: true },
    revision :{ type: Number, required: true } // Delivery time in days
  });

  // Define the schema for services
  const ServiceSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    plans: [PlanSchema] // Array of plans
  });
  // Define the schema for freelance details
  const FreelanceDetailsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true }, // Reference to the User model
    services: [ServiceSchema] // Array of services
  });

  // Create the model from the schema
  const FreelanceDetailsModel = mongoose.model('FreelanceDetails', FreelanceDetailsSchema);

  export default FreelanceDetailsModel;
