import {} from "dotenv/config";
import mongoose from "mongoose";
import { isEmpty } from "underscore";


export function db() {
  const db_url = process.env.MONGO_DB_URI;
  if (!isEmpty(db_url)) {
    mongoose.connect(db_url);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
  } else {
    console.log("DB url not set");
  }
}
