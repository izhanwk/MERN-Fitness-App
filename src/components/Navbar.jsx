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
      <nav className="theme-nav relative z-20 flex h-20 items-center">
        <div className="flex items-center justify-between w-full px-6 md:px-8">
          <div
            className="flex cursor-pointer items-center space-x-2"
            onClick={() => navigate("/dashboard")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-950/40">
              <Dumbbell className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-xl">FitTracker</span>
          </div>

          <ul className="hidden md:flex text-white font-dm-sans space-x-6 items-center">
            <li
              className="cursor-pointer rounded-xl px-4 py-2 text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white"
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className="cursor-pointer rounded-xl px-4 py-2 text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white"
              onClick={() => scrollToFooterSection("footer-contact")}
            >
              Contact
            </li>
            <li
              className="cursor-pointer rounded-xl px-4 py-2 text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white"
              onClick={() => scrollToFooterSection("footer-about")}
            >
              About us
            </li>
            <li
              className="cursor-pointer rounded-xl px-4 py-2 text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white"
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

      {menuOpen && (
        <div className="absolute left-0 top-20 z-40 flex w-full flex-col space-y-3 border-b border-white/10 bg-slate-950/90 px-6 py-4 text-white backdrop-blur-lg md:hidden">
          <span
            className="cursor-pointer rounded-xl px-3 py-2 text-white/70 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
          >
            Home
          </span>
          <span
            className="cursor-pointer rounded-xl px-3 py-2 text-white/70 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => {
              scrollToFooterSection("footer-contact");
              setMenuOpen(false);
            }}
          >
            Contact
          </span>
          <span
            className="cursor-pointer rounded-xl px-3 py-2 text-white/70 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => {
              scrollToFooterSection("footer-about");
              setMenuOpen(false);
            }}
          >
            About us
          </span>
          <span
            className="cursor-pointer rounded-xl px-3 py-2 text-white/70 transition-colors hover:bg-white/8 hover:text-white"
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
