import Notiflix from "notiflix";
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { isEmpty } from "underscore";
import NoAuthHeader from "../../components/noAuthHeader";
import { Subscriber } from "../../sdk/Subscriber.sdk";

function Unsubscribe() {
  const [email, setEmail] = useState("");
  const [removed, setRemoved] = useState(false);
  const [search, setSearch] = useSearchParams();
  useEffect(() => {
    setEmail(search.get("email"));
  }, []);
  const testEmail = (email) => {
    var emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (isEmpty(email)) {
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
  };
  const unsubscribe = async (e) => {
    e.preventDefault();
    if (testEmail(email).status) {
      let resp = await Subscriber.unsubscribe(email);
      console.log(resp);
      if (resp == null) {
        Notiflix.Notify.warning("Email address not found");
      } else {
        Notiflix.Notify.success("User unsubscribed successfully");
        setRemoved(true);
      }
    } else {
      Notiflix.Notify.warning("Invalid email passed");
    }
  };
  return (
    <>
      <NoAuthHeader />
      <div className="mx-auto mt-8 flex max-w-lg flex-col justify-center p-8 shadow">
        <h1 className="text-xl"></h1>
        {!removed && (
          <>
            <form
              action="#"
              onSubmit={(e) => unsubscribe(e)}
              method="get"
              className="flex flex-col gap-10"
            >
              <p className="text-lg font-semibold">
                You are about to unsubscribe from the newsletter list
              </p>
              {email != "" && (
                <p>
                  The email address <span className="text-info">{email} </span>
                  will be removed from our database.
                </p>
              )}
              <button
                type="submit"
                className="btn-ghost btn bg-slate-700 text-white"
              >
                Confirm
              </button>
            </form>
          </>
        )}
        {removed && (
          <>
            <p>Email removed</p>
          </>
        )}
      </div>
    </>
  );
}

export default Unsubscribe;
