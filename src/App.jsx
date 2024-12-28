import { useState } from "react";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import SNavbar from "./components/SNavbar";

function App() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  return (
    <>
      <div className="h-screen bg-[#30093f] p-0 m-0 relative">
        <Navbar />

        <div className="flex md:w-full">
          <SNavbar />
          <div className="flex flex-col mt-40 mx-auto w-[100vw] items-center ">
            <p className="text-white text-7xl text-center md:w-[100%] max-md:text-4xl">
              Track your <br />
              <span className="text-yellow-400">Fitness</span> journey
            </p>
            <p className="text-white text-center text-[14px] pt-5 font-dm-sans opacity-50 w-[50vw] max-md:w-72 max-md:text-[9px]">
              We will provide you with the best resources to support every step
              of your fitness journey, ensuring you have everything you need to
              stay on track and meet your health goals. With our tailored
              guidance and reliable tools, you'll be able to monitor your
              progress, set achievable milestones, and gain insights into every
              aspect of your fitness
            </p>

            <button
              onClick={() => {
                navigate("/signin");
              }}
              className="w-20 h-5  bg-yellow-400 mt-4 text-center rounded-full font-dm-sans font-bold text-[12px] flex items-center justify-center hover:cursor-pointer transition-all hover:bg-white max-md:h-3 max-md:text-[8px]"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
