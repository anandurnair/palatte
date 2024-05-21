import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  caption: String,
 
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  images: [String] ,
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  uploadedDate: String,
  unListed: {
    type:Boolean,
    default:false
  },
});


const PostModel = mongoose.models.Posts ||   mongoose.model("Posts",postSchema)
export default PostModel;