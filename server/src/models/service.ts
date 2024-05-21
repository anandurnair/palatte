import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema({
    serviceName : {
        type : String,
    },
    unlisted : {
        type:Boolean,
        default : false
    }
});

const ServiceModal = mongoose.models.Services || mongoose.model("Services", serviceSchema);

export default ServiceModal;
