import html from "./widget.html";
import "./widget.css";

const supportedAPI = ["init", "message"]; // enlist all methods supported by API (e.g. `mw('event', 'user-login');`)

/**
    The main entry of the application
    */
function app(window) {
  // set default configurations
  let configurations = {
    someDefaultConfiguration: false,
  };

  let globalObject = window[window["JS-Widget"]];
  let queue = globalObject.q;
  if (queue) {
    for (var i = 0; i < queue.length; i++) {
      if (queue[i][0].toLowerCase() == "init") {
        configurations = extendObject(configurations, queue[i][1]);
      } else apiHandler(queue[i][0], queue[i][1], configurations);
    }
  }

  // override temporary (until the app loaded) handler
  // for widget's API calls
  globalObject = apiHandler;
  globalObject.configurations = configurations;
  show(configurations);

}
const response = (text) => {
  let form = document.querySelector("#genez-newsletter-form");
  let span = document.createElement("span");
  span.innerHTML = text;
  let err = form.querySelector(".err");
  err.innerHTML = text;
};
function show(config) {
  // append element
  let temporary = document.createElement("div");
  temporary.innerHTML = html;
  let s = document.querySelector('[data-widget="genez"]');
  let parent = s.parentNode;
  parent.insertBefore(temporary, s);
  // add event to form
  let form = document.querySelector("#genez-newsletter-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let input = form.querySelector("#email-input");
    let value = input.value;
    if (value == "") {
      response("Please enter an email address");
    } else {
      if (config.hasOwnProperty("url")) {
        let url = config.url;
        fetch(`${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: value }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (typeof result.data == "object") {
              response("Success");
            } else {
              response(result.data);
            }
          })
          .catch((err) => console.log(err));
      } else {
        response("API endpoint not found");
      }
    }
  });
}
/**
    Method that handles all API calls
    */
function apiHandler(api, params, config) {
  if (!api) throw Error("API method required");
  api = api.toLowerCase();
  console.log('parent');


  if (supportedAPI.indexOf(api) === -1) {
    throw Error(`Method ${api} is not supported`);
  }

  switch (api) {
    // TODO: add API implementation
    case "message":
      break;
    default:
      console.warn(`No handler defined for ${api}`);
  }
}

function extendObject(a, b) {
  for (var key in b) if (b.hasOwnProperty(key)) a[key] = b[key];
  return a;
}

app(window);
