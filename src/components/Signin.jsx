import React from "react";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SNavbar from "./SNavbar";

function Signin() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        "https://mern-fitness-app-production-e9fe.up.railway.app/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 302) {
        alert("Incomplete profile, redirecting...");
        const responseData = await response.json();
        const email = responseData.email;
        localStorage.setItem("token", responseData.data.token);
        navigate("/signup/userdata", { state: { email } });
        return;
      }

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("token", responseData.data.token);
        localStorage.setItem("refreshtoken", responseData.data.refresh);
        console.log(`${localStorage.getItem("refreshtoken")}`);
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        setError("email", {
          type: "server",
          message: errorData.message || "You provided wrong data",
        });
        setError("password", {
          type: "server",
          message: errorData.message || "You provided wrong data",
        });
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="h-screen bg-[#30093f] p-0 m-0 flex flex-col items-center font-dm-sans">
        <Navbar />
        <div className="flex w-screen ">
          <SNavbar />
          <div className="w-screen flex flex-col items-center">
            <div className="text-2xl text-center mt-[5vh] text-yellow-400">
              Login
            </div>
            <div className="w-[50vw] h-96 bg-[#1f0729] mt-8 rounded-3xl max-md:w-[80vw]">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col  items-center justify-center text-sm h-[100%]"
              >
                <div className="relative max-md:h-11">
                  <input
                    type="email"
                    placeholder="Email"
                    className={`w-80 max-md:text-[9px] h-6 max-md:w-44 max-md:h-5 outline-none rounded-md text-center border-[2px] m-5 max-lg:w-60 max-lg:text-[10px] ${
                      errors.email ? "border-red-600" : "border-transparent"
                    }`}
                    {...register("email", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="text-red-600  absolute top-10 text-[8px] left-[50%] text-xs -translate-x-1/2">
                      {errors.email?.message}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    className={`w-80 h-6 outline-none max-md:text-[8px] max-md:w-44 max-md:h-5 rounded-md text-center border-[2px] m-5 max-lg:w-60 max-lg:text-[10px] ${
                      errors.password ? "border-red-600" : "border-transparent"
                    }`}
                    {...register("password", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                    })}
                  />
                  {errors.password && (
                    <div className="text-red-600 absolute top-10 text-[8px] left-[50%] text-xs -translate-x-1/2">
                      {errors.password?.message}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="flex justify-center max-lg:text-[11px] max-lg:w-13 max-lg:h-4 items-center bg-yellow-400 max-md:w-14 max-md:h-3 text-xs max-md:text-[7px] w-28 font-semibold h-5 rounded-2xl m-5 max-md:m-1  hover:bg-white hover:text-black"
                >
                  Login
                </button>
                <Link to={"/signup"}>
                  <button className="text-white text-xs hover:underline max-md:text-[8px] max-lg:text-[10px]">
                    Create a new Account
                  </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signin;
