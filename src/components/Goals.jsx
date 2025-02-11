import React from "react";
import { useState, useEffect } from "react";
import DNavbar from "./DNavbar";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SDNavbar from "./SDNavbar";

function Goals() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedGoal = watch("goal");

  const navigate = useNavigate();
  const [goal, setgoal] = useState("");
  useEffect(() => {
    if (selectedGoal) {
      setgoal(selectedGoal);
    }
  }, [selectedGoal]);
  console.log(`goal: ${goal}`);

  const buttonClick = () => {
    if (goal == "musclegain") {
      navigate("/musclegain");
    } else {
      navigate("/fatloss");
    }
  };

  const onSubmit = async (data) => {
    try {
      let response = await fetch(
        "https://mern-fitness-app-production-e9fe.up.railway.app/goals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        alert("Your goal submitted");
        buttonClick();
      }
      if (!response.ok) {
        alert("An error occured from server. Login Again");
      }
    } catch (err) {
      alert("Problem while connecting with server");
    }
  };

  return (
    <div className="h-screen bg-[#30093f] p-0 m-0 flex flex-col items-center font-dm-sans">
      <DNavbar />
      <div className="flex w-screen">
        <SDNavbar></SDNavbar>
        <div className="flex w-screen flex-col items-center">
          <div className="text-2xl text-center mt-[5vh] text-yellow-400 font-dm-sans">
            Select your goal
          </div>
          <div className="w-[50vw] h-96 bg-[#1f0729] mt-8 rounded-3xl max-md:w-[80vw]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full h-full flex  flex-col  justify-evenly items-center "
            >
              <label htmlFor="musclegain" className="relative">
                <input
                  type="radio"
                  name="goal"
                  id="musclegain"
                  value="musclegain"
                  className="appearance-none w-56 h-20 rounded-md bg-[#09020c] cursor-pointer checked:bg-purple-950"
                  {...register("goal", { required: true })}
                />
                <span className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-white cursor-pointer">
                  Muscle gain
                </span>
              </label>
              <label htmlFor="fatloss" className="relative">
                <input
                  type="radio"
                  name="goal"
                  id="fatloss"
                  value="fatloss"
                  className="appearance-none w-56 h-20 rounded-md bg-[#09020c] cursor-pointer checked:bg-purple-950"
                  {...register("goal", { required: true })}
                />
                <span className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-white cursor-pointer">
                  Fatloss
                </span>
                {errors.goal && (
                  <div className="absolute w-full top-50% left-[50%] text-red-600 text-xs text-center -translate-x-1/2">
                    Please select a goal
                  </div>
                )}
              </label>
              <button
                type="submit"
                className="bg-yellow-400 w-28 font-[600px] h-6 rounded-2xl m-2 hover:bg-white max-md:text-[10px] max-md:h-4 max-md:w-24"
              >
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Goals;
