import React from "react";
import { FiUserCheck } from "react-icons/fi";
import { profileData } from "../../context";

function Profile() {
  const [profile, setProfile] = profileData((state) => [
    state.data,
    state.setData,
  ]);
  const { firstName, lastName, email } = profile;
  return (
    <>
      <h1 className="text-3xl flex font-semibold mb-4 gap-2">
        <FiUserCheck /> Profile
      </h1>
      <div className="bg-white rounded-lg shadow p-4 profile">
        <div className="form-group">
          <label htmlFor="">First Name</label>
          <span>{firstName}</span>
        </div>
        <div className="form-group">
          <label htmlFor="">Last Name</label>
          <span>{lastName}</span>
        </div>
        <div className="form-group">
          <label htmlFor="">Email</label>
          <span>{email}</span>
        </div>
      </div>
    </>
  );
}

export default Profile;
