import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Posts",
    required: true,
  },
  userId: { 
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
   
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: "Comments",
    default: null,
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: "Comments",
  }],
});

const CommentModel = mongoose.models.Comments || mongoose.model("Comments", commentSchema);
export default CommentModel;
