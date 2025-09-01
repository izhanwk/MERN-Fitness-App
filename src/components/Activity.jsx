import DNavbar from "./DNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SDNavbar from "./SDNavbar";
import apiFetch from "../utils/api";
import Loader from "./Loader";

function Activity() {
  const [activityLevel, setactivityLevel] = useState(0);
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const sendData = async () => {
    setLoading(true);
    let response = await apiFetch("https://7ec1b82ac30b.ngrok-free.app/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ activity: activityLevel }),
    });
    if (response.ok) {
      console.log("Sent to DB");
    }
    setLoading(false);
  };
  useEffect(() => {
    if (activityLevel) {
      console.log(activityLevel);
      sendData();
      navigate("/dashboard");
    }
  }, [activityLevel]);

  return (
    <div>
      {loading && <Loader />}
      <DNavbar />
      <div className="flex">
        <SDNavbar />
        <div className="w-screen">
          <div className="h-screen bg-[#30093f] p-0 m-0 flex flex-col items-center font-dm-sans">
            <div className="text-2xl text-center mt-[5vh] text-yellow-400 font-dm-sans max-md:text-lg">
              Select your activity level
            </div>
            <div className=" h-[70vh] flex flex-col justify-around">
              <div
                className="w-96 h-10 bg-[#1f0729] rounded-full text-white flex justify-center items-center relative cursor-pointer hover:text-white hover:bg-yellow-600 max-md:w-64 "
                onClick={() => {
                  setactivityLevel(1.2);
                }}
              >
                Sedentary
                <p className=" text-[10px] absolute top-11 left-[50%] -translate-x-1/2 text-white max-md:text-[8px]">
                  Little or no workout
                </p>
              </div>
              <div
                className="w-96 h-10 bg-[#1f0729] rounded-full text-white flex justify-center items-center relative cursor-pointer hover:text-white hover:bg-yellow-600 max-md:w-64 "
                onClick={() => {
                  setactivityLevel(1.375);
                }}
              >
                Lightly Active
                <p className=" text-[10px] absolute top-11 left-[50%] -translate-x-1/2 text-white max-md:text-[8px]">
                  Exercise 1-3 days a week
                </p>
              </div>
              <div
                className="w-96 h-10 bg-[#1f0729] rounded-full text-white flex justify-center items-center relative cursor-pointer hover:text-white hover:bg-yellow-600 max-md:w-64 "
                onClick={() => {
                  setactivityLevel(1.55);
                }}
              >
                Moderately Active
                <p className=" text-[10px] absolute top-11 left-[50%] -translate-x-1/2 text-white max-md:text-[8px]">
                  Exercise 3-5 days a week
                </p>
              </div>
              <div
                className="w-96 h-10 bg-[#1f0729] rounded-full text-white flex justify-center items-center relative cursor-pointer hover:text-white hover:bg-yellow-600 max-md:w-64 "
                onClick={() => {
                  setactivityLevel(1.725);
                }}
              >
                Very Active
                <p className=" text-[10px] absolute top-11 left-[50%] -translate-x-1/2 text-white max-md:text-[8px]">
                  Exercise 6-7 days a week
                </p>
              </div>
              <div
                className="w-96 h-10 bg-[#1f0729] rounded-full text-white flex justify-center items-center relative cursor-pointer hover:text-white hover:bg-yellow-600 max-md:w-64 "
                onClick={() => {
                  setactivityLevel(1.9);
                }}
              >
                Super Active
                <p className=" text-[10px] absolute top-11 left-[50%] -translate-x-1/2 text-white max-md:text-[8px]">
                  For atheletes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activity;
