import {} from "dotenv/config";
import { usersSchema } from "../models/user.js";
import _ from "underscore";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { encode as htmlentities } from "html-entities";
import jwt from "jsonwebtoken";
import { db } from "./helper.js";

export class User {
  constructor() {
    db();
    this.secret = process.env.JWT_SECRET_KEY;
  }
  /** Returns the user object
   * @param {string} value: email address
   * @param {string} value: first name
   * @param {string} value: last name
   * @param {string} value: password
   * @returns: {object}
   */
  async create(data) {
    let { firstName, lastName, email, password } = data;
    firstName = htmlentities(firstName);
    lastName = htmlentities(lastName);
    let testEmail = this.testEmail(email);
    email = testEmail.email;

    if (_.isEmpty(firstName) || _.isEmpty(lastName)) {
      return this.response("The fields cannot be empty");
    }
    if (!testEmail.status) {
      return this.response(testEmail.error);
    }

    let password_check = this.checkPasswordValidity(password);
    if (_.isEmpty(password_check)) {
      let email_exist = await usersSchema.findOne({ email });
      if (_.isEmpty(email_exist)) {
        // generate userId
        let userId = await this.generateId();
        //encrypt the password
        password = await bcrypt.hash(data.password, 10);
        let dbData = {
          userId,
          firstName,
          lastName,
          email,
          password,
        };
        let userObj = new usersSchema(dbData);
        let uu = await userObj.save();
        if ("userId" in uu) {
          let { firstName, lastName, email } = uu;
          return this.createToken({ firstName, lastName, email });
        } else {
          return this.response("Unable to create user");
        }
      } else {
        return this.response("user_exists");
      }
    } else {
      return this.response(password_check);
    }
  }

  /**
   *
   * @param {String} password
   * @returns Array||Null
   */

  async login(data) {
    let { email, password } = data;
    const emailCheck = this.testEmail(email);
    const passwordCheck = this.testPassword(password);
    email = emailCheck.email;
    password = passwordCheck.password;
    if (!emailCheck.status) {
      return this.response(emailCheck.error);
    }
    if (!passwordCheck.status) {
      return this.response(passwordCheck.error);
    }
    let user = await usersSchema.findOne({ email: email });

    if (!_.isEmpty(user)) {
      if ("password" in user) {
        if (await bcrypt.compare(password, user.password)) {
          let { firstName, lastName, email } = user;
          return this.createToken({ firstName, lastName, email });
        } else {
          return this.response("Incorrect password");
        }
      } else {
        return this.response("No password exists");
      }
    } else {
      return this.response("User does not exist");
    }
    // console.log(user);
  }
  checkPasswordValidity(password) {
    const errors = [];

    if (/\s/.test(password)) {
      errors.push("Password must not contain whitespaces.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must have at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must have at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must have at least one digit.");
    }
    if (password.length < 8 || password.length > 30) {
      errors.push("Password must be 8-30 characters long.");
    }
    return errors.length > 0 ? errors : null;
  }
  async generateId() {
    let id = crypto.randomBytes(8).toString("hex");
    let exist = await usersSchema.find({ userId: id }).exec();
    while (!_.isEmpty(exist)) {
      id = crypto.randomBytes(8).toString("hex");
    }
    return id;
  }
  testUsername(text) {
    // Use regular expressions to check if the username and password meet the required criteria
    var usernameRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    // Use htmlentities to parse the username and password
    text = htmlentities(text);
    // Check if the username is empty
    if (_.isEmpty(text)) {
      return { status: false, error: "empty text", text };
    }
    // Check if the username is a valid email address
    if (!usernameRegex.test(text)) {
      return { status: false, error: "Invalid text", text };
    }
    // Check if the username or password contains any MySQL injection vulnerabilities
    if (text.indexOf("'") !== -1) {
      return {
        status: false,
        error: "The text contains invalid characters",
        text,
      };
    }
    // If the text pass all checks, return a status message
    return { status: true, error: null, text };
  }

  testEmail(email) {
    var emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    email = htmlentities(email);
    if (_.isEmpty(email)) {
      return { status: false, error: "Empty values", email };
    }
    // Check if the email is a valid email address
    if (!emailRegex.test(email)) {
      return { status: false, error: "Invalid email address", email };
    }
    // Check if the email or password contains any MySQL injection vulnerabilities
    if (email.indexOf("'") !== -1) {
      return {
        status: false,
        error: "Possible MySQL injection vulnerability detected",
        email,
      };
    }
    return { status: true, error: null, email };
  }
  testPassword(password) {
    // Use htmlentities to parse the email and password
    password = htmlentities(password);

    // Check if the password meets the required criteria (at least 8 characters, including at least one letter and one number)
    if (this.checkPasswordValidity(password) !== null) {
      return { status: false, error: "Invalid password", password };
    }

    // Check if the email or password contains any MySQL injection vulnerabilities
    if (password.indexOf("'") !== -1) {
      return {
        status: false,
        error: "Possible MySQL injection vulnerability detected",
        password,
      };
    }

    // If the email and password pass all checks, return a status message
    return { status: true, error: null, password };
  }
  /**
   *
   * @param {*} data
   * @param {Boolean} status
   * @returns
   */
  response(data, status = false) {
    return { status, data };
  }
  createToken(data) {
    return {
      status: true,
      data,
      jwt: jwt.sign(
        {
          data,
        },
        this.secret,
        { expiresIn: "24h" }
      ),
    };
  }
  verify(key) {
    return jwt.verify(key, this.secret, function (err, decoded) {
      if (err) return err;
      return decoded;
    });
  }
}
