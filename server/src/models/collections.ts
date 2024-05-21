import mongoose, { Schema } from "mongoose";

const CollectionSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Posts" }],
  isDefault: { type: Boolean, default: false }
});

const CollectionModel = mongoose.models.Collections || mongoose.model("Collections", CollectionSchema);

export default CollectionModel;