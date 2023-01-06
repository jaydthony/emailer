import React, { useEffect, useState, useTransition } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User } from "../../sdk/User.sdk";
import { FiEye, FiEyeOff, FiAtSign } from "react-icons/fi";
import { authToken, profileData } from "../../context";
import NoAuthHeader from "../../components/noAuthHeader";
import Notiflix from "notiflix";

function Login() {
  const navigate = useNavigate();
  const [pending, startTransition] = useTransition();
  const [profile, setProfile] = profileData((state) => [
    state.data,
    state.setData,
  ]);
  const [token, setToken] = authToken((state) => [state.token, state.setToken]);
  const [showPassword, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      let response = await User.login({
        email,
        password,
      });
      if (response.status == true) {
        setToken(response.jwt);
        setProfile(response.data);
        Notiflix.Notify.success("Logged In");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        Notiflix.Notify.info(response.data);
      }
    });
  };

  return (
    <>
      <NoAuthHeader />
      <div className="mx-auto mt-12 max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Welcome Back!</h1>

          <p className="mt-4 text-gray-500">
            Login to your account to continue
          </p>
        </div>

        <form action="" className="mx-auto mt-8 mb-0 max-w-md space-y-4">
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
                <FiAtSign />
              </span>
            </div>
          </div>

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

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`${
                pending ? "loading" : ""
              }btn-ghost btn mr-3 inline-block rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-white`}
              onClick={(e) => login(e)}
            >
              Sign in
            </button>
            <p className="ml-auto text-sm text-gray-500">
              No account?
              <NavLink className="ml-2 underline" to="/register">
                Sign up
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
