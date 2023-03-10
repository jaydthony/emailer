import {} from "dotenv/config";
import crypto from "crypto";
import nodemailer from "nodemailer";
import _, { each, isEmpty, isObject } from "underscore";
import handlebars from "handlebars";
import { subscriberSchema } from "../models/subscriber.js";
import { emailSchema } from "../models/email.js";
import { db } from "./helper.js";
import axios from "axios";
import { settingsSchema } from "../models/settings.js";
/**
 * Emailer class
 */
export class Emailer {
  SMTP_PASSWORD;
  SMTP_USERNAME;
  emailTemplateUrl;
  constructor() {
    db();
    this.init();
  }
  async init() {
    let resp = await settingsSchema.find();
    if (isEmpty(resp)) {
      return { error: "No settings found" };
    }
    let info = resp[0];
    this.SMTP_PASSWORD = info.smtpPassword;
    this.SMTP_USERNAME = info.smtpUsername;
    this.emailTemplateUrl = info.emailTemplateUrl;
    this.SERVICE = info.serviceProvider;
    this.sitename = info.siteName;
    this.unsubscribelink = info.siteUrl;
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
   * - objects holds subject, body, sender
   * @returns
   */
  async process(data, skipSave = false) {
    let saved;
    let { subject, sender, body, schedule, status } = data;
    /**
     * Save data first
     */
    if (skipSave == false) {
      saved = await this.save({
        subject,
        sender,
        body,
        status,
        schedule,
      });
    } else {
      saved = data;
    }

    if (status !== "immediate") {
      return saved;
    }
    if (status === "immediate") {
      if (isObject(saved) && "_id" in saved) {
        await this.send(saved.mailId);
        return await this.getOne(saved.mailId);
      } else {
        return { error: "Unable to save email" };
      }
    }
  }
  async save(data) {
    let mailId = await this.generateId();
    const { subject, sender, body, status, schedule } = data;
    let savedata = {
      mailId,
      subject,
      sender,
      status,
      body,
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
      return this.process(updated, true);
    } else {
      return updated;
    }
  }
  /**
   * Accepts- (string) sender, receiver, subject, html
   */
  async send(mailId) {
    // get email id and send
    if (
      isEmpty(this.SERVICE) ||
      isEmpty(this.SMTP_PASSWORD) ||
      isEmpty(this.SMTP_USERNAME) ||
      isEmpty(this.emailTemplateUrl)
    ) {
      await this.init();
    }
    let email = await this.getOne(mailId);
    if (!isEmpty(email)) {
      const { subject, body, sender } = email;
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

        let list = await this.getSubscribers();
        let template = await this.getTemplate();
        //loop over subscribers
        list.forEach((email) => {
          const replacements = {
            subject,
            preview: subject,
            body,
            sitename: this.sitename,
            unsubscribelink: `${this.unsubscribelink}/unsubscribe?email=${email}`,
          };
          let htmltosend = this.parseHtml(replacements, template);

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
        });
        // transporter.close();
        return await this.update(mailId, { status: "sent" });
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
   * Grabs email template from external endpoint
   */
  async getTemplate() {
    return await axios
      .get(this.emailTemplateUrl)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  /**
   *
   * @param {Object} replacements
   * @param {String} template
   * @returns String
   */
  parseHtml(replacements, source) {
    const handler = handlebars.compile(source);
    return handler(replacements);
  }
}
