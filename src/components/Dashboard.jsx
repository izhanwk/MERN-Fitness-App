import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DNavbar from "./DNavbar";
import axios from "axios";
import { Loader2 } from "lucide-react";
import debounce from "lodash.debounce";

const API_URL = import.meta.env.VITE_API_URL;

// // Map activity labels (or use numeric factors directly)
// const ACTIVITY = {
//   sedentary: 1.2,
//   lightly_active: 1.375,
//   moderately_active: 1.55,
//   very_active: 1.725,
//   extra_active: 1.9,
// };

// helpers
const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const safePct = (num, den) => (den > 0 ? clamp((num / den) * 100) : 0);

const NutritionTracker = () => {
  const navigate = useNavigate();

  // data
  const [food, setfood] = useState([]);
  const [originalList, setoriginalList] = useState([]);
  // const [foodselection, setfoodselection] = useState([]);
  const [newfood, setnewfood] = useState([]);
  const [initialFood, setinitialFood] = useState([]);
  const sBox = useRef(null);

  // ui
  const [selectFood, setselectFood] = useState("Select Food");
  const [searchText, setsearchText] = useState("");
  const [searchVisiblity, setsearchVisiblity] = useState(false);
  const [showList, setshowList] = useState(false);
  const [rotation, setrotation] = useState(false);
  const [indexFood, setindexFood] = useState(0);
  const [quantity, setquantity] = useState("");
  const [loading, setLoading] = useState(true);

  // user
  const [userData, setuserData] = useState({});
  const [userName, setuserName] = useState("");
  const [page, setpage] = useState(0);

  // normalized/derived user fields (all METRIC: kg + cm)
  const [weight, setweight] = useState(0); // kg
  const [height, setheight] = useState(0); // cm
  const [gender, setgender] = useState(""); // "male" | "female"
  const [dob, setdob] = useState(""); // ISO string or date
  const [mode, setmode] = useState(""); // goal
  const [activity, setactivity] = useState(1.2); // factor number or label

  // requirements
  const [BMR, setBMR] = useState(0); // pure BMR (kcal)
  const [Crequirement, setCrequirement] = useState(0); // target kcal/day (TDEE +/- goal)
  const [proteinReq, setproteinReq] = useState(0); // grams
  const [fatsreq, setfatsreq] = useState(0); // grams
  const [carbsreq, setcarbsreq] = useState(0); // grams

  // micronutrients
  const [Areq, setAreq] = useState(0);
  const [Breq, setBreq] = useState(0);
  const [Creq, setCreq] = useState(0);
  const [Kreq, setKreq] = useState(0);
  const [ireq, setireq] = useState(0);
  const [calciumReq, setcalciumReq] = useState(0);
  const [magnesiumReq, setmagnesiumReq] = useState(0);

  // totals
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

  // bar percentages
  const [calPercentage, setcalPercentage] = useState(0);
  const [proPercentage, setproPercentage] = useState(0);
  const [fatsPercentage, setfatsPercentage] = useState(0);
  const [carbsPercentage, setcarbsPercentage] = useState(0);
  const [vApercentage, setvApercentage] = useState(0);
  const [vBpercentage, setvBpercentage] = useState(0);
  const [vCpercentage, setvCpercentage] = useState(0);
  const [vEpercentage, setvEpercentage] = useState(0);
  const [vKpercentage, setvKpercentage] = useState(0);
  const [ironPercentage, setironPercentage] = useState(0);
  const [calciumPercentage, setcalciumPercentage] = useState(0);
  const [magnesiumPercentage, setmagnesiumPercentage] = useState(0);
  const [searching, setsearching] = useState(false);
  const [loadMore, setloadMore] = useState(false);

  const reachedBottom = useRef(false);
  const mainList = useRef(true);

  useEffect(() => {
    const el = sBox.current;
    if (!el) return;
    console.log("In actual mainList is :", mainList);
    if (!mainList) return;
    const calculateThumb = () => {
      if (reachedBottom.current) {
        return;
      }
      const visible = el.clientHeight; // visible height
      const total = el.scrollHeight; // total content height
      const track = el.offsetHeight; // scrollbar track height
      const thumb = (visible / total) * track; // scrollbar thumb length

      const scrollTop = el.scrollTop; // how much has been scrolled
      const maxScrollTop = total - visible; // max scroll distance

      // position of thumb (from top of track)
      const thumbPosition = (scrollTop / maxScrollTop) * (track - thumb);
      const TOTAL = track - thumb;

      if (thumbPosition >= TOTAL) {
        // reachedBottom = true;
        setpage((prev) => prev + 1);
      }

      // console.log("Total :", TOTAL);
      // console.log("Thumb position from top:", thumbPosition);
    };

    // initial call
    calculateThumb();

    // recalc on scroll
    el.addEventListener("scroll", calculateThumb);

    return () => {
      el.removeEventListener("scroll", calculateThumb);
    };
  }, []);

  useEffect(() => {
    if (searchText !== "") {
      console.log("Mainlist turned False");
      mainList.current = false;
    } else {
      console.log("Mainlist turned True");
      mainList.current = true;
    }
  }, [searchText]);

  // const divClick = useRef(false);
  const fetchingFood = useRef(false);
  const initialFetchingDone = useRef(false);
  // const [start2, setstart2] = useState(false);

  //Fetch Food Function

  const fetchFood = async () => {
    if (initialFetchingDone.current) {
      return;
    }

    // If already fetching, exit early
    if (fetchingFood.current) {
      // console.log("Already fetching, skipping new call");
      return;
    }

    // if (divClick.current) {
    //   // setfood([]);
    //   // setoriginalList([]);
    //   divClick.current = false;
    //   console.log("Divclick is active");
    //   return;
    // }

    // Mark as fetching
    fetchingFood.current = true;
    const axiosGet = async () => {
      try {
        // console.log("This function");
        setsearching(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/getfood2?page=0`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        });

        const data = res.data;

        if (res.status >= 200 && res.status < 300) {
          initialFetchingDone.current = true;
          setfood((prev) => [...prev, ...data]);
          setoriginalList((prev) => [...prev, ...data]);
          // setoriginalList(data);
          // reachedBottom = false;
        } else {
          console.log("Problem while fetching food data");
        }
      } catch (err) {
        console.error("Error in fetchFood:", err);
      } finally {
        setsearching(false);
        // Always reset, even on error
        // divClick.current = true;
        fetchingFood.current = false;
        // setstart2(false);
      }
    };
    axiosGet();
  };

  // useEffect(() => {
  //   if (!start2) {
  //     return;
  //   }
  // }, [start2]);

  const isFirstRender = useRef(true);
  const more = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // skip first render
      return;
    }
    if (!more.current) {
      console.log("No more to fetch");
      return;
    }

    const fetchFood = async () => {
      try {
        const token = localStorage.getItem("token");
        setloadMore(true);
        const res = await axios.get(`${API_URL}/getfood2?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        });

        if (res.status >= 200 && res.status < 300) {
          const data = res.data;
          setfood((prev) => [...prev, ...data]);
          setoriginalList((prev) => [...prev, ...data]);
          // setfoodselection((prev) => [...prev, ...data]);

          if (data.length > 0) {
            if (!data[0].showMore) {
              more.current = false;
            }
            reachedBottom.current = false;
          }
        } else {
          console.log("Problem while fetching food data");
        }
      } catch (err) {
        console.error("Error in fetchFood:", err);
      } finally {
        setloadMore(false);
      }
    };

    fetchFood();
  }, [page]);

  // const [empty, setempty] = useState(false);
  // useEffect(() => {
  //   if (food.length < 1) {
  //     setempty(true);
  //   }
  // }, [food]);

  // load user + food
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/getdata`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        });
        const data = res.data;
        // if (res.status < 200 || res.status >= 300) {
        //   alert("Token expired");
        //   navigate("/signin");
        //   return;
        // }
        setuserData((prev) => ({ ...prev, ...data }));
        setmode(data.mode);
        setuserName(data.name || "");
      } catch (err) {
        console.error("Error in fetchData:", err);
      }
    };

    const fetchFood = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/getfood`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        });
        const data = res.data;
        if (res.status >= 200 && res.status < 300) {
          setfood(data);
          // setfoodselection((prev) => [...prev, ...data]);
          // setoriginalList(data);
        } else {
          console.log("Problem while fetching food data");
        }
      } catch (err) {
        console.error("Error in fetchFood:", err);
      }
    };

    (async () => {
      await fetchData();
      // await fetchFood();
      setLoading(false);
    })();
  }, [navigate]);

  // normalize user fields to METRIC (kg + cm) + gender/activity/dob
  useEffect(() => {
    setdob(userData?.date || "");

    // weight
    if (userData?.weightScale === "Kgs" || userData?.weightScale === "kg") {
      setweight(Number(userData?.weight || 0)); // kg
    } else {
      // assume pounds
      setweight(Number(userData?.weight || 0) * 0.453592); // lb -> kg
    }

    // height
    if (userData?.lengthScale === "ft") {
      setheight(Number(userData?.height || 0) * 30.48); // ft -> cm
    } else if (userData?.lengthScale === "in") {
      setheight(Number(userData?.height || 0) * 2.54); // in -> cm
    } else {
      setheight(Number(userData?.height || 0)); // assume cm
    }

    setgender(userData?.gender || "");
    setactivity(userData?.activity); // could be label or number
  }, [userData]);

  // compute age once (memo) from dob
  const userAge = useMemo(() => {
    if (!dob) return 0;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return 0;
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }, [dob]);

  // protein (g/day) — with kg input use 1.6 g/kg (~0.73 g/lb)
  useEffect(() => {
    setproteinReq(Number(weight || 0) * 1.6);
  }, [weight]);

  // micronutrient targets by age/gender (kept similar to your logic)
  useEffect(() => {
    if (gender === "male") setAreq(900 * 3.33);
    if (gender === "female") setAreq(700 * 3.33);
  }, [gender]);

  useEffect(() => {
    if (gender === "male") setBreq(1.2);
    if (gender === "female") setBreq(1.1);
  }, [gender]);

  useEffect(() => {
    if (gender === "male") setCreq(90);
    if (gender === "female") setCreq(75);
  }, [gender]);

  useEffect(() => {
    if (userAge < 19) setKreq(75);
    else {
      if (gender === "male") setKreq(120);
      if (gender === "female") setKreq(90);
    }
  }, [userAge, gender]);

  useEffect(() => {
    if (userAge < 19) {
      if (gender === "male") setireq(11);
      if (gender === "female") setireq(15);
    } else if (userAge >= 19 && userAge < 51) {
      if (gender === "male") setireq(8);
      if (gender === "female") setireq(18);
    } else if (userAge >= 51) {
      setireq(8);
    }
  }, [userAge, gender]);

  useEffect(() => {
    if (userAge < 19) {
      if (gender === "male") setmagnesiumReq(410);
      if (gender === "female") setmagnesiumReq(360);
    } else if (userAge >= 19 && userAge < 31) {
      if (gender === "male") setmagnesiumReq(400);
      if (gender === "female") setmagnesiumReq(310);
    } else {
      if (gender === "male") setmagnesiumReq(420);
      if (gender === "female") setmagnesiumReq(320);
    }
  }, [userAge, gender]);

  useEffect(() => {
    if (userAge < 19) setcalciumReq(1300);
    else if (userAge >= 19 && userAge < 51) setcalciumReq(1000);
    else if (userAge >= 51) setcalciumReq(gender === "female" ? 1200 : 1000);
  }, [userAge, gender]);

  // BMR (metric) -> TDEE -> target calories (apply goal to TDEE)
  useEffect(() => {
    if (!gender || !weight || !height || !userAge) return;

    // Mifflin-St Jeor (metric)
    const bmrVal =
      gender === "male"
        ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * userAge
        : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * userAge;

    const tdee = bmrVal * activity;

    let target = tdee;
    if (mode === "Moderate Musclegain") target += 400;
    else if (mode === "Fast Musclegain") target += 750;
    else if (mode === "Moderate fatloss") target -= 500;
    else if (mode === "Fast fatloss") target -= 800;

    setBMR(Math.round(bmrVal)); // pure BMR
    setCrequirement(Math.round(target)); // daily target kcal
  }, [gender, weight, height, userAge, activity, mode]);

  // fats 30% calories, carbs = remaining
  useEffect(() => {
    const fatsG = (Crequirement * 0.3) / 9;
    setfatsreq(fatsG);
  }, [Crequirement]);

  useEffect(() => {
    const proteinCal = proteinReq * 4;
    const fatsCal = fatsreq * 9;
    const carbsG = (Crequirement - (fatsCal + proteinCal)) / 4;
    setcarbsreq(carbsG > 0 ? carbsG : 0);
  }, [proteinReq, fatsreq, Crequirement]);

  // userName display
  useEffect(() => {
    setuserName(userData?.name || "");
  }, [userData]);

  const searchFood = () => {
    setsearchVisiblity((v) => !v);
    sBox.current.scrollTop = 0;
  };
  const rotate = () => setrotation((r) => !r);

  // search list
  const isSearching = useRef(false);
  const onlineSearch = useRef(false);

  const debouncedApiSearch = useMemo(
    () =>
      debounce(async (query) => {
        try {
          setfood([]);
          setsearching(true);
          onlineSearch.current = true;
          const token = localStorage.getItem("token");
          const response = await axios.get(`${API_URL}/search?text=${query}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          });
          if (onlineSearch.current) {
            setfood(response.data);
          }
        } catch (error) {
          console.error("Error while searching food:", error);
        } finally {
          setsearching(false);
        }
      }, 400),
    []
  );

  useEffect(() => {
    return () => {
      debouncedApiSearch.cancel();
    };
  }, [debouncedApiSearch]);

  useEffect(() => {
    console.log("Updated food : ", food);
    console.log("Updated original list : ", originalList);
  }, [food, originalList]);

  const searchItems = (input) => {
    setsearchText(input);
    if (input !== "") {
      onlineSearch.current = false;
      console.log("No input");
    }
    if (!input) {
      isSearching.current = false;
      debouncedApiSearch.cancel();
      return setfood(originalList);
    }

    isSearching.current = true;
    const listToSearch = originalList.length > 0 ? originalList : food;
    const loweredInput = input.toLowerCase();
    const filtered = listToSearch.filter((item) =>
      Object.values(item).join("").toLowerCase().includes(loweredInput)
    );

    if (filtered.length > 0) {
      debouncedApiSearch.cancel();
      setfood(filtered);
      return;
    }

    debouncedApiSearch(input);
  };

  const eatList = () => setshowList(true);
  const closeEatList = () => setshowList(false);

  // const boxRef = useRef(null); // reference to the div

  // useEffect(() => {
  //   console.log("Search Visibility : ", searchVisiblity);
  // }, [searchVisiblity]);

  const Box = useRef(false);
  useEffect(() => {
    if (searchVisiblity) {
      setsearchText("");
      setfood(originalList);
      sBox.current.scrollTop = 0;
    }
    // Function to handle clicks outside
    const handleClickOutside = (event) => {
      // If the click target is NOT inside our div
      if (
        searchVisiblity &&
        sBox.current &&
        !sBox.current.contains(event.target) &&
        !Box.current.contains(event.target)
      ) {
        rotate();
        setsearchVisiblity(false);
      }
    };

    // Listen for all clicks on the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchVisiblity]);

  // initial load: restore stored foods
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/store`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        });
        if (res.status >= 200 && res.status < 300) {
          const data = res.data;
          setinitialFood(data || []);
          setIsFirstLoad(false);
        }
      } catch (e) {
        console.error("GET /store error", e);
      }
    })();
  }, []);

  // persist foods when changed (skip first load)
  useEffect(() => {
    if (isFirstLoad) return;
    (async () => {
      try {
        setLoading(true);

        await axios.post(
          `${API_URL}/store`,
          { array: initialFood },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "ngrok-skip-browser-warning": "true",
            },
            validateStatus: () => true,
          }
        );
        setnewfood(initialFood);
        setLoading(false);
      } catch (e) {
        console.error("POST /store error", e);

        setLoading(false);
      }
    })();
  }, [initialFood, isFirstLoad]);

  // add food
  const setFood = (index) => {
    const selectedFood = food[index];
    if (!selectedFood) return;
    if (quantity === "" || Number(quantity) <= 0) return;

    const newItem = { ...selectedFood, quantity: Number(quantity) };
    setinitialFood((prev) => [...prev, newItem]);
    setquantity("");
  };

  // recalc totals whenever newfood changes
  useEffect(() => {
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

    for (const f of newfood) {
      const qty = Number(f.quantity || 0);
      totalCalories += Math.round((f.calories || 0) * qty);
      totalProteins += Math.round((f.proteins || 0) * qty);
      totalFats += Math.round((f.fats || 0) * qty);
      totalCarbs += Math.round((f.carbohydrates || 0) * qty);
      totalVA += Math.round((f.vA || 0) * qty);
      totalVB += Number((f.vB || 0) * qty);
      totalVC += Math.round((f.vC || 0) * qty);
      totalVE += Math.round((f.vE || 0) * qty);
      totalVK += Math.round((f.vK || 0) * qty);
      totalIron += Math.round((f.iron || 0) * qty);
      totalCalcium += Math.round((f.calcium || 0) * qty);
      totalMagnesium += Math.round((f.magnesium || 0) * qty);
    }

    settcalories(totalCalories);
    settproteins(totalProteins);
    settfats(totalFats);
    settcarbs(totalCarbs);
    settVA(totalVA);
    settVB(Number(totalVB.toFixed(1)));
    settVC(totalVC);
    settVE(totalVE);
    settVK(totalVK);
    settIron(totalIron);
    settCalcium(totalCalcium);
    settMagnesium(totalMagnesium);
  }, [newfood]);

  // remove food
  const removefood = (idx) => {
    setinitialFood((prev) => prev.filter((_, i) => i !== idx));
  };

  // percentages (guard divide-by-zero)
  useEffect(
    () => setcalPercentage(safePct(tcalories, Crequirement)),
    [tcalories, Crequirement]
  );
  useEffect(
    () => setproPercentage(safePct(tproteins, proteinReq)),
    [tproteins, proteinReq]
  );
  useEffect(() => setfatsPercentage(safePct(tfats, fatsreq)), [tfats, fatsreq]);
  useEffect(
    () => setcarbsPercentage(safePct(tcarbs, carbsreq)),
    [tcarbs, carbsreq]
  );
  useEffect(() => setvApercentage(safePct(tVA, Areq)), [tVA, Areq]);
  useEffect(() => setvBpercentage(safePct(tVB, Breq)), [tVB, Breq]);
  useEffect(() => setvCpercentage(safePct(tVC, Creq)), [tVC, Creq]);
  useEffect(() => setvEpercentage(safePct(tVE, 15)), [tVE]);
  useEffect(() => setvKpercentage(safePct(tVK, Kreq)), [tVK, Kreq]);
  useEffect(() => setironPercentage(safePct(tIron, ireq)), [tIron, ireq]);
  useEffect(
    () => setcalciumPercentage(safePct(tCalcium, calciumReq)),
    [tCalcium, calciumReq]
  );
  useEffect(
    () => setmagnesiumPercentage(safePct(tMagnesium, magnesiumReq)),
    [tMagnesium, magnesiumReq]
  );

  // const scrollup = () => {
  //   sBox.current.scrollTop = 0;
  // };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-black/40 backdrop-blur-md z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
            <div className="text-white text-xl font-semibold">
              Loading your dashboard...
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-0 m-0 font-dm-sans text-white relative overflow-hidden">
        {/* background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <DNavbar />

        <div className="flex">
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
                    onClick={() => navigate("/edit")}
                  >
                    ✏️ Edit your profile
                  </p>
                </div>
              </div>

              {/* Manage meals modal */}
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

              {/* Controls */}
              <div className="flex flex-col items-center">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm px-6 py-3 mt-8 rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-purple-500/25 font-medium"
                  onClick={() => setshowList(true)}
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

                {/* Search / Add */}
                <div className="flex mt-8 w-full justify-center px-4">
                  <div className="flex flex-col sm:flex-row w-full max-w-2xl justify-center items-center gap-2">
                    <div className="flex relative w-full sm:w-auto">
                      <div
                        className="w-full sm:w-64 h-12 rounded-xl bg-white/90 backdrop-blur-sm cursor-pointer text-slate-800 text-sm font-semibold flex items-center justify-between px-4 shadow-lg border border-white/20 hover:bg-white transition-all duration-300"
                        ref={Box}
                        onClick={() => {
                          searchFood();
                          // start();
                          rotate();
                          fetchFood();
                          // scrollup();
                        }}
                      >
                        <p className="text-slate-600 truncate">{selectFood}</p>
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
                        ref={sBox}
                        id="big-box"
                      >
                        <input
                          type="text"
                          placeholder="Search Food"
                          className="w-full outline-none border-2 rounded-lg text-slate-800 p-3 text-sm border-gray-200 focus:border-yellow-400 transition-colors duration-300 bg-white/80"
                          value={searchText}
                          onChange={(e) => searchItems(e.target.value)}
                        />
                        <ul className="text-sm mt-2">
                          {/* {empty && (
                            <li className="p-3 flex justify-center items-center text-black opacity-50">
                              No Item Found
                            </li>
                          )} */}
                          {searching && (
                            <li className="p-3 flex justify-center items-center">
                              <Loader2 className="animate-spin text-blue-500" />
                            </li>
                          )}
                          {food.map((f, index) => (
                            <li
                              key={index}
                              className="p-3 cursor-pointer hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white rounded-lg text-slate-700 transition-all duration-300"
                              onClick={() => {
                                searchFood();
                                setindexFood(index);
                                setselectFood(f.name);
                                rotate();
                              }}
                            >
                              {f.name}
                            </li>
                          ))}
                          {loadMore && (
                            <li className="p-3 flex justify-center items-center">
                              <Loader2 className="animate-spin text-blue-500" />
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <input
                      type="number"
                      min="0"
                      placeholder="Enter Quantity"
                      className="w-full sm:w-40 p-3 text-center h-12 rounded-xl bg-white/90 backdrop-blur-sm text-slate-800 text-sm font-semibold outline-none border border-white/20 focus:border-yellow-400 transition-all duration-300 shadow-lg"
                      value={quantity}
                      onInput={(e) => setquantity(e.target.value)}
                    />

                    <button
                      className="w-full sm:w-32 h-12 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-xl text-center flex items-center justify-center font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                      onClick={(e) => {
                        if (!quantity || Number(quantity) <= 0) {
                          e.preventDefault();
                          return;
                        }
                        setFood(indexFood);
                      }}
                    >
                      ➕ Add
                    </button>
                  </div>
                </div>

                {/* Bars */}
                <div className="flex justify-center w-full mt-12 px-4">
                  <div className="w-full max-w-4xl">
                    {/* Calories */}
                    <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-6 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <p className="w-full xs:w-1/4 font-semibold text-yellow-400 mb-2 xs:mb-0">
                        Calories
                      </p>
                      <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                        <div
                          className="h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${calPercentage}%` }}
                        />
                      </div>
                      <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                        {tcalories}/{Math.round(Crequirement)}
                      </p>
                    </div>

                    {/* Proteins */}
                    <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <p className="w-full xs:w-1/4 font-semibold text-blue-400 mb-2 xs:mb-0">
                        Proteins
                      </p>
                      <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                        <div
                          className="h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${proPercentage}%` }}
                        />
                      </div>
                      <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                        {tproteins}/{Math.round(proteinReq)}
                      </p>
                    </div>

                    {/* Fats */}
                    <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <p className="w-full xs:w-1/4 font-semibold text-red-400 mb-2 xs:mb-0">
                        Fats
                      </p>
                      <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                        <div
                          className="h-6 bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${fatsPercentage}%` }}
                        />
                      </div>
                      <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                        {tfats}/{Math.round(fatsreq)}
                      </p>
                    </div>

                    {/* Carbs */}
                    <div className="flex flex-col xs:flex-row justify-start items-center text-base mt-4 w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <p className="w-full xs:w-1/4 font-semibold text-green-400 mb-2 xs:mb-0">
                        Carbohydrates
                      </p>
                      <div className="w-full xs:w-3/5 h-6 rounded-full bg-gray-700 overflow-hidden shadow-inner">
                        <div
                          className="h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${carbsPercentage}%` }}
                        />
                      </div>
                      <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                        {tcarbs}/{Math.round(carbsreq)}
                      </p>
                    </div>

                    {/* Vitamins & Minerals */}
                    <div className="mt-8 mb-4">
                      <h3 className="text-xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Vitamins &amp; Minerals
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
                        />
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
                        />
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
                        />
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
                        />
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
                        />
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
                        />
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
                        />
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
                        />
                      </div>
                      <p className="w-full xs:w-1/5 mt-2 xs:mt-0 xs:ml-4 font-semibold text-right">
                        {tMagnesium}/{magnesiumReq}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* end */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NutritionTracker;
