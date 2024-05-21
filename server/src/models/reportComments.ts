import mongoose, { Schema } from "mongoose";


const reportedCommentSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    postId :{
        type: Schema.Types.ObjectId,
        ref: "Posts",
    },
    commentId :{
        type: Schema.Types.ObjectId,
        ref: "Comments",
    },

    reason:String
})

const ReportedCommentsModal = mongoose.models.ReportedComments ||   mongoose.model("ReportedComments",reportedCommentSchema)
export default ReportedCommentsModal;