import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SDNavbar() {
  const [visible2, setvisible2] = useState(false);
  const [visible, setvisible] = useState(false);
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
    navigate("/signin");
  };
  const show = () => {
    setvisible(!visible);
  };
  return (
    <div className="min-h-screen w-[12vw] bg-[#1f0729] top-0 left-0 md:hidden flex flex-col items-center">
      <i
        className="fa-solid fa-power-off text-white text-lg my-8 cursor-pointer m-4"
        onClick={show}
      ></i>
      <i
        className="fa-solid fa-phone text-white text-lg my-8 cursor-pointer m-4"
        onClick={() => {
          setvisible2(true);
          setTimeout(() => {
            document.querySelector("#text").innerHTML =
              "<p>Email: <span class='font-normal'>izhan3008@gmail.com</span></p><p>Contact No: <span class='font-normal'>+923486186394</span></p>";
          }, 0);
        }}
      ></i>

      <i
        className="fa-solid fa-child text-white text-lg my-8 cursor-pointer m-4 "
        onClick={() => {
          setvisible2(true);
          setTimeout(() => {
            document.querySelector("#text").innerHTML =
              "<p class='font-normal text-base text-center'>I am a full stack web-developer with expertise in creating userfriendly web app for multiple audiences</p>";
          }, 0);
        }}
      ></i>

      <i
        className="fa-solid fa-book-open text-white text-lg my-8 cursor-pointer m-4 "
        onClick={() => {
          setvisible2(true);
          setTimeout(() => {
            document.querySelector("#text").innerHTML =
              "<p class='font-normal text-base text-center'>This app has all the essential micro and macronutients data available for you to track your fitness needs. Whether you want to gain or loss the weight this app will guide you throughout achieving your fitness goals</p>";
          }, 0);
        }}
      ></i>

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

export default SDNavbar;
