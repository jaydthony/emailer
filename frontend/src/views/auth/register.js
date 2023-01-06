import React, { useState, useTransition } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import _, { isEmpty } from "underscore";
import { User } from "../../sdk/User.sdk";
import { authToken, profileData } from "../../context";
import { FiEye, FiEyeOff, FiMail, FiUser } from "react-icons/fi";
import Pop from "../../components/pop";
import NoAuthHeader from "../../components/noAuthHeader";
import Notiflix from "notiflix";

function Register() {
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [conPass, setConPass] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShow] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [setProfile] = profileData((state) => [state.setData]);
  const [setToken] = authToken((state) => [state.setToken]);
  const checkFields = () => {
    if (
      isEmpty(firstName) ||
      isEmpty(lastName) ||
      isEmpty(email) ||
      isEmpty(conPass) ||
      isEmpty(password)
    ) {
      setErr("All fields are required");
    } else if (password !== conPass) {
      setErr("Passwords doesn't match");
    } else {
      setErr("");
    }
  };
  const signup = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      checkFields();
      if (isEmpty(err)) {
        let response = await User.create({
          email,
          firstName,
          lastName,
          password,
        });
        if (response.status == true) {
          setToken(response.jwt);
          setProfile(response.data);
          navigate("/");
        } else {
          if (typeof response.data == "String") {
            setErr(response.data);
          }
          if (typeof response.data == "Array") {
            setErr(response.data.join(","));
          }
          if (
            typeof response.data !== "Array" &&
            typeof response.data !== "String"
          ) {
            Notiflix.Notify.info(response.data);
          }
        }
      }
    });
  };
  return (
    <>
      <NoAuthHeader />
      <div className="mx-auto mt-12 max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Get Started Today!</h1>

          <p className="mt-4 text-gray-500">
            Register to your account to continue
          </p>
        </div>
        {!isEmpty(err) && <Pop data={err} type={"error"} />}
        <form
          action="#"
          onSubmit={(e) => signup(e)}
          className="mx-auto mt-8 mb-0 max-w-md space-y-4"
        >
          <div>
            <label htmlFor="first_name" className="sr-only">
              First Name
            </label>

            <div className="relative">
              <input
                type="text"
                className="input w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                placeholder="Enter your first name"
                onChange={(e) => setFirstName(e.target.value)}
              />

              <span className="absolute inset-y-0 right-4 inline-flex items-center">
                <FiUser />
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="last_name" className="sr-only">
              Last Name
            </label>

            <div className="relative">
              <input
                type="text"
                className="input w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                placeholder="Enter your last name"
                onChange={(e) => setLastName(e.target.value)}
              />

              <span className="absolute inset-y-0 right-4 inline-flex items-center">
                <FiUser />
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>

            <div className="relative">
              <input
                type="email"
                className="input w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <span className="absolute inset-y-0 right-4 inline-flex items-center">
                <FiMail />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  className="absolute inset-y-0 right-4 inline-flex items-center"
                  onClick={(e) => setShow(!showPassword)}
                >
                  {!showPassword && <FiEye />}
                  {showPassword && <FiEyeOff />}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                placeholder="Enter password again"
                onChange={(e) => setConPass(e.target.value)}
              />

              <span
                className="absolute inset-y-0 right-4 inline-flex items-center"
                onClick={(e) => setShow(!showPassword)}
              >
                {!showPassword && <FiEye />}
                {showPassword && <FiEyeOff />}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`${
                pending ? "loading" : ""
              }btn-ghost btn mr-3 inline-block rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white`}
            >
              Sign Up
            </button>
            <p className="ml-auto text-sm text-gray-500">
              Already have an account?
              <NavLink className="underline" to="/login">
                Sign In
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
