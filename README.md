
# Newsletter email sender app built using Genezio
### Project overview
This project allows authenticated users to send email messages to a list of subscribers.
### What you need to get started
- You need a genezio account [create one here](https://genez.io/)
- You need Nodejs and npm installed on your operating system, install node from [here](https://nodejs.org)
- For an optional advanced email validation, this project uses [Abstractapi](https://abstractapi.com)
## Getting started
- Clone this repo, or download the source code to get started
- Check the *env_sample* and ensure to fill all the fields before running the app
- In the *frontend* and the backend folder, run *npm install* to install the dependencies
- Navigate to the backend folder and run *genezio local* to start
- Copy the http link to the unsubscribe endpoint, and save it for the next section.
- Navigate to the frontend folder and run *npm start* to initialize the frontend of the app
- You should see a login page.

## Embeddable widget

This is an embeddable form that can be deployed on any website.

- In the js-widget folder, run *npm install* to install all dependencies
- Run *npm build* to generate the *widget.js* file. It will be saved in /js-widget/dist/
- You can upload the widget.js file in the  to any cdn of your choice.
- To see the embeddable widget in action navigate to the *js-widget/demo/index.html*, change the url (http://127.0.0.1:8083/Subscriber/addSubscription) parameter to the link you copied earlier
 `mw('init', { url: 'http://127.0.0.1:8083/Subscriber/addSubscription' });`
- Open the index.html to test.
- Before sharing the widget, endure to change the line */dist/widget.js* to the link of your cdn
