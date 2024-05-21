import mongoose, { Schema } from "mongoose";


const reportedPostsSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    postId :{
        type: Schema.Types.ObjectId,
        ref: "Posts",
    },
    reason:String
})

const ReportedPostsModal = mongoose.models.ReportedPosts ||   mongoose.model("ReportedPosts",reportedPostsSchema)
export default ReportedPostsModal;