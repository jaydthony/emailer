import mongoose from "mongoose";

const emailModelSchema = new mongoose.Schema({
  mailId: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  schedule: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const emailSchema = mongoose.model("messages", emailModelSchema);
