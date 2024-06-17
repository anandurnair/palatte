import mongoose, { Schema } from "mongoose";

const callSchema = new Schema({
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  callAt: {
    type: Date,
    default: Date.now(),
  },
});

const CallsModel = mongoose.models.Calls || mongoose.model("Calls", callSchema);
export default CallsModel;
