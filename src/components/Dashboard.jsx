import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DNavbar from "./DNavbar";
// import SDNavbar from "./SDNavbar";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://7ec1b82ac30b.ngrok-free.app/getdata",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
        const response = await fetch(
          "https://7ec1b82ac30b.ngrok-free.app/getfood",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
      let response = await fetch("https://7ec1b82ac30b.ngrok-free.app/store", {
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
      await fetch("https://7ec1b82ac30b.ngrok-free.app/store", {
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
            <div className="text-white text-xl font-semibold">
              Loading your dashboard...
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-0 m-0 font-dm-sans text-white relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <DNavbar />
          <div className="flex">
            {/* <SDNavbar /> */}
            <div className="flex justify-center w-full relative z-10">
              <div className="w-full max-w-screen-xl overflow-hidden px-4">
                <div className="flex justify-center text-center bg-gradient-to-r from-purple-600/50 to-blue-600/50 backdrop-blur-sm border-b border-white/10 py-4 rounded-lg mt-4">
                  <div className="font-semibold text-lg px-2">
                    Welcome back,{" "}
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-bold">
                      {userName}
                    </span>
                    <p
                      className="cursor-pointer font-light text-sm hover:text-yellow-400 transition-colors duration-300 mt-1"
                      onClick={() => {
                        navigate("/signup/userdata");
                      }}
                    >
                      ✏️ Edit your profile
                    </p>
                  </div>
                </div>
                {showList && (
                  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto border border-white/20">
                      <div className="relative rounded shadow-md p-6">
                        <span className="block text-center font-bold text-xl text-slate-800 mb-4">
                          Eat List
                        </span>

                        <i
                          className="fa-solid fa-circle-xmark absolute top-4 right-4 text-2xl text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-300"
                          onClick={closeEatList}
                        ></i>

                        <ul className="mt-4 space-y-2">
                          {newfood.length > 0 ? (
                            newfood.map((foods, index) => (
                              <li
                                key={index}
                                className="flex justify-between items-center bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl p-4 shadow-lg"
                              >
                                <p className="flex-1 truncate pl-3">
                                  {foods.name}
                                </p>

                                <span className="ml-4 bg-white/20 px-2 py-1 rounded-full text-sm">
                                  {foods.quantity}
                                </span>

                                {/* Remove Button */}
                                <button
                                  className="ml-4 bg-red-500 hover:bg-red-600 text-xs text-white px-3 py-1 rounded-full transition-colors duration-300 shadow-md"
                                  onClick={() => removefood(index)}
                                >
                                  Remove
                                </button>
                              </li>
                            ))
                          ) : (
                            <p className="text-center text-gray-500 py-4">
                              No food items added yet
                            </p>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm px-6 py-3 mt-8 rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-purple-500/25 font-medium"
                    onClick={eatList}
                  >
                    📝 MANAGE YOUR MEALS
                  </div>
                  <h2 className="mt-8 font-bold text-3xl text-center px-4">
                    Your{" "}
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      Nutrition
                    </span>{" "}
                    Tracker
                  </h2>
                  <div className="flex mt-8 w-full justify-center px-4">
                    <div className="flex flex-col sm:flex-row w-full max-w-2xl justify-center items-center gap-2">
                      <div className="flex relative w-full sm:w-auto">
                        <div
                          className="w-full sm:w-64 h-12 rounded-xl bg-white/90 backdrop-blur-sm cursor-pointer text-slate-800 text-sm font-semibold flex items-center justify-between px-4 shadow-lg border border-white/20 hover:bg-white transition-all duration-300"
                          onClick={() => {
                            searchFood();
                            start();
                            rotate();
                          }}
                        >
                          <p className="text-slate-600 truncate">
                            {selectFood}
                          </p>
                          <i
                            className={`fa-solid fa-caret-down text-slate-600 transition-transform duration-300 ${
                              rotation ? "-rotate-180" : "-rotate-0"
                            }`}
                          ></i>
                        </div>
                        <div
                          className={`option absolute w-full sm:w-64 max-h-60 bg-white/95 backdrop-blur-sm z-20 rounded-xl top-14 p-4 overflow-y-scroll shadow-2xl border border-white/20 ${
                            searchVisiblity ? "block" : "hidden"
                          }`}
                          id="big-box"
                        >
                          <input
                            type="text"
                            placeholder="Search Food"
                            className="w-full outline-none border-2 rounded-lg text-slate-800 p-3 text-sm border-gray-200 focus:border-yellow-400 transition-colors duration-300 bg-white/80"
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
                                className="p-3 cursor-pointer hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white rounded-lg text-slate-700 transition-all duration-300"
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
                        className="w-full sm:w-40 p-3 text-center h-12 rounded-xl bg-white/90 backdrop-blur-sm text-slate-800 text-sm font-semibold outline-none border border-white/20 focus:border-yellow-400 transition-all duration-300 shadow-lg"
                        value={quantity}
                        onInput={(input) => {
                          setquantity(input.target.value);
                          console.log(input.target.value);
                        }}
                      />
                      <button
                        className="w-full sm:w-32 h-12 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-xl text-center flex items-center justify-center font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
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
                        ➕ Add
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center w-full mt-12 px-4">
                    <div className="w-full max-w-4xl">
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-6 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-yellow-400 mb-2 xs:mb-0">
                          Calories
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${calPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                          {tcalories}/{Math.round(Crequirement)}
                        </p>
                      </div>
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-blue-400 mb-2 xs:mb-0">
                          Proteins
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${proPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                          {tproteins}/{Math.round(proteinReq)}
                        </p>
                      </div>
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-red-400 mb-2 xs:mb-0">
                          Fats
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${fatsPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                          {tfats}/{Math.round(fatsreq)}
                        </p>
                      </div>
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-green-400 mb-2 xs:mb-0">
                          Carbohydrates
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${carbsPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                          {tcarbs}/{Math.round(carbsreq)}
                        </p>
                      </div>

                      {/* Vitamins Section */}
                      <div className="mt-8 mb-4">
                        <h3 className="text-xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          Vitamins & Minerals
                        </h3>
                      </div>

                      {/* Vitamin A */}
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-blue-400 mb-2 xs:mb-0">
                          Vitamin A
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${vApercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                          {tVA}/{Areq}
                        </p>
                      </div>

                      {/* Vitamin B */}
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-green-400 mb-2 xs:mb-0">
                          Vitamin B
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${vBpercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                          {tVB}/{Breq}
                        </p>
                      </div>

                      {/* Vitamin C */}
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-yellow-400 mb-2 xs:mb-0">
                          Vitamin C
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${vCpercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                          {tVC}/{Creq}
                        </p>
                      </div>

                      {/* Vitamin E */}
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-pink-400 mb-2 xs:mb-0">
                          Vitamin E
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${vEpercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                          {tVE}/15
                        </p>
                      </div>

                      {/* Vitamin K */}
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-purple-400 mb-2 xs:mb-0">
                          Vitamin K
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${vKpercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                          {tVK}/{Kreq}
                        </p>
                      </div>

                      {/* Iron */}
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-red-400 mb-2 xs:mb-0">
                          Iron
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${ironPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                          {tIron}/{ireq}
                        </p>
                      </div>

                      {/* Calcium */}
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-teal-400 mb-2 xs:mb-0">
                          Calcium
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${calciumPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                          {tCalcium}/{calciumReq}
                        </p>
                      </div>

                      {/* Magnesium */}
                      <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="w-full xs:w-1/4 font-semibold text-indigo-400 mb-2 xs:mb-0">
                          Magnesium
                        </p>
                        <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                          <div
                            className="h-6 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${magnesiumPercentage}%` }}
                          ></div>
                        </div>
                        <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
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
