import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
  conversationId: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  status :{
    type : String,
    enum : ["seen","delivered"],
    default : "delivered"
  }
});

const MessageModel = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default MessageModel;
