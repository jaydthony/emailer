import {} from "dotenv/config";
import { subscriberSchema } from "./../models/subscriber.js";
import validator from "deep-email-validator";
import _, { isEmpty } from "underscore";
import axios from "axios";
import { db } from "./helper.js";
import { settingsSchema } from "../models/settings.js";

export class Subscriber {
  constructor() {
    db();
    this.ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;
    this.simpleValidation = false;
  }
  async validate(email) {
    let settings = await settingsSchema.find();
    if (
      !isEmpty(settings) &&
      settings[0] !== undefined &&
      "useAbstract" in settings[0]
    ) {
      this.simpleValidation = settings[0]["useAbstract"];
    }
    if (this.simpleValidation == true) {
      return validator.is_email_valid(email);
    } else {
      const valid = await axios
        .get(
          "https://emailvalidation.abstractapi.com/v1/?api_key=" +
            this.ABSTRACT_API_KEY +
            "&email=" +
            email
        )
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
      /**
       * response: Boolean
       */
      if (valid.is_smtp_valid.value && valid.is_valid_format.value) {
        return true;
      } else {
        return false;
      }
    }
  }

  async addSubscription(req) {
    /**
     * Validate email
     */
    let email = this.getParam(req, "email");
    if (isEmpty(email)) {
      return this.httpResponse("Email not found");
    }
    let valid = await this.validate(email);
    if (valid == true) {
      let data = {
        email: email,
        pauseSubscription: false,
        confirmed: false,
      };
      let exist = await subscriberSchema.findOne({ email });
      if (_.isEmpty(exist)) {
        this.subscriber = new subscriberSchema(data);
        let savedData = await this.subscriber.save();
        if (savedData._id !== undefined) {
          return this.httpResponse(savedData);
        } else {
          return this.httpResponse("Unable to save email");
        }
      } else {
        return this.httpResponse("Email exists");
      }
    } else {
      return this.httpResponse("Invalid email");
    }
  }

  async unsubscribe(email) {
    return await subscriberSchema.findOneAndDelete({ email });
  }
  async getSubscribers() {
    return await subscriberSchema.find();
  }
  httpResponse(body) {
    return {
      body: JSON.stringify({ data: body }),
      bodyEncoding: "text",
      headers: { contentType: "application/json" },
      statusCode: "201",
      statusDescription: "Ok",
    };
  }
  getParam(req, elem) {
    let body = JSON.parse(req.body);
    if (body[elem] !== undefined) {
      return body[elem];
    } else {
      return null;
    }
  }
}
