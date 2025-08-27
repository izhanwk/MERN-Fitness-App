import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

function Data() {
  // const location = useLocation();
  // const email = location.state?.email;
  // console.log(email);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      let response = await fetch("http://localhost:3000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      console.log("COnnected");
      if (response.ok) {
        alert("Your data submitted");
        navigate("/goals");
      } else if (response.status === 403) {
      } else {
        throw new Error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Oops! There occurred a problem");
    }
  };

  return (
    <div className="w-[50vw] h-96 bg-[#1f0729] mt-8 rounded-3xl max-md:w-[80vw]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center h-[100%] text-xs"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Enter your name"
            className={`w-96 h-6 outline-none rounded-md text-center m-5 border-[2px] max-lg:w-72 max-md:w-56 max-lg:text-[10px] ${
              errors.name ? "border-red-600" : "border-transparent"
            }`}
            {...register("name", {
              required: { value: true, message: "This field is required" },
            })}
          />
          {errors.name && (
            <div className="absolute top-12 text-[10px] left-[50%] text-red-600 -translate-x-1/2 max-md:text-[9px] max-md:top-11">
              {errors.name.message}
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type="date"
            className={`w-96 h-6 outline-none rounded-md text-center m-5 border-[2px] max-lg:w-72 max-md:w-56 max-lg:text-[10px] ${
              errors.date ? "border-red-600" : "border-transparent"
            }`}
            {...register("date", {
              required: { value: true, message: "This field is required" },
            })}
          />
          {errors.date && (
            <div className="absolute top-12 left-[50%] text-red-600 -translate-x-1/2 max-lg:text-[10px] max-md:text-[9px] max-md:top-11">
              {errors.date.message}
            </div>
          )}
        </div>
        <div className="flex">
          <p className="text-white flex items-center text-xs max-lg:text-[10px]">
            Select your gender
          </p>
          <select
            className="w-28 h-5 outline-none rounded-md text-center m-5 p-0 max-lg:w-24 max-lg:text-[10px]"
            {...register("gender")}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex">
          <div className="relative">
            <input
              type="number"
              step="0.1"
              placeholder="Enter your weight"
              className={`w-48 h-5 outline-none rounded-md text-center border-[2px] m-5 max-lg:w-40 max-md:w-32 max-md:text-[10px]  ${
                errors.weight ? "border-red-600" : "border-transparent"
              }`}
              {...register("weight", {
                required: { value: true, message: "This field is required" },
              })}
            />
            {errors.weight && (
              <div className="absolute top-11 left-[50%] text-red-600 -translate-x-1/2 max-lg:text-[10px] max-md:w-24 max-md:text-[9px] max-md:top-10">
                {errors.weight.message}
              </div>
            )}
          </div>

          <select
            className="w-28 h-5 outline-none rounded-md text-center m-5 p-0 max-lg:text-[10px]"
            {...register("weightScale")}
          >
            <option>LBs</option>
            <option>Kgs</option>
          </select>
        </div>
        <div className="flex">
          <div className="relative">
            <input
              type="number"
              step="any"
              placeholder="Enter your height"
              className={`w-48 h-5 outline-none rounded-md text-center border-[2px] m-5 max-lg:w-40 max-md:w-32 max-md:text-[10px]  ${
                errors.height ? "border-red-600" : "border-transparent"
              }`}
              {...register("height", {
                required: { value: true, message: "This field is required" },
              })}
            />
            {errors.height && (
              <div className="absolute top-11 left-[50%] text-red-600 -translate-x-1/2 max-lg:text-[10px] max-md:w-24 max-md:text-[9px] max-md:top-10">
                {errors.height.message}
              </div>
            )}
          </div>
          <select
            className="w-28 h-5 outline-none rounded-md text-center m-5 p-0 max-lg:text-[10px]"
            {...register("lengthScale")}
          >
            <option>ft</option>
            <option>cm</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-yellow-400 w-24 font-semibold h-4 rounded-2xl m-2 hover:bg-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Data;
