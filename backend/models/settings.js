import mongoose from "mongoose";

const settingsModelSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  siteName: {
    type: String,
    required: true,
  },
  siteUrl: {
    type: String,
    required: true,
  },
  smtpUsername: {
    type: String,
    required: true,
  },
  smtpPassword: {
    type: String,
    required: true,
  },
  serviceProvider: {
    type: String,
    required: true,
  },
  emailTemplateUrl: {
    type: String,
    required: true,
  },
  useAbstract: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const settingsSchema = mongoose.model("settings", settingsModelSchema);
