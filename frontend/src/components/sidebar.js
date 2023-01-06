import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiLogOut,
  FiSettings,
  FiUser,
  FiUserCheck,
} from "react-icons/fi";
import { isEmpty } from "underscore";
import { MenuLink, BareLink } from ".";
import { profileData } from "../context";
export function Logo() {
  return (
    <>
      <p className="logo_title flex h-auto items-center bg-slate-900 py-5 px-4 align-middle text-3xl font-black tracking-wider text-slate-100">
        Emailer
      </p>
    </>
  );
}

function Sidebar() {
  const [user] = profileData((state) => [state.data]);
  const [name, setName] = useState("Guest");
  useEffect(() => {
    if (!isEmpty(user)) {
      setName(`${user.firstName} ${user.lastName}`);
    }
  }, []);
  return (
    <>
      <div className="sidebar drawer-side text-white lg:bg-slate-800">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu w-80 bg-slate-800">
          <Logo />
          <span className="divider mb-8"></span>
          <BareLink
            icon={<FiUser />}
            to={"/"}
            title={name}
            newClass={"mb-2 lg:hidden "}
          />

          <MenuLink
            icon={<FiHome />}
            to={"/"}
            title={`Dashboard`}
            newClass={""}
          />
          <MenuLink
            icon={<FiUserCheck />}
            to={"subscribers"}
            title={`Subscribers`}
            newClass={""}
          />
          <MenuLink
            icon={<FiUser />}
            to={"profile"}
            title={`Profile`}
            newClass={""}
          />
          <MenuLink
            icon={<FiSettings />}
            to={"settings"}
            title={`Settings`}
            newClass={""}
          />
          <MenuLink
            icon={<FiLogOut />}
            to={"logout"}
            title={`Logout`}
            newClass={"lg:hidden"}
          />
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
