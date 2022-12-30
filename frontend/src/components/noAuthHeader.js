import React from "react";

function NoAuthHeader() {
  return (
    <>
      <header className="flex w-full bg-slate-700 text-white p-2 backdrop-blur items-center ">
        <div className="navbar flex w-full max-w-full  ">
          <p className="text-3xl font-bold text-white">Emailer</p>
        </div>
        <span className="ml-auto">Support</span>
      </header>
    </>
  );
}

export default NoAuthHeader;
