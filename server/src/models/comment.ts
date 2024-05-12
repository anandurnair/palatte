import mongoose, { Schema } from "mongoose";


const commentSchema = new Schema({
    postId :{
        type: Schema.Types.ObjectId,
        ref: "Posts",
    },
    userId :{
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    comment :String,
    isBlocked :{
        type : Boolean,
        default : false
    },
    date:Date
})

const CommentModel  = mongoose.models.Comments  || mongoose.model("Comments",commentSchema)
export default CommentModel;