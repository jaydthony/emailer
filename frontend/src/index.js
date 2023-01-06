import * as React from "react";
import "./css/style.css";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { ErrorPage } from "./components";
import { Login, Register } from "./views/auth";
import Profile from "./views/profile";
import Subscribers, { Unsubscribe } from "./views/subscribers";
import Dashboard from "./views/dashboard";
import { emailLoader, NewEmail } from "./views/emails";
import Logout from "./components/logout";
import EditEmail from "./views/emails/edit";
import Setting from "./views/settings";

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
        path: "email",
        element: <NewEmail />,
      },
      {
        path: "edit/:mailId",
        element: <EditEmail />,
        loader: emailLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "subscribers",
        element: <Subscribers />,
      },
      {
        path: "settings",
        element: <Setting />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "unsubscribe",
    element: <Unsubscribe />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
