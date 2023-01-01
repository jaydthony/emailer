import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { isEmpty } from "underscore";
dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
});
export function db() {
  const db_url = process.env.MONGO_DB_URI;
  console.log(db_url);
  if (!isEmpty(db_url)) {
    mongoose.connect(db_url);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
  } else {
    console.log("DB url not set");
  }
}
