import React from "react";
import DNavbar from "./DNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SDNavbar from "./SDNavbar";
import apiFetch from "../utils/api";

function Fatloss() {
  const [fatlossMode, setfatlossMode] = useState("");
  let navigate = useNavigate();
  //   console.log(fatlossMode);

  const sendData = async (data) => {
    try {
      let response = await apiFetch("https://7ec1b82ac30b.ngrok-free.app/mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ mode: fatlossMode }),
      });

      if (response.ok) {
        alert("Data sent to DB");
        navigate("/activity");
      }
    } catch (err) {
      alert("A problem occured");
    }
  };

  useEffect(() => {
    if (fatlossMode) {
      sendData();
    }
  }, [fatlossMode]);

  const fatloss = (mode) => {
    setfatlossMode(mode);
  };

  return (
    <div>
      <DNavbar />
      <div className="flex w-screen">
        <SDNavbar />
        <div className="h-screen w-screen bg-[#30093f] p-0 m-0 flex flex-col items-center font-dm-sans">
          <div className="mt-[50vh] -translate-y-1/2 flex flex-col items-center justify-center">
            <div
              className="w-80 h-20 max-md:w-56 max-md:text-[16px]  bg-white rounded-full flex justify-center items-center text-2xl hover:bg-yellow-400 hover:text-[#30093f]  cursor-pointer m-10 max-md:m-5 font-bold"
              onClick={() => {
                fatloss("Moderate fatloss");
              }}
            >
              Moderate Fatloss
            </div>
            <div
              className="w-80 h-20 max-md:w-56 max-md:text-[16px]  bg-white rounded-full flex justify-center items-center text-2xl hover:bg-yellow-400 hover:text-[#30093f]  cursor-pointer m-10 max-md:m-5 font-bold"
              onClick={() => {
                fatloss("Fast fatloss");
              }}
            >
              Fast Fatloss
            </div>
            <p className="text-white text-[14px] pt-5 font-dm-sans opacity-50 w-[50vw] text-center max-md:text-[10px]">
              Note: Moderate speed fatloss is always preferable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fatloss;
