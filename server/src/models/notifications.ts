import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
    toUser: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },    
  text: {   
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const NotificationModel = mongoose.models.Notifications || mongoose.model('Notifications', notificationSchema);
export default NotificationModel;
