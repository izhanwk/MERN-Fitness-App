import React from "react";
import DNavbar from "./DNavbar";
import Data from "./Data";
import SDNavbar from "./SDNavbar";

function Signup() {
  return (
    <div className="h-screen bg-[#30093f] p-0 m-0 flex flex-col items-center font-dm-sans">
      <DNavbar />
      <div className="flex w-full">
        <SDNavbar />
        <div className="flex flex-col items-center w-screen">
          <div className="text-2xl text-center mt-[5vh] text-yellow-400 font-dm-sans">
            Your Data
          </div>
          <Data />
        </div>
      </div>
    </div>
  );
}

export default Signup;
