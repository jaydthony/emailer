import html from "./widget.html";
import "./cleanslate.css";
import "./widget.css";
class Btn {
  constructor(btn) {
    this.meta = "loading";
    this.btn = btn;
    console.log(this.btn);
  }
  useLoader() {
    this.btn.classList.add(this.meta);
  }
  removeLoader() {
    if (this.btn.classList.contains(this.meta)) {
      this.btn.classList.remove(this.meta);
    }
  }
}
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
      }
    }
  }

  // override temporary (until the app loaded) handler
  // for widget's API calls
  globalObject.configurations = configurations;
  show(configurations);
}
const response = (text, btn = null) => {
  let form = document.querySelector("#genez-newsletter-form");
  let span = document.createElement("span");
  span.innerHTML = text;
  let err = form.querySelector(".err");
  err.innerHTML = text;
  if (btn !== null) btn.removeLoader();
};
function show(config) {
  // append element
  window.addEventListener("load", () => {
    let temporary = document.createElement("div");
    temporary.innerHTML = html;
    let s = document.querySelector('[data-widget="genez"]');
    let parent = s.parentNode;
    parent.insertBefore(temporary, s);
    // add event to form
    let form = document.querySelector("#genez-newsletter-form");
    let btn = new Btn(form.querySelector("button"));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      btn.useLoader();
      let input = form.querySelector("#email-input");
      let value = input.value;
      if (value == "") {
        response("Please enter an email address");
        btn.removeLoader();
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
                response("Successfully Subscribed");
              } else {
                response(result.data);
              }
            })
            .then((d) => {
              btn.removeLoader();
            })
            .catch((err) => console.log(err));
        } else {
          response("API endpoint not found");
        }
      }
    });
  });
}

function extendObject(a, b) {
  for (var key in b) if (b.hasOwnProperty(key)) a[key] = b[key];
  return a;
}

app(window);
