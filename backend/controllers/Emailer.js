import {} from "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
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
    let {
      emailTemplateUrl,
      serviceProvider,
      smtpPassword,
      smtpUsername,
      siteUrl,
      siteName,
    } = resp[0];
    this.SMTP_PASSWORD = smtpPassword;
    this.SMTP_USERNAME = smtpUsername;
    this.emailTemplateUrl = emailTemplateUrl;
    this.SERVICE = serviceProvider;
    this.sitename = siteName;
    this.unsubscribelink = siteUrl;
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
    /**
     * Get template
     */
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

        let list = await this.getSubscribers();
        let promises = [];
        let template = await this.getTemplate();
        list.forEach((email) => {
          const replacements = {
            subject: subject,
            preview: subject,
            body: message,
            sitename: this.sitename,
            unsubscribelink: `${this.unsubscribelink}/unsubscribe/email=${email}`,
          };
          let htmltosend = this.parseHtml(replacements, template);
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
  parseHtml(replacements, source) {
    const handler = handlebars.compile(source);
    return handler(replacements);
  }
}
(async () => {
  let email = new Emailer();
  email.send("95ebf37a023d8ab1");
})();
