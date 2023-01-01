import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
});
import fs from "fs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import _, { each, isEmpty, isObject } from "underscore";
import handlebars from "handlebars";
import { subscriberSchema } from "../models/subscriber.js";
import { emailSchema } from "../models/email.js";
import { db } from "./helper.js";
/**
 * Emailer class
 */
export class Emailer {
  constructor() {
    db();
    const __filename = fileURLToPath(import.meta.url);
    this.dirname = path.dirname(__filename);
    this.unsubscribelink = process.env.UNSUBSCRIBE_URL;
    this.sitename = process.env.SITE_NAME;
    this.SMTP_USERNAME = process.env.SMTP_USERNAME;
    this.SERVICE = process.env.SERVICE;
    this.SMTP_PASSWORD = process.env.SMTP_PASSWORD;
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
   * - objects holds subject, message, sender
   * @returns
   */
  async process(data) {
    let { subject, sender, body, schedule, status } = data;

    each(data, function (elem) {
      if (isEmpty(data.elem)) {
        return `${data.elem} cannot be empty`;
      }
    });
    /**
     * Save data first
     */
    let saved = await this.save({ subject, sender, body, status, schedule });
    if (status == "immediate") {
      if (isObject(saved) && "_id" in saved) {
        let sent = await this.send(saved.mailId);
        return await this.getOne(saved.mailId);
      } else {
        return { error: "Unable to save email" };
      }
    } else {
      return saved;
    }
  }
  async save(data) {
    let mailId = await this.generateId();
    const { subject, sender, body, status, schedule } = data;
    let savedata = {
      mailId,
      subject: subject,
      sender,
      status,
      message: body,
      schedule,
    };
    let mail = new emailSchema(savedata);
    return await mail.save();
  }
  async getAll() {
    return await emailSchema.find();
  }
  async getOne(mailId) {
    return await emailSchema.findOne({ mailId });
  }
  async update(mailId, data) {
    let updated = await emailSchema.findOneAndUpdate({ mailId }, data, {
      new: true,
    });
    if (updated) {
      return this.process(updated);
    } else {
      return updated;
    }
  }
  /**
   * Accepts- (string) sender, receiver, subject, html
   */
  async send(mailId) {
    // get email id and send
    let email = await this.getOne(mailId);
    if (!isEmpty(email)) {
      const { subject, message, sender } = email;
      // let saved = await this.save(savedata);
      try {
        let transporter = nodemailer.createTransport({
          service: this.SERVICE,
          auth: {
            user: this.SMTP_USERNAME,
            pass: this.SMTP_PASSWORD,
          },
          pool: true,
        });
        /**
         * Handle html teplating
         * Replacement variables include: subject, preview,logourl,heading,body,sitename,unsubscribelink,supportlink,supportemail
         */
        const replacements = {
          subject: subject,
          preview: subject,
          body: message,
          sitename: this.sitename,
          unsubscribelink: this.unsubscribelink,
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
                    resolve(response);
                  }
                }
              );
            })
          );
        });

        return await Promise.all(promises)
          .then(async (result) => {
            // update email status to sent
            transporter.close();
            let sent = await this.update(mailId, { status: "sent" });
            return result;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
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
