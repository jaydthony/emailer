import {} from "dotenv/config";
import mongoose from "mongoose";
import _ from "underscore";
import { db } from "./helper.js";
import { emailSchema } from "../models/email.js";
import moment from "moment";
import { Emailer } from "./Emailer.js";

export class Cron {
  constructor() {
    db();
  }
  async checkSchedule() {
    let all = await emailSchema.find({ status: "schedule" });
    let emailer = new Emailer();
    all.forEach((elem) => {
      let currentTime = moment();
      let scheduledTime = moment(elem.schedule);
      let diff = currentTime.diff(scheduledTime, "seconds");
      if (diff < 20) {
        emailer.send(elem.mailId);
        console.log("sent");
      }
    });
  }
}