import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  profileImg: String,
  fullname: String,
  username: String,
  email: String,
  password: String,
  bio: String,
  phone: Number,
  country: String,
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  freelance: {
    type: Boolean,
    default: false,
  },
  services: [
    {
      type: Schema.Types.ObjectId,
      ref: "Services",
    },
  ],
  savedCollections: [{ type: Schema.Types.ObjectId, ref: 'Collections' }],
  allCollection: { type: Schema.Types.ObjectId, ref: 'Collections' },
  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const UserModel = mongoose.models.Users || mongoose.model("Users", userSchema);

export default UserModel;
