import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function DNavbar() {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const [visible2, setvisible2] = useState(false);
  const [visible, setvisible] = useState(false);
  const show = () => {
    setvisible(!visible);
  };

  return (
    <div className="relative max-md:hidden">
      {visible2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10 flex justify-center items-center">
          <div className="w-96 h-96 bg-white rounded-md text-[#1f0729] flex justify-center items-center  font-bold relative p-4">
            <div id="text"></div>
            <div
              className="bg-red-600 absolute bottom-1 px-4 text-white rounded-full cursor-pointer hover:bg-red-500"
              onClick={() => {
                setvisible2(false);
              }}
            >
              Close
            </div>
          </div>
        </div>
      )}
      <nav className="w-full h-16 bg-[#1f0729] flex items-center">
        <ul className="text-white font-dm-sans flex w-screen justify-around items-center rounded-full">
          {/* <li className="hover:cursor-pointer hover:text-yellow-400">Home</li> */}
          <li
            className="hover:cursor-pointer hover:text-yellow-400"
            onClick={() => {
              setvisible2(true);
              setTimeout(() => {
                document.querySelector("#text").innerHTML =
                  "<p>Email: <span class='font-normal'>izhan3008@gmail.com</span></p><p>Contact No: <span class='font-normal'>+923486186394</span></p>";
              }, 0);
            }}
          >
            Contact
          </li>
          <li
            className="hover:cursor-pointer hover:text-yellow-400"
            onClick={() => {
              setvisible2(true);
              setTimeout(() => {
                document.querySelector("#text").innerHTML =
                  "<p class='font-normal text-base text-center'>I am a full stack web-developer with expertise in creating userfriendly web app for multiple audiences</p>";
              }, 0);
            }}
          >
            About us
          </li>
          <li
            className="hover:cursor-pointer hover:text-yellow-400"
            onClick={() => {
              setvisible2(true);
              setTimeout(() => {
                document.querySelector("#text").innerHTML =
                  "<p class='font-normal text-base text-center'>This app has all the essential micro and macronutients data available for you to track your fitness needs. Whether you want to gain or loss the weight this app will guide you throughout achieving your fitnessgoals</p>";
              }, 0);
            }}
          >
            Guide
          </li>
          <div
            className=" h-1 bg-purple-950 p-6 m-3 rounded-full flex justify-center items-center cursor-pointer hover:bg-purple-900"
            onClick={show}
          >
            Logout
          </div>
        </ul>
      </nav>
      {visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10"></div>
      )}
      <div
        className={`w-96 h-32 bg-purple-900 rounded-md absolute top-[50vh] left-[50vw] z-10 -translate-x-1/2 p-4 ${
          visible ? "block" : "hidden"
        }`}
      >
        <p className="text-white font-dm-sans text-lg">
          Are you sure you want to logout?
        </p>
        <div
          className="bg-purple-700 text-center rounded-md mt-2 cursor-pointer hover:bg-purple-950 text-white"
          onClick={logOut}
        >
          Yes
        </div>
        <div
          className="bg-purple-700 text-center rounded-md mt-2 cursor-pointer hover:bg-purple-950 text-white"
          onClick={show}
        >
          No
        </div>
      </div>
    </div>
  );
}

export default DNavbar;
