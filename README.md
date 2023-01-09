# Newsletter email sender app built using Genezio

### Project overview

This project allows authenticated users to send email messages to a list of subscribers. 

### What you need to get started

- You need a genezio account [create one here](https://genez.io/)
- You need Nodejs and npm installed on your operating system, install node from [here](https://nodejs.org)
- For an optional advanced email validation, this project uses [Abstractapi](https://abstractapi.com)

## Getting started

- Clone this repo, or download the source code to get started
- Check the _env_sample_ and ensure to fill all the fields before running the app
- In the _frontend_ and the backend folder, run _npm install_ to install the dependencies
- Navigate to the backend folder and run _genezio local_ to start
- Copy the http link to the Subscribe Endpoint, and save it for the next section.
- Navigate to the frontend folder and run _npm start_ to initialize the frontend of the app
- You should see a login page.
- Create an account/Login to your existing account. Navigate to the settings page to save the required information necessary for the app to run.
- You need to upload the default.html email template to a storage and save the access link in the settings page. This example uses the AWS S3 bucket to save the template.

## Variables

### Environment variables to be added to the .env file


- MONGO_DB_URI: This app uses the MongoDB atlas for persistent storage. The URI is the url to the database from mongodb
- SERVICE: The name of your smtp provider, refer here for more [details](https://nodemailer.com/smtp/well-known/)

#### Email validation

- ABSTRACT_API_KEY = Api key from abstract [Get started here](https://www.abstractapi.com/api/email-verification-validation-api)

#### JWT

- JWT_SECRET_KEY: Used to sign jwt sent to the browser to validate users

## Embeddable widget

This is an embeddable form that can be deployed on any website.

- In the js-widget folder, run _npm install_ to install all dependencies
- Run _npm build_ to generate the _widget.js_ file. It will be saved in /js-widget/dist/
- You can upload the widget.js file in the to any cdn of your choice.
- To see the embeddable widget in action navigate to the _js-widget/demo/index.html_, *change the url* parameter to the link you copied earlier
  `mw('init', { url: 'CHANGE_TO_YOUR_URL' });`
- Open the index.html to test.
- Before sharing the widget, ensure to change the line _YOUR_CDN_LINK_TO_WIDGET_ to the external url where you've saved the script.
