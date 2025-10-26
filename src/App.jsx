import { useState } from "react";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import SNavbar from "./components/SNavbar";

function App() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-0 m-0 relative overflow-hidden">
        <Navbar />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 sm:-top-32 sm:-right-32 lg:-top-40 lg:-right-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 sm:-bottom-32 sm:-left-32 lg:-bottom-40 lg:-left-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="flex w-full">
          {/* <SNavbar /> */}
          <div className="flex flex-col mt-20 sm:mt-24 md:mt-28 lg:mt-32 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 items-center relative z-10">
            {/* Hero Section */}
            <div className="text-center space-y-4 sm:space-y-6 animate-fade-in">
              <h1
                className="text-white font-bold text-center leading-tight
                text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                max-w-4xl mx-auto"
              >
                Track your <br />
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                  Fitness
                </span>{" "}
                journey
              </h1>

              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mt-6 sm:mt-8 max-w-4xl mx-auto">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                    Nutrition Tracking
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 border border-white/20">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                    Goal Setting
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 border border-white/20">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                  <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                    Progress Analytics
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p
              className="text-white/80 text-center leading-relaxed font-dm-sans mt-6 sm:mt-8 lg:mt-10
              text-sm sm:text-base lg:text-lg
              w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl
              px-4 sm:px-0"
            >
              Transform your fitness journey with our comprehensive tracking
              platform. Monitor nutrition, set personalized goals, and achieve
              lasting results with data-driven insights tailored to your unique
              needs.
            </p>

            {/* CTA Section */}
            <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col items-center space-y-4 sm:space-y-6">
              <button
                onClick={() => {
                  navigate("/signin");
                }}
                className="group relative font-bold rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105 hover:from-yellow-300 hover:to-orange-400
                  px-6 py-3 text-base sm:px-7 sm:py-3.5 sm:text-lg lg:px-8 lg:py-4 lg:text-xl
                  bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
              >
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </button>

              <div className="flex items-center space-x-2 text-white/60 text-xs sm:text-sm">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-center">
                  Free to start • No credit card required
                </span>
              </div>
            </div>

            {/* Bottom spacing */}
            <div className="h-12 sm:h-16 lg:h-20"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
