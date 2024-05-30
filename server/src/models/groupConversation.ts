import mongoose, { Schema } from "mongoose";


const groupConversationSchema = new Schema({
    groupName: {
        type: String,
        required: true,
      },
      members: {
        type: [String],
        required: true,
      },
      admin: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      groupImage: {
        type: String,
      },
      createdAt : {
        type : Date,
        default : Date.now()
    }
    
 },
)

const GroupConversationModal  = mongoose.model("GroupConversation",groupConversationSchema)
export default GroupConversationModal  ;
;