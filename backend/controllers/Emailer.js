import {
  JWT_SECRET_KEY,
  MONGO_DB_URI,
  ABSTRACT_API_KEY,
  SMTP_PASSWORD,
  SMTP_USERNAME,
} from "./env.js";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import _ from "underscore";
import handlebars from "handlebars";
import { subscriberSchema } from "../models/subscriber.js";
import { emailSchema } from "../models/email.js";
import { fileURLToPath } from "url";
import { db } from "./helper.js";
/**
 * Emailer class
 */
export class Emailer {
  constructor() {
    db(MONGO_DB_URI);
    const __filename = fileURLToPath(import.meta.url);
    this.dirname = path.dirname(__filename);
    // mongoose.connect(MONGO_DB_URI);
    // const db = mongoose.connection;
    // db.on("error", console.error.bind(console, "MongoDB connection error:"));
  }

  async getSubscribers() {
    let all_subscribers = await subscriberSchema.find().select("email");
    let arr = [];
    all_subscribers.forEach((obj) => {
      if (!_.contains(arr, obj.email)) {
        arr.push(obj.email);
      }
    });
    return arr;
  }
  /**
   *
   * @param {Object} data
   * - objects holds title, message, sender
   * @returns
   */
  async save(data) {
    data.mailId = await this.generateId();
    let mail = new emailSchema(data);
    return await mail.save();
  }
  async getAll() {
    return await emailSchema.find();
  }
  async getOne(id) {
    return await emailSchema.find({ mailId: id });
  }
  /**
   * Accepts- (string) sender, receiver, subject, html
   */
  async send(data) {
    const { subject, sender, body, sitename, unsubscribelink } = data;
    /**
     * Save data first
     */
    let savedata = {
      title: subject,
      sender,
      message: body,
    };
    let saved = await this.save(savedata);
    try {
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: SMTP_USERNAME,
          pass: SMTP_PASSWORD,
        },
        pool: true,
      });
      /**
       * Handle html teplating
       * Replacement variables include: title, preview,logourl,heading,body,sitename,unsubscribelink,supportlink,supportemail
       */
      const replacements = {
        title: subject,
        preview: subject,
        body,
        sitename,
        unsubscribelink,
      };
      let htmltosend = this.parseHtml(replacements);
      let list = await this.getSubscribers();
      let promises = [];
      list.forEach((email) => {
        promises.push(
          new Promise((resolve, reject) => {
            transporter.sendMail(
              {
                from: sender, // sender address
                to: email, // list of receivers
                subject: subject, // Subject line
                html: htmltosend, // html body
              },
              (err, response) => {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  // console.log("success", JSON.stringify(response));
                  resolve(response);
                }
              }
            );
          })
        );
      });

      return await Promise.all(promises)
        .then((result) => {
          transporter.close();
          return result
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  async getCount() {
    let all_subscribers = await subscriberSchema.find();
    let all_msg = await emailSchema.find();
    return { messages: all_msg.length, subscribers: all_subscribers.length };
  }
  /**
   *
   * @returns String: user id
   */
  async generateId() {
    let id = crypto.randomBytes(8).toString("hex");
    let exist = await emailSchema.find({ mailId: id }).exec();
    while (!_.isEmpty(exist)) {
      id = crypto.randomBytes(8).toString("hex");
    }
    return id;
  }
  /**
   *
   * @param {Object} replacements
   * @param {String} template
   * @returns String
   */
  parseHtml(replacements, template = "default") {
    const filePath = path.join(this.dirname, `../${template}.html`);
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const handler = handlebars.compile(source);
    return handler(replacements);
  }
}
// new Emailer();

/**
 * @ Send email
 * Accepts: title, body
 */
// (async () => {
//   let email = new Emailer();
//   let info = {
//     subject: "Welcome to 2023 New Year",
//     sender: "mark@gmail.com",
//     body: "A beautiful year ahead of us",
//     sitename: "Emailer",
//     unsubscribelink: "https://sitebaseurl.com/unsubscribe",
//   };

//   console.log(await email.send(info));
// })();
