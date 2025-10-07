import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for hamburger icons
import { Dumbbell } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [visible2, setvisible2] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* Modal for Contact/About/Guide */}
      {visible2 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center">
          <div className="w-96 max-w-[90%] h-auto bg-white/95 rounded-2xl shadow-2xl text-slate-800 flex flex-col justify-center items-center font-bold relative p-6 border border-white/20">
            <div id="text" className="text-center"></div>
            <div
              className="bg-gradient-to-r from-red-500 to-red-600 mt-6 px-6 py-2 text-white rounded-full cursor-pointer hover:from-red-400 hover:to-red-500 transition-all duration-300 shadow-lg"
              onClick={() => setvisible2(false)}
            >
              Close
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="w-full h-20 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center relative z-20">
        <div className="flex items-center justify-between w-full px-6 md:px-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <Dumbbell className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-xl">FitTracker</span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex text-white font-dm-sans space-x-6 items-center">
            <li
              className="hover:cursor-pointer hover:text-yellow-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className="hover:cursor-pointer hover:text-yellow-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
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
              className="hover:cursor-pointer hover:text-yellow-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
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
              className="hover:cursor-pointer hover:text-yellow-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
              onClick={() => {
                setvisible2(true);
                setTimeout(() => {
                  document.querySelector("#text").innerHTML =
                    "<p class='font-normal text-base text-center'>This app has all the essential micro and macronutients data available for you to track your fitness needs. Whether you want to gain or loss the weight this app will guide you throughout achieving your fitness goals</p>";
                }, 0);
              }}
            >
              Guide
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black/80 backdrop-blur-lg z-40 flex flex-col space-y-4 px-6 py-4 text-white">
          <span
            className="cursor-pointer hover:text-yellow-400 transition-colors py-2"
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
          >
            Home
          </span>
          <span
            className="cursor-pointer hover:text-yellow-400 transition-colors py-2"
            onClick={() => {
              setvisible2(true);
              setMenuOpen(false);
              setTimeout(() => {
                document.querySelector("#text").innerHTML =
                  "<p>Email: <span class='font-normal'>izhan3008@gmail.com</span></p><p>Contact No: <span class='font-normal'>+923486186394</span></p>";
              }, 0);
            }}
          >
            Contact
          </span>
          <span
            className="cursor-pointer hover:text-yellow-400 transition-colors py-2"
            onClick={() => {
              setvisible2(true);
              setMenuOpen(false);
              setTimeout(() => {
                document.querySelector("#text").innerHTML =
                  "<p class='font-normal text-base text-center'>I am a full stack web-developer with expertise in creating userfriendly web app for multiple audiences</p>";
              }, 0);
            }}
          >
            About us
          </span>
          <span
            className="cursor-pointer hover:text-yellow-400 transition-colors py-2"
            onClick={() => {
              setvisible2(true);
              setMenuOpen(false);
              setTimeout(() => {
                document.querySelector("#text").innerHTML =
                  "<p class='font-normal text-base text-center'>This app has all the essential micro and macronutients data available for you to track your fitness needs...</p>";
              }, 0);
            }}
          >
            Guide
          </span>
        </div>
      )}
    </div>
  );
};

export default Navbar;
