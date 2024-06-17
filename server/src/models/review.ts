import mongoose, { Schema } from "mongoose";


const reviewSchema= new Schema({
    orderId :{
        type: Schema.Types.ObjectId,
        ref: "Orders",
    },
    ratedUser:{
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    freelancerId :{
        type: Schema.Types.ObjectId,    
        ref: "Users",
    },
    serviceName:String,
    review : String,
    rating : Number,
    createdAt : {
        type :Date,
        default : Date.now()
    }
})

const ReviewsModal = mongoose.models.Reviews ||   mongoose.model("Reviews",reviewSchema)
export default ReviewsModal;