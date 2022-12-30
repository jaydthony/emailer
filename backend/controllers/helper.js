import mongoose from "mongoose";

export function db(url) {
  mongoose.connect(url);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
}
