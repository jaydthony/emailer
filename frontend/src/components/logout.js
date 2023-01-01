import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authToken, profileData } from "../context";
import Notiflix from "notiflix";

function Logout() {
  const navigate = useNavigate();
  const [profile, setProfile] = profileData((state) => [
    state.data,
    state.setData,
  ]);
  const [setToken] = authToken((state) => [state.setToken]);

  useEffect(() => {
    setProfile({});
    setToken("");
    Notiflix.Notify.success("Logged out");
    navigate("/login");
  }, []);
  return <></>;
}

export default Logout;
