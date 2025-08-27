import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DNavbar from "./DNavbar";
import SDNavbar from "./SDNavbar";

const NutritionTracker = () => {
  const [food, setfood] = useState([]);
  const [userData, setuserData] = useState([]);
  const [selectFood, setselectFood] = useState("Select Food");
  const [searchText, setsearchText] = useState("");
  const [originalList, setoriginalList] = useState([]);
  const [searchStart, setsearchStart] = useState(true);

  const [weight, setweight] = useState(0);
  const [height, setheight] = useState(0);
  const [gender, setgender] = useState("");
  const [dob, setdob] = useState(0);
  const [mode, setmode] = useState("");
  const [Crequirement, setCrequirement] = useState(0);
  const [proteinReq, setproteinReq] = useState(0);
  const [fatsreq, setfatsreq] = useState(0);
  const [carbsreq, setcarbsreq] = useState(0);
  const [Areq, setAreq] = useState(0);
  const [Breq, setBreq] = useState(0);
  const [Creq, setCreq] = useState(0);
  const [Kreq, setKreq] = useState(0);
  const [ireq, setireq] = useState(0);
  const [calciumReq, setcalciumReq] = useState(0);
  const [magnesiumReq, setmagnesiumReq] = useState(0);

  const [BMR, setBMR] = useState(0);
  const [showList, setshowList] = useState(false);
  const [selectfoodArray, setselectfoodArray] = useState([]);

  const [loading, setLoading] = useState(true); // Track loading state

  const [foodselection, setfoodselection] = useState([]);
  const [userName, setuserName] = useState("");

  const refreshtoken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshtoken");
      let response = await fetch("http://localhost:3000/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("refreshtoken")}`,
        },
        body: JSON.stringify({ refreshtoken: refreshToken }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        console.log(localStorage.getItem("token"));
        console.log("Token Refreshed");
        // alert("Token Refreshed");
      } else {
        localStorage.removeItem("token");
        console.log("Login failed");
        alert("Session Expired");
        navigate("/signin");
      }
    } catch (err) {
      console.log("Error occured : ", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/getdata", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setuserData((prevUserData) => ({ ...prevUserData, ...data }));
          setmode(data.mode);
          console.log("User data:", data);
          setuserName(data.name);
        } else {
          alert("Token expired");
          navigate("/signin");
        }
      } catch (err) {
        console.log(`Error in fetchData: ${err}`);
      }
    };

    const fetchFood = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/getfood", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setfood(data);
          setfoodselection((prevSelection) => [...prevSelection, ...data]);
          setoriginalList(data);
        } else {
          console.log("Problem while fetching food data");
        }
      } catch (err) {
        console.log(`Error in fetchFood: ${err}`);
      }
    };
    const loadData = async () => {
      await fetchData();
      await fetchFood();
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const interValid = setInterval(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:3000/getdata", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            // alert("Token is valid");
            console.log("Token is Valid");
          } else if (response.status === 403) {
            refreshtoken();
          } else {
            alert("Token expired");
            navigate("/signin");
          }
        } catch (err) {
          console.log(`Error in fetchData: ${err}`);
        }
      };
      fetchData();
    }, 60000);
    return () => clearInterval(interValid);
  }, []);

  useEffect(() => {
    console.log(mode);
    if (mode === "Moderate Musclegain") {
      const creq = BMR + 400;
      setCrequirement(creq);
      // console.log(Crequirement);
    }
    if (mode === "Fast Musclegain") {
      const creq = BMR + 750;
      setCrequirement(creq);
      // console.log(Crequirement);
    }
    if (mode === "Moderate fatloss") {
      const creq = BMR - 500;
      setCrequirement(creq);
      // console.log(Crequirement);
    }
    if (mode === "Fast fatloss") {
      const creq = BMR - 800;
      setCrequirement(Math.round(creq));
      // console.log(Crequirement);
    }
  }, [mode, BMR]);

  useEffect(() => {
    const fats = (Crequirement * 0.3) / 9;
    setfatsreq(fats);
  }, [Crequirement]);

  useEffect(() => {
    const proteinCal = proteinReq * 4;
    const fatsCal = fatsreq * 9;
    const carbs = Crequirement - (fatsCal + proteinCal);
    setcarbsreq(carbs / 4);
  }, [proteinReq, fatsreq, Crequirement]);

  useEffect(() => {
    console.log(Math.round(Crequirement));
    console.log(BMR);
  }, [Crequirement]);

  useEffect(() => {
    setuserName(userData.name);
  }, [userData]);

  useEffect(() => {
    if (gender === "male") {
      setAreq(900 * 3.33);
    }
    if (gender === "female") {
      setAreq(700 * 3.33);
    }
  }, [gender]);

  useEffect(() => {
    if (gender === "male") {
      setBreq(1.2);
    }
    if (gender === "female") {
      setBreq(1.1);
    }
  }, [gender]);

  useEffect(() => {
    if (gender === "male") {
      setCreq(90);
    }
    if (gender === "female") {
      setCreq(75);
    }
  }, [gender]);

  useEffect(() => {
    setdob(userData?.date);
    if (userData?.weightScale === "Kgs") {
      setweight(userData?.weight * 2.20462);
    } else {
      setweight(userData?.weight);
    }
    if (userData?.lengthScale === "ft") {
      setheight(userData?.height * 30.48);
    } else {
      setheight(userData?.height);
    }
    setgender(userData?.gender);
  }, [userData]);

  useEffect(() => {
    const requirement = weight * 0.73;
    setproteinReq(requirement);
    console.log(proteinReq);
  }, [weight]);

  const age = () => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  age();

  useEffect(() => {
    if (age() < 19) {
      setKreq(75);
    }
    if (age() > 18) {
      if (gender === "male") {
        setKreq(120);
      }
      if (gender === "female") {
        setKreq(90);
      }
    }
  }, [age()]);

  useEffect(() => {
    if (age() < 19) {
      if (gender === "male") {
        setireq(11);
      }
      if (gender === "female") {
        setireq(15);
      }
    }
    if (age() > 18 && age() < 51) {
      if (gender === "male") {
        setireq(8);
      }
      if (gender === "female") {
        setireq(18);
      }
    }
    if (age() > 50) {
      setireq(8);
    }
  }, [age(), gender]);

  useEffect(() => {
    if (age() < 19) {
      if (gender === "male") {
        setmagnesiumReq(410);
      }
      if (gender === "female") {
        setmagnesiumReq(360);
      }
    }
    if (age() > 18 && age() < 31) {
      if (gender === "male") {
        setmagnesiumReq(400);
      }
      if (gender === "female") {
        setmagnesiumReq(310);
      }
    }
    if (age() >= 31) {
      if (gender === "male") {
        setmagnesiumReq(420);
      }
      if (gender === "female") {
        setmagnesiumReq(320);
      }
    }
  }, [age(), gender]);

  useEffect(() => {
    if (age() < 19) {
      setcalciumReq(1300);
    }
    if (age() > 18 && age() < 51) {
      setcalciumReq(1000);
    }
    if (age() > 50) {
      if (gender === "male") {
        setcalciumReq(1000);
      }
      if (gender === "female") {
        setcalciumReq(1200);
      }
    }
  }, [age(), gender]);

  useEffect(() => {
    console.log(gender);
    if (gender === "male") {
      const BMR = 88.362 + 6.24 * weight + 12.7 * height - 5.677 * age();
      setBMR(BMR);
      console.log(BMR);
    } else {
      const BMR = 447.593 + 4.35 * weight + 4.7 * height - 4.33 * age();
      setBMR(BMR);
    }
  }, [gender, weight, height, dob]);

  //When user click select food button then the list will become as it was before
  const start = () => {
    setsearchStart(!searchStart);
    console.log(searchStart);
    setsearchText("");
    setfood(originalList);
  };

  //This logic will be used for search
  const searchItems = (input) => {
    setsearchText(input);
    if (input !== "") {
      const filteredData = food.filter((item) =>
        Object.values(item).join("").toLowerCase().includes(input.toLowerCase())
      );
      setfood(filteredData);
    } else {
      setfood(originalList);
    }
  };

  const eatList = () => {
    setshowList(true);
  };

  const closeEatList = () => {
    setshowList(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Updated selectfoodArray:", selectfoodArray);
  }, [selectfoodArray]);

  //To show or hide search popup
  const [searchVisiblity, setsearchVisiblity] = useState(false);
  const searchFood = () => {
    setsearchVisiblity(!searchVisiblity);
  };

  //To reset scroll to top
  useEffect(() => {
    if (searchVisiblity) {
      const box = document.getElementById("big-box");

      box.scrollTop = 0;
    }
  }, [searchVisiblity]);

  // const [addCal, setaddCal] = useState(0);
  // const [addcals, setaddcals] = useState(0);
  const [quantity, setquantity] = useState("");
  // const [selectedFood, setselectedFood] = useState([]);
  // const [foodCals, setfoodCals] = useState(0);

  // const [update, setupdate] = useState(false);
  const [foodArray, setfoodArray] = useState([]);

  const [indexFood, setindexFood] = useState(0);

  const [newfood, setnewfood] = useState([]);
  const setFood = (index) => {
    console.log(`Index = ${index}`);
    console.log(foodselection);
    const selectedFood = food[index];
    if (selectedFood) {
      const newFood = { ...selectedFood, quantity };

      // Update newfood state
      setnewfood((prevNewFood) => {
        const updatedNewFood = [...prevNewFood, newFood];
        return updatedNewFood;
      });

      // Update foodArray state
      setfoodArray((prevFoodArray) => {
        const updatedFoodArray = [...prevFoodArray, newFood];
        console.log("Updated foodArray: ", updatedFoodArray);
        return updatedFoodArray;
      });
      setquantity("");
      console.log("New Food Added: ", newFood);
    }
  };

  // Log newfood state updates
  useEffect(() => {
    console.log("newfood state: ", newfood);
  }, [newfood]);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    const storeData = async () => {
      let response = await fetch("http://localhost:3000/store", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setnewfood(data);
        setIsFirstLoad(false);
        console.log(data);
      }
    };

    storeData();
  }, []);

  useEffect(() => {
    if (isFirstLoad) return;
    const storeData = async () => {
      await fetch("http://localhost:3000/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ array: newfood }),
      });
    };

    storeData();
  }, [newfood]);

  useEffect(() => {
    console.log(newfood);
    let totalCalories = 0;
    let totalProteins = 0;
    let totalFats = 0;
    let totalCarbs = 0;
    let totalVA = 0;
    let totalVB = 0;
    let totalVC = 0;
    let totalVE = 0;
    let totalVK = 0;
    let totalIron = 0;
    let totalCalcium = 0;
    let totalMagnesium = 0;

    newfood.forEach((food) => {
      const qty = food.quantity;
      totalCalories += Math.round((food.calories || 0) * qty);
      totalProteins += Math.round((food.proteins || 0) * qty);
      totalFats += Math.round((food.fats || 0) * qty);
      totalCarbs += Math.round((food.carbohydrates || 0) * qty);
      totalVA += Math.round((food.vA || 0) * qty);
      totalVB += (food.vB || 0) * qty;
      const roundedVB = totalVB.toFixed(1);
      totalVC += Math.round((food.vC || 0) * qty);
      totalVE += Math.round((food.vE || 0) * qty);
      totalVK += Math.round((food.vK || 0) * qty);
      totalIron += Math.round((food.iron || 0) * qty);
      totalCalcium += Math.round((food.calcium || 0) * qty);
      totalMagnesium += Math.round((food.magnesium || 0) * qty);
      console.log(totalCalories);

      settcalories(totalCalories);
      settproteins(totalProteins);
      settfats(totalFats);
      settcarbs(totalCarbs);
      settVA(totalVA);
      settVB(roundedVB);
      settVC(totalVC);
      settVE(totalVE);
      settVK(totalVK);
      settIron(totalIron);
      settCalcium(totalCalcium);
      settMagnesium(totalMagnesium);
    });
  }, [newfood]);

  const [tcalories, settcalories] = useState(0);
  const [tproteins, settproteins] = useState(0);
  const [tfats, settfats] = useState(0);
  const [tcarbs, settcarbs] = useState(0);
  const [tVA, settVA] = useState(0);
  const [tVB, settVB] = useState(0);
  const [tVC, settVC] = useState(0);
  const [tVE, settVE] = useState(0);
  const [tVK, settVK] = useState(0);
  const [tIron, settIron] = useState(0);
  const [tCalcium, settCalcium] = useState(0);
  const [tMagnesium, settMagnesium] = useState(0);

  const recalculateTotals = (updated) => {
    console.log(newfood);
    let totalCalories = 0;
    let totalProteins = 0;
    let totalFats = 0;
    let totalCarbs = 0;
    let totalVA = 0;
    let totalVB = 0;
    let totalVC = 0;
    let totalVE = 0;
    let totalVK = 0;
    let totalIron = 0;
    let totalCalcium = 0;
    let totalMagnesium = 0;

    updated.forEach((food) => {
      const qty = food.quantity;
      totalCalories += Math.round((food.calories || 0) * qty);
      totalProteins += Math.round((food.proteins || 0) * qty);
      totalFats += Math.round((food.fats || 0) * qty);
      totalCarbs += Math.round((food.carbohydrates || 0) * qty);
      totalVA += Math.round((food.vA || 0) * qty);
      totalVB += Math.round((food.vB || 0) * qty);
      totalVC += Math.round((food.vC || 0) * qty);
      totalVE += Math.round((food.vE || 0) * qty);
      totalVK += Math.round((food.vK || 0) * qty);
      totalIron += Math.round((food.iron || 0) * qty);
      totalCalcium += Math.round((food.calcium || 0) * qty);
      totalMagnesium += Math.round((food.magnesium || 0) * qty);
      console.log(totalCalories);
    });
    settcalories(totalCalories);
    settproteins(totalProteins);
    settfats(totalFats);
    settcarbs(totalCarbs);
    settVA(totalVA);
    settVB(totalVB);
    settVC(totalVC);
    settVE(totalVE);
    settVK(totalVK);
    settIron(totalIron);
    settCalcium(totalCalcium);
    settMagnesium(totalMagnesium);
  };

  const removefood = (rfood) => {
    const nFood = newfood.filter((__, index) => index !== rfood);
    setnewfood(nFood);
    recalculateTotals(nFood);
  };
  const [rotation, setrotation] = useState(false);
  const rotate = () => {
    setrotation(!rotation);
  };

  const [calPercentage, setcalPercentage] = useState(0);
  useEffect(() => {
    console.log(tcalories);
    const percentageCalories = (tcalories / Crequirement) * 100;
    console.log(percentageCalories);
    setcalPercentage(percentageCalories);
  }, [Crequirement, tcalories]);

  const [proPercentage, setproPercentage] = useState(0);
  useEffect(() => {
    const percentageProtein = (tproteins / proteinReq) * 100;
    setproPercentage(percentageProtein);
  }, [tproteins, proteinReq]);

  const [fatsPercentage, setfatsPercentage] = useState(0);
  useEffect(() => {
    const percentageFats = (tfats / fatsreq) * 100;
    setfatsPercentage(percentageFats);
    console.log(percentageFats);
  }, [tfats, fatsreq]);

  const [carbsPercentage, setcarbsPercentage] = useState(0);
  useEffect(() => {
    const percentageCarbs = (tcarbs / carbsreq) * 100;
    setcarbsPercentage(percentageCarbs);
  }, [tcarbs, carbsreq]);

  const [vApercentage, setvApercentage] = useState(0);
  useEffect(() => {
    const A = (tVA / Areq) * 100;
    setvApercentage(A);
  }, [tVA, Areq]);

  const [vBpercentage, setvBpercentage] = useState(0);
  useEffect(() => {
    const B = (tVB / Breq) * 100;
    setvBpercentage(B);
  }, [tVB, Breq]);

  const [vCpercentage, setvCpercentage] = useState(0);
  useEffect(() => {
    const C = (tVC / Creq) * 100;
    setvCpercentage(C);
  }, [tVC, Creq]);

  const [vEpercentage, setvEpercentage] = useState(0);
  useEffect(() => {
    const E = (tVE / 15) * 100;
    setvEpercentage(E);
  }, [tVE]);

  const [vKpercentage, setvKpercentage] = useState(0);
  useEffect(() => {
    const K = (tVK / Kreq) * 100;
    setvKpercentage(K);
  }, [tVK, Kreq]);

  const [ironPercentage, setironPercentage] = useState(0);
  useEffect(() => {
    const percentageIron = (tIron / ireq) * 100;
    setironPercentage(percentageIron);
  }, [tIron, ireq]);

  const [calciumPercentage, setcalciumPercentage] = useState(0);
  useEffect(() => {
    const percentageCalcium = (tCalcium / calciumReq) * 100;
    setcalciumPercentage(percentageCalcium);
  }, [tCalcium, calciumReq]);

  const [magnesiumPercentage, setmagnesiumPercentage] = useState(0);
  useEffect(() => {
    const percentageMagnesium = (tMagnesium / magnesiumReq) * 100;
    setmagnesiumPercentage(percentageMagnesium);
  }, [tMagnesium, magnesiumReq]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loader bg-[#30093f] w-[100vw] h-[100vh] text-lg text-white font-bold flex justify-center items-center">
            Loading...
          </div>
        </div>
      ) : (
        <div className="h-full bg-[#30093f] p-0 m-0 font-dm-sans text-white">
          <DNavbar />
          <div className="flex">
            <SDNavbar />
            <div className="flex justify-center w-full">
              <div className="w-full max-w-screen overflow-hidden">
                <div className=" flex justify-center text-center bg-purple-700">
                  <div className=" font-semibold text-base">
                    Welcome <span className="text-yellow-400">{userName}</span>
                    <p
                      className="cursor-pointer font-light text-sm hover:text-yellow-400"
                      onClick={() => {
                        navigate("/signup/userdata");
                      }}
                    >
                      Click here to edit your info
                    </p>
                  </div>
                </div>
                <div
                  className={`h-96 w-96 absolute  bg-[#1f0729] z-20 rounded-lg left-[50%] top-[50%] -translate-x-1/2  -translate-y-1/2 custom-scrollbar overflow-y-scroll  ${
                    showList ? "block" : "hidden"
                  }`}
                >
                  <div className="relativ rounded shadow-md p-4">
                    <span className="block text-center font-semibold text-lg">
                      Eat List
                    </span>

                    <i
                      className="fa-solid fa-circle-xmark absolute top-2 right-2 text-2xl text-gray-500 cursor-pointer hover:text-red-600"
                      onClick={closeEatList}
                    ></i>

                    <ul className="mt-4 space-y-2">
                      {newfood.map((foods, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-purple-600 text-white rounded p-3"
                        >
                          <p className="flex-1 truncate pl-3">{foods.name}</p>

                          <span className="ml-4">{foods.quantity}</span>

                          {/* Remove Button */}
                          <button
                            className="ml-4 bg-red-600 hover:bg-red-800 text-xs text-white px-2 py-1 rounded-full"
                            onClick={() => removefood(index)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className=" h-1 text-sm bg-purple-950 p-3 mt-6 rounded-full flex justify-center items-center cursor-pointer hover:bg-purple-900"
                    onClick={eatList}
                  >
                    EDIT YOUR EAT LIST
                  </div>
                  <p className="mt-5 font-semibold text-xl">
                    Your <span className="text-yellow-400">Nutrition</span>{" "}
                    Tracker
                  </p>
                  <div className="flex mt-5 w- justify-center ">
                    <div className="flex w-full justify-center">
                      <div className="flex relative">
                        <div
                          className="w-56 h-8 max-md:w-32 max-md:text-[9px] mx-1 rounded-full bg-white cursor-pointer text-black text-xs font-semibold flex items-center justify-between p-3"
                          onClick={() => {
                            searchFood();
                            start();
                            rotate();
                          }}
                        >
                          <p className="opacity-50">{selectFood}</p>
                          <i
                            className={`fa-solid fa-caret-down ${
                              rotation ? "-rotate-180" : "-rotate-0"
                            }`}
                          ></i>
                        </div>
                        <div
                          className={`option absolute w-56 max-h-60 bg-[#61177e] z-10 rounded-lg top-8 p-5 overflow-y-scroll block  ${
                            searchVisiblity ? "block" : "hidden"
                          }`}
                          id="big-box"
                        >
                          <input
                            type="text"
                            placeholder="Search Food"
                            className="outline-none border-[2px] rounded-md text-black p-1 text-sm border-transparent hover:border-yellow-400"
                            value={searchText}
                            onChange={(e) => {
                              const input = e.target.value;
                              searchItems(input);
                            }}
                          />
                          <ul className="text-sm mt-2">
                            {food.map((food, index) => (
                              <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-[#1f0729] rounded text-xs"
                                onClick={() => {
                                  searchFood();
                                  setindexFood(index);
                                  setselectFood(food.name);
                                  rotate();
                                }}
                              >
                                {food.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        placeholder="Enter Quantity"
                        className="w-36 max-md:w-24 max-md:text-[9px] p-2  text-center mx-1 h-8 rounded-full bg-white cursor-pointer text-black text-xs font-semibold outline-none"
                        value={quantity}
                        onInput={(input) => {
                          setquantity(input.target.value);
                          console.log(input.target.value);
                        }}
                      />
                      <button
                        className="w-36 max-md:w-16 h-8 p-3 mx-1 bg-[#1f0729] rounded-full text-center flex items-center justify-center max-md:w-[50%]tify-center hover:bg-[#6a1888]"
                        onClick={(action) => {
                          if (quantity === "") {
                            action.preventDefault();
                            return;
                          }
                          setquantity("");
                          console.log(indexFood);
                          setFood(indexFood);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center w-full ">
                    <div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw]">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Calories
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className={`h-6 bg-[#22072c] rounded-full transition-all duration-500 ease-in-out`}
                            style={{ width: `${calPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tcalories}/{Math.round(Crequirement)}
                        </p>
                      </div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw] ">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Proteins
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className="h-6 bg-[#22072c] rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${proPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tproteins}/{Math.round(proteinReq)}
                        </p>
                      </div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw] ">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Fats
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className="h-6 bg-[#22072c] rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${fatsPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tfats}/{Math.round(fatsreq)}
                        </p>
                      </div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw] ">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Carbohydrates
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className="h-6 bg-[#22072c] rounded-full  transition-all duration-500 ease-in-out"
                            style={{ width: `${carbsPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tcarbs}/{Math.round(carbsreq)}
                        </p>
                      </div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw] ">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Vitamin A
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className="h-6 bg-[#22072c] rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${vApercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tVA}/{Areq}
                        </p>
                      </div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw] ">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Vitamin B
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className="h-6 bg-[#22072c] rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${vBpercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tVB}/{Breq}
                        </p>
                      </div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw] ">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Vitamin C
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className="h-6 bg-[#22072c] rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${vCpercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tVC}/{Creq}
                        </p>
                      </div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw] ">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Vitamin E
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className="h-6 bg-[#22072c] rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${vEpercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tVE}/15
                        </p>
                      </div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw] ">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Vitamin K
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className="h-6 bg-[#22072c] rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${vKpercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tVK}/{Kreq}
                        </p>
                      </div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw] ">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Iron
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className=" h-6 bg-[#22072c] rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${ironPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tIron}/{ireq}
                        </p>
                      </div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw] ">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Calcium
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className="h-6 bg-[#22072c] rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${calciumPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tCalcium}/{calciumReq}
                        </p>
                      </div>
                      <div className="flex justify-start text-sm mt-5 w-[70vw] ">
                        <p className="w-[25%] max-md:w-[30%] max-md:text-[11px]">
                          Magnesium
                        </p>
                        <div className="w-[70%] max-md:w-[50%] h-6 rounded-full bg-[#6a1888] overflow-hidden">
                          <div
                            className="h-6 bg-[#22072c] rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${magnesiumPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-[10%] ml-3 max-md:text-[11px]">
                          {tMagnesium}/400
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NutritionTracker;
