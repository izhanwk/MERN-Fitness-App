import React from "react";
import DNavbar from "./DNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SDNavbar from "./SDNavbar";

function Musclegain() {
  const [musclegainMode, setmusclegainMode] = useState("");
  let navigate = useNavigate();
  const sendData = async () => {
    try {
      let response = await fetch("https://7ec1b82ac30b.ngrok-free.app/mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ mode: musclegainMode }),
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
    if (musclegainMode) {
      sendData();
    }
  }, [musclegainMode]);

  console.log(musclegainMode);

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
                setmusclegainMode("Moderate Musclegain");
              }}
            >
              Moderate Musclegain
            </div>
            <div
              className="w-80 h-20 max-md:w-56 max-md:text-[16px] bg-white rounded-full flex justify-center items-center text-2xl hover:bg-yellow-400 hover:text-[#30093f] cursor-pointer m-10 max-md:m-5 font-bold"
              onClick={() => {
                setmusclegainMode("Fast Musclegain");
              }}
            >
              Fast Musclegain
            </div>
            <p className="text-white text-[14px] pt-5 font-dm-sans opacity-50 w-[50vw] text-center max-md:text-[10px]">
              Note: Moderate speed musclegain is always preferable as it
              maximizes the musclegain with minimum amout of fatgain
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Musclegain;
