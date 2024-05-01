import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  profileImg : String,
  fullname: String,
  username: String,
  email: String,
  password: String,
  bio:String,
  phone: Number,
  country: String,
  freelance: {
    type: Boolean,
    default: false,
  },
  status:{
    type: String,
    enum: ["active", "blocked"],
    default: "active"
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const UserModal = mongoose.models.Users || mongoose.model("Users", userSchema);

export default UserModal;
