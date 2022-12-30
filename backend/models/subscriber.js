import mongoose from "mongoose";

const subscriberModelSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  pauseSubscription: {
    type: Boolean,
    required: true,
  },
  confirmed: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const subscriberSchema = mongoose.model('subscribers', subscriberModelSchema);