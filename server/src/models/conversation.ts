import mongoose, { Schema } from "mongoose";


const conversationSchema = new Schema({
    members :{
        type: Array,
      
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
    
    
 },
)

const conversationModal  = mongoose.model("Conversation",conversationSchema)
export default conversationModal  ;
;