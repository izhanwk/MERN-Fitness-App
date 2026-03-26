import React from "react";
import DNavbar from "./DNavbar";
import Data from "./Data";
import SDNavbar from "./SDNavbar";
import Footer from "./Footer";

function Signup() {
  return (
    <>
      <div className="min-h-screen bg-[#30093f] ...">
        <DNavbar />
        <Data />
        <Footer />
      </div>
    </>
  );
}

export default Signup;
