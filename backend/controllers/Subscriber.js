import {JWT_SECRET_KEY,MONGO_DB_URI,ABSTRACT_API_KEY,SMTP_PASSWORD,SMTP_USERNAME} from "./env.js"
import mongoose from "mongoose"
import {subscriberSchema} from "./../models/subscriber.js"
import validator from "deep-email-validator"
import _ from "underscore";
import axios from "axios"


export class Subscriber {
  constructor() {
    mongoose.connect(MONGO_DB_URI);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    this.ABSTRACT_API_KEY = ABSTRACT_API_KEY;
    this.simpleValidation = false;
  }
  async validate(address) {
    if (this.simpleValidation) {
      return validator.is_email_valid(address);
    } else {
      const valid = await axios
        .get(
          "https://emailvalidation.abstractapi.com/v1/?api_key=" +
            this.ABSTRACT_API_KEY +
            "&email=" +
            address
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
  async addSubscription(address) {
    /**
     * Validate email address
     */
    let valid = await this.validate(address);
    if (valid == true) {
      let data = {
        email: address,
        pauseSubscription: false,
        confirmed: false,
      };
      let exist = await subscriberSchema.findOne({ email: address });
      if (_.isEmpty(exist)) {
        this.subscriber = new subscriberSchema(data);
        let savedData = await this.subscriber.save();
        if (savedData._id !== undefined) {
          return { savedData };
        } else {
          return { error: "unable_to_save_email" };
        }
      } else {
        return { error: "email_exists" };
      }
    } else {
      return { error: "invalid_email" };
    }
  }
  async confirmSubscription(address) {
    return await subscriberSchema.findOneAndUpdate(
      { email: address },
      { confirmed: true },
      { new: true }
    );
  }
  async unsubscribe(address) {
    return await subscriberSchema.findOneAndDelete({ email: address });
  }
  async getSubscribers() {
    return await subscriberSchema.find();
  }
}
