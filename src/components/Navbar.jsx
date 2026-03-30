import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for hamburger icons
import { Dumbbell } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const publicRoutes = ["/", "/signin", "/signup", "/changepassword"];

    if (token && publicRoutes.includes(location.pathname)) {
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate, token]);

  const navigateHome = () => {
    navigate(token ? "/dashboard" : "/");
  };

  const scrollToFooterSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative">
      <nav className="theme-nav relative z-20 flex h-16 items-center sm:h-20">
        <div className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div
            className="flex min-w-0 cursor-pointer items-center gap-2 sm:gap-3"
            onClick={navigateHome}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-950/40 sm:h-10 sm:w-10">
              <Dumbbell
                className="h-5 w-5 text-white sm:h-6 sm:w-6"
                strokeWidth={2.5}
              />
            </div>
            <span className="truncate text-lg font-bold text-white sm:text-xl">
              FitTracker
            </span>
          </div>

          <ul className="hidden items-center space-x-2 font-dm-sans text-white lg:flex xl:space-x-4">
            <li
              className="cursor-pointer rounded-xl px-3 py-2 text-sm text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white xl:px-4"
              onClick={navigateHome}
            >
              Home
            </li>
            <li
              className="cursor-pointer rounded-xl px-3 py-2 text-sm text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white xl:px-4"
              onClick={() => scrollToFooterSection("footer-contact")}
            >
              Contact
            </li>
            <li
              className="cursor-pointer rounded-xl px-3 py-2 text-sm text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white xl:px-4"
              onClick={() => scrollToFooterSection("footer-about")}
            >
              About us
            </li>
            <li
              className="cursor-pointer rounded-xl px-3 py-2 text-sm text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white xl:px-4"
              onClick={() => scrollToFooterSection("footer-guide")}
            >
              Guide
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="rounded-xl p-2 text-white transition-colors hover:bg-white/8 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="absolute left-0 top-16 z-40 flex w-full flex-col space-y-3 border-b border-white/10 bg-slate-950/90 px-4 py-4 text-white backdrop-blur-lg sm:top-20 sm:px-6 lg:hidden">
          <span
            className="cursor-pointer rounded-xl px-3 py-2 text-white/70 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => {
              navigateHome();
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
