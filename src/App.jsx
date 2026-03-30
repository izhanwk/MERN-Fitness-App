import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div className="app-shell">
        <Navbar />
        <div className="ambient-orbs" />
        <div className="ambient-orb-center" />

        <div className="flex w-full">
          <div className="flex flex-col mt-20 sm:mt-24 md:mt-28 lg:mt-32 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 items-center relative z-10">
            <div className="text-center space-y-4 sm:space-y-6 animate-fade-in">
              <h1
                className="text-white font-bold text-center leading-tight
                text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                max-w-4xl mx-auto"
              >
                Track your <br />
                <span className="theme-heading animate-gradient-x">
                  Fitness
                </span>{" "}
                journey
              </h1>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mt-6 sm:mt-8 max-w-4xl mx-auto">
                <div className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-2">
                  <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></div>
                  <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                    Nutrition Tracking
                  </span>
                </div>
                <div className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse delay-300"></div>
                  <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                    Goal Setting
                  </span>
                </div>
                <div className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-2">
                  <div className="h-2 w-2 rounded-full bg-sky-300 animate-pulse delay-700"></div>
                  <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                    Progress Analytics
                  </span>
                </div>
              </div>
            </div>

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

            <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col items-center space-y-4 sm:space-y-6">
              <button
                onClick={() => {
                  navigate("/signin");
                }}
                className="group relative rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-base font-bold text-white shadow-2xl shadow-purple-950/30 transition-all duration-300 hover:scale-105 hover:from-purple-400 hover:to-sky-400 sm:px-7 sm:py-3.5 sm:text-lg lg:px-8 lg:py-4 lg:text-xl"
              >
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-sky-400 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"></div>
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

            <div className="h-12 sm:h-16 lg:h-20"></div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
