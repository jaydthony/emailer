import mongoose from "mongoose";

const cronModelSchema = new mongoose.Schema({
  cronId: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const cronSchema = mongoose.model('subscribers', cronModelSchema);