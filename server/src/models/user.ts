import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  fullname: String,
  username: String,
  email: String,
  password: String,
  phone: Number,
  country: String,
  freelance: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const UserModal = mongoose.models.Users || mongoose.model("Users", userSchema);

export default UserModal;
