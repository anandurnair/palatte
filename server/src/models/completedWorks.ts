import mongoose, { Schema } from "mongoose";

const completedWorksSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Orders",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  compeltedDate :{
    type : Date,
    default : Date.now()
  }
});

const CompletedWorksModel =
  mongoose.models.CompletedWorks ||
  mongoose.model("CompletedWorks", completedWorksSchema);
export default CompletedWorksModel;
