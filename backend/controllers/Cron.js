import {
  JWT_SECRET_KEY,
  MONGO_DB_URI,
  ABSTRACT_API_KEY,
  SMTP_PASSWORD,
  SMTP_USERNAME,
} from "./env.js";
import crypto from "crypto";
import _ from "underscore";
import { cronSchema } from "../models/cron.js";
import nodeCron from "node-cron";
import { db } from "./helper.js";

export class Cron {
  constructor() {
    db(MONGO_DB_URI);
    // mongoose.connect(process.env.MONGO_DB_URI);
    // const db = mongoose.connection;
    // db.on("error", console.error.bind(console, "MongoDB connection error:"));
    // console.log("cron");
  }
  checkSchedule() {
    console.log("This funtions is running");
    // check if within the last 15mins
  }
  async schedule(data) {
    // let { time, emailId } = data;
    // let cronId = await this.generateId();
    // let emailCron = new cronSchema({ cronId, time, emailId });
    // let save = await emailCron.save();
    nodeCron.schedule("* 0/2 * * * *", () => {
      console.log("hey");
    });
  }
  async generateId() {
    let id = crypto.randomBytes(8).toString("hex");
    let exist = await cronSchema.find({ cronId: id }).exec();
    while (!_.isEmpty(exist)) {
      id = crypto.randomBytes(8).toString("hex");
    }
    return id;
  }
}
(async () => {
  // let d = new Cron();
  // d.schedule({ hey: "hey" });
})();
