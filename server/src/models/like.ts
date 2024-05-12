import mongoose, { Schema } from "mongoose";


const likeSchema = new Schema({
    postId :{
        type: Schema.Types.ObjectId,
        ref: "Posts",
    },
    userId :{
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    comment :String,
    isBlocked :Boolean
})

const LikeModal  = mongoose.models.Likes || mongoose.model("Likes",likeSchema)
export default LikeModal;