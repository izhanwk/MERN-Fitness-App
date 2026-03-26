import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for hamburger icons
import { Dumbbell } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToFooterSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="w-full h-20 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center relative z-20">
        <div className="flex items-center justify-between w-full px-6 md:px-8">
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center space-x-2"
            onClick={() => navigate("/dashboard")}
          >
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
              onClick={() => scrollToFooterSection("footer-contact")}
            >
              Contact
            </li>
            <li
              className="hover:cursor-pointer hover:text-yellow-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
              onClick={() => scrollToFooterSection("footer-about")}
            >
              About us
            </li>
            <li
              className="hover:cursor-pointer hover:text-yellow-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
              onClick={() => scrollToFooterSection("footer-guide")}
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
              scrollToFooterSection("footer-contact");
              setMenuOpen(false);
            }}
          >
            Contact
          </span>
          <span
            className="cursor-pointer hover:text-yellow-400 transition-colors py-2"
            onClick={() => {
              scrollToFooterSection("footer-about");
              setMenuOpen(false);
            }}
          >
            About us
          </span>
          <span
            className="cursor-pointer hover:text-yellow-400 transition-colors py-2"
            onClick={() => {
              scrollToFooterSection("footer-guide");
              setMenuOpen(false);
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
