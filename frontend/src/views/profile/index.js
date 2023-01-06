import React from "react";
import { FiUserCheck } from "react-icons/fi";
import { profileData } from "../../context";

function Profile() {
  const [profile] = profileData((state) => [state.data]);
  const { firstName, lastName, email } = profile;
  return (
    <>
      <h1 className="mb-4 flex gap-2 text-3xl font-semibold">
        <FiUserCheck /> Profile
      </h1>
      <div className="profile rounded-lg bg-white p-4 shadow">
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
