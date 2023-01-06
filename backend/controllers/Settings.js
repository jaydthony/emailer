import {} from "dotenv/config";
import { each, isEmpty, random } from "underscore";
import { db } from "./helper.js";
import { settingsSchema } from "../models/settings.js";
export class Settings {
  constructor() {
    db();
  }
  async getSettings() {
    return await settingsSchema.find();
  }
  async save(data) {
    let preferences;
    let err = [];
    let exist = await settingsSchema.find();
    if (!isEmpty(exist)) {
      preferences = exist[0];
    }
    each(data, (element, key) => {
      if (isEmpty(data[key]) && key != "useAbstract") {
        err.push(`${key} cannot be empty`);
      }
    });
    if (!isEmpty(err)) {
      return this.response(err.join(","));
    }
    let {
      useAbstract,
      siteName,
      siteUrl,
      emailTemplateUrl,
      serviceProvider,
      smtpPassword,
      smtpUsername,
    } = data;
    if (isEmpty(preferences)) {
      let id = random(8);
      let settings = new settingsSchema({
        id,
        siteUrl,
        siteName,
        useAbstract,
        emailTemplateUrl,
        serviceProvider,
        smtpPassword,
        smtpUsername,
      });
      let isSaved = await settings.save();
      if (isSaved) {
        return this.response("Data saved", true);
      } else {
        return this.response("Unable to update");
      }
    } else {
      let updated = await settingsSchema.findOneAndUpdate(
        { id: preferences.id },
        {
          useAbstract,
          siteName,
          siteUrl,
          emailTemplateUrl,
          serviceProvider,
          smtpPassword,
          smtpUsername,
        }
      );
      if (updated) {
        return this.response("updated");
      } else {
        return this.response("Unable to update");
      }
    }
  }
  response(data, status = false) {
    return { status, data };
  }
}
