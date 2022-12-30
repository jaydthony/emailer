import React, { useEffect, useState } from "react";
import { FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { profileData } from "../context";

function Header() {
  const [user] = profileData((state) => [state.data]);
  const [name, setName] = useState('Guest')
  useEffect(()=>{
    if('firstName' in user && 'lastName' in user){
      setName(`${user.firstName } ${user.lastName}`)
    }
  },[])
  return (
    <>
      <header className="flex w-full bg-white p-2 backdrop-blur ">
        <div className="navbar flex w-full max-w-full bg-base-100">
          <p className="text-3xl font-bold lg:hidden">Emailer</p>
          <label
            htmlFor="my-drawer-2"
            className="drawer-button btn ml-auto self-end border-none bg-transparent text-3xl text-slate-900 hover:bg-transparent hover:text-slate-900 lg:hidden"
          >
            <FiMenu />
          </label>
          <div className="dropdown-end dropdown hidden lg:ml-auto lg:block cursor-pointer">
            <label tabIndex={0} className="btn-ghost flex items-center gap-2 hover:bg-transparent capitalize cursor-pointer">
              <FiUser /> {name}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow  "
            >
              <li>
                <NavLink
                  to="logout"
                  className={({ isActive }) =>
                    isActive ? "active" : undefined
                  }
                >
                  <FiLogOut />
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
