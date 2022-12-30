import React, { useEffect, useState } from "react";
import { FiEdit2, FiMessageSquare } from "react-icons/fi";
import Emails from "./emails";
import { Emailer } from "../sdk/Emailer.sdk.js";
import { AddNew } from "../components";
import { NavLink } from "react-router-dom";

function Dashboard() {
  const [subscribersCount, setSubCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  useEffect(() => {
    (async function () {
      let sub = await Emailer.getCount();
      if (typeof sub == "object") {
        const { messages, subscribers } = sub;
        setMsgCount(messages);
        setSubCount(subscribers);
      }
    })();
  }, []);
  return (
    <>
      <div className="flex gap-4 ">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Subscribers</div>
            <div className="stat-value">{subscribersCount}</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Emails</div>
            <div className="stat-value">{msgCount}</div>
          </div>
        </div>
      </div>
      <div className="pageTitle my-12 flex items-center gap-2 text-2xl font-semibold text-slate-800">
        <FiMessageSquare />
        <span>Emails</span>
        <NavLink
          to={"new"}
          className="btn-gbost btn-sm btn ml-auto gap-2 rounded-full text-xs "
        >
          <span>Compose New</span> <FiEdit2 />
        </NavLink>
      </div>
      <Emails />
      <AddNew />
    </>
  );
}

export default Dashboard;
