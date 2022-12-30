import * as React from "react";
import "./css/style.css";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { ErrorPage } from "./components";
import { Login, Register } from "./views/auth";
import Profile from "./views/profile";
import Subscribers from "./views/subscribers";
import Dashboard from "./views/dashboard";
import { NewEmail } from "./views/emails";
import * as fetchIntercept from "fetch-intercept";
import Logout from "./components/logout";

// (function () {
//   fetchIntercept.register({
//     request: function (url, config) {
//       config.headers.jwt = localStorage.getItem("jwt");
//       return [url, config];
//     },
//   });
// })();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "new",
        element: <NewEmail />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "subscribers",
        element: <Subscribers />,
      },
    ],
  },
  { 
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
