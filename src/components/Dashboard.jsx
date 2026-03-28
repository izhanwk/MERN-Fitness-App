import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DNavbar from "./DNavbar";
import axios from "axios";
import {
  Apple,
  Bone,
  ChevronDown,
  Droplets,
  Drumstick,
  Flame,
  Leaf,
  ListChecks,
  Loader2,
  PencilLine,
  Pill,
  Plus,
  Salad,
  ShieldPlus,
  Sparkles,
  Sun,
  Zap,
  Wheat,
  X,
  Trash2,
  Search,
} from "lucide-react";
import debounce from "lodash.debounce";
import Footer from "./Footer";

const API_URL = import.meta.env.VITE_API_URL;
const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const safePct = (num, den) => (den > 0 ? clamp((num / den) * 100) : 0);

/* ── Sub-components ── */

const NutrientBar = ({ label, value, target, pct, color }) => (
  <div className="group flex items-center gap-3 sm:gap-4 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 sm:px-5 sm:py-4 transition-all duration-300 hover:bg-white/8 hover:border-white/15">
    <div className="w-24 sm:w-28 shrink-0">
      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/50 group-hover:text-white/70 transition-colors duration-200">
        {label}
      </p>
    </div>
    <div className="flex-1 min-w-0">
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 10px ${color}44`,
          }}
        />
      </div>
    </div>
    <div className="w-20 sm:w-24 shrink-0 text-right">
      <span className="text-[10px] sm:text-xs font-bold text-white/80">
        {value}
        <span className="text-white/35">/{target}</span>
      </span>
    </div>
    <div
      className="hidden sm:block w-10 shrink-0 text-right text-[11px] font-bold tabular-nums"
      style={{ color: pct >= 100 ? "#4ade80" : "#64748b" }}
    >
      {Math.round(pct)}%
    </div>
  </div>
);

const MacroCard = ({ label, value, target, accent, gradient, icon: Icon }) => {
  const pct = clamp(target > 0 ? (value / target) * 100 : 0);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/9 hover:-translate-y-0.5">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${accent}18 0%, transparent 65%)`,
        }}
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl"
            style={{ background: `${accent}22` }}
          >
            <Icon className="h-4 w-4" style={{ color: accent }} />
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            {label}
          </span>
        </div>
        <div>
          <p
            className="text-xl sm:text-2xl font-black tabular-nums"
            style={{ color: accent }}
          >
            {value}
          </p>
          <p className="text-[10px] text-white/35 mt-0.5">of {target}</p>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${pct}%`, background: gradient }}
          />
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, label, iconColor }) => (
  <div className="flex items-center gap-3 mb-3 mt-8">
    <div
      className="flex h-8 w-8 items-center justify-center rounded-xl"
      style={{ background: `${iconColor}20` }}
    >
      <Icon className="h-4 w-4" style={{ color: iconColor }} />
    </div>
    <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/45">
      {label}
    </h3>
    <div className="flex-1 h-px bg-white/8" />
  </div>
);

/* ── Main ── */
const NutritionTracker = () => {
  const navigate = useNavigate();

  const [food, setfood] = useState([]);
  const [originalList, setoriginalList] = useState([]);
  const [newfood, setnewfood] = useState([]);
  const [initialFood, setinitialFood] = useState([]);
  const sBox = useRef(null);

  const [selectFood, setselectFood] = useState("Select Food");
  const [searchText, setsearchText] = useState("");
  const [searchVisiblity, setsearchVisiblity] = useState(false);
  const [foodSearchInitialized, setFoodSearchInitialized] = useState(false);
  const [showList, setshowList] = useState(false);
  const [rotation, setrotation] = useState(false);
  const [indexFood, setindexFood] = useState(0);
  const [quantity, setquantity] = useState("");
  const [loading, setLoading] = useState(true);

  const [userData, setuserData] = useState({});
  const [userName, setuserName] = useState("");
  const [page, setpage] = useState(0);

  const [weight, setweight] = useState(0);
  const [height, setheight] = useState(0);
  const [gender, setgender] = useState("");
  const [dob, setdob] = useState("");
  const [mode, setmode] = useState("");
  const [activity, setactivity] = useState(1.2);

  const [BMR, setBMR] = useState(0);
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
  const [empty, setempty] = useState(false);
  const skipNextStoreSync = useRef(false);
  const [userBootstrapped, setUserBootstrapped] = useState(false);
  const [storeBootstrapped, setStoreBootstrapped] = useState(false);
  const reachedBottom = useRef(false);
  const mainList = useRef(true);

  useEffect(() => {
    const el = sBox.current;
    if (!el) return;
    const calc = () => {
      if (
        !foodSearchInitialized ||
        !searchVisiblity ||
        reachedBottom.current ||
        !mainList.current
      )
        return;
      const visible = el.clientHeight,
        total = el.scrollHeight,
        track = el.offsetHeight;
      const thumb = (visible / total) * track;
      const thumbPos = (el.scrollTop / (total - visible)) * (track - thumb);
      if (thumbPos >= track - thumb) setpage((p) => p + 1);
    };
    calc();
    el.addEventListener("scroll", calc);
    return () => el.removeEventListener("scroll", calc);
  }, [foodSearchInitialized, searchVisiblity]);

  useEffect(() => {
    mainList.current = searchText === "";
  }, [searchText]);

  const fetchingFood = useRef(false);
  const initialFetchingDone = useRef(false);

  const fetchFood = async () => {
    if (initialFetchingDone.current || fetchingFood.current) return;
    fetchingFood.current = true;
    try {
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
      setempty(data.length === 0);
      if (res.status >= 200 && res.status < 300) {
        initialFetchingDone.current = true;
        setfood((p) => [...p, ...data]);
        setoriginalList((p) => [...p, ...data]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setsearching(false);
      fetchingFood.current = false;
    }
  };

  const isFirstRender = useRef(true);
  const more = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!foodSearchInitialized || !more.current) return;
    (async () => {
      try {
        setloadMore(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/getfood2?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        });
        if (res.status >= 200 && res.status < 300) {
          const data = res.data;
          setfood((p) => [...p, ...data]);
          setoriginalList((p) => [...p, ...data]);
          if (data.length > 0 && !data[0].showMore) more.current = false;
          reachedBottom.current = false;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setloadMore(false);
      }
    })();
  }, [page]);

  useEffect(() => {
    (async () => {
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
        setuserData((p) => ({ ...p, ...data }));
        setmode(data.mode);
        setuserName(data.name || "");
      } catch (err) {
        console.error(err);
      } finally {
        setUserBootstrapped(true);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    setdob(userData?.date || "");
    setweight(
      userData?.weightScale === "Kgs" || userData?.weightScale === "kg"
        ? Number(userData?.weight || 0)
        : Number(userData?.weight || 0) * 0.453592,
    );
    setheight(
      userData?.lengthScale === "ft"
        ? Number(userData?.height || 0) * 30.48
        : userData?.lengthScale === "in"
          ? Number(userData?.height || 0) * 2.54
          : Number(userData?.height || 0),
    );
    setgender(userData?.gender || "");
    setactivity(userData?.activity);
  }, [userData]);

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

  useEffect(() => {
    setproteinReq(Number(weight || 0) * 1.6);
  }, [weight]);
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
    } else setireq(8);
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
    else setcalciumReq(gender === "female" ? 1200 : 1000);
  }, [userAge, gender]);

  useEffect(() => {
    if (!gender || !weight || !height || !userAge) return;
    const bmr =
      gender === "male"
        ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * userAge
        : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * userAge;
    const tdee = bmr * activity;
    let target = tdee;
    if (mode === "Moderate Musclegain") target += 400;
    else if (mode === "Fast Musclegain") target += 750;
    else if (mode === "Moderate fatloss") target -= 500;
    else if (mode === "Fast fatloss") target -= 800;
    setBMR(Math.round(bmr));
    setCrequirement(Math.round(target));
  }, [gender, weight, height, userAge, activity, mode]);

  useEffect(() => {
    setfatsreq((Crequirement * 0.3) / 9);
  }, [Crequirement]);
  useEffect(() => {
    const c = (Crequirement - (fatsreq * 9 + proteinReq * 4)) / 4;
    setcarbsreq(c > 0 ? c : 0);
  }, [proteinReq, fatsreq, Crequirement]);

  useEffect(() => {
    setuserName(userData?.name || "");
  }, [userData]);

  const searchFood = () => {
    setsearchVisiblity((v) => !v);
    if (sBox.current) sBox.current.scrollTop = 0;
  };
  const rotate = () => setrotation((r) => !r);

  const isSearching = useRef(false);
  const onlineSearch = useRef(false);
  const latestQueryRef = useRef("");

  const debouncedApiSearch = useMemo(
    () =>
      debounce(async (query) => {
        if (query !== latestQueryRef.current || query.trim() === "") return;
        try {
          setfood([]);
          setempty(false);
          setsearching(true);
          onlineSearch.current = true;
          const token = localStorage.getItem("token");
          const response = await axios.get(`${API_URL}/search?text=${query}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          });
          const data = response.data;
          if (query !== latestQueryRef.current) return;
          setempty(data.length === 0 && query !== "");
          if (onlineSearch.current) setfood(data);
        } catch (err) {
          console.error(err);
        } finally {
          if (query === latestQueryRef.current) setsearching(false);
        }
      }, 400),
    [],
  );

  useEffect(() => () => debouncedApiSearch.cancel(), [debouncedApiSearch]);
  useEffect(() => {
    if (food.length > 0) setempty(false);
  }, [food]);

  const searchItems = (input) => {
    latestQueryRef.current = input;
    setsearching(false);
    setsearchText(input);
    if (!input) {
      isSearching.current = false;
      debouncedApiSearch.cancel();
      if (originalList.length > 0) setempty(false);
      return setfood(originalList);
    }
    isSearching.current = true;
    const filtered = (originalList.length > 0 ? originalList : food).filter(
      (item) =>
        Object.values(item)
          .join("")
          .toLowerCase()
          .includes(input.toLowerCase()),
    );
    if (filtered.length > 0) {
      setempty(false);
      debouncedApiSearch.cancel();
      setfood(filtered);
      return;
    }
    debouncedApiSearch(input);
  };

  const Box = useRef(false);
  useEffect(() => {
    if (searchVisiblity) {
      latestQueryRef.current = "";
      setsearchText("");
      setfood(originalList);
      if (sBox.current) sBox.current.scrollTop = 0;
    }
    const outside = (e) => {
      if (
        searchVisiblity &&
        sBox.current &&
        !sBox.current.contains(e.target) &&
        !Box.current.contains(e.target)
      ) {
        rotate();
        setsearchVisiblity(false);
      }
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [searchVisiblity]);

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
          skipNextStoreSync.current = true;
          setinitialFood(res.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsFirstLoad(false);
        setStoreBootstrapped(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (userBootstrapped && storeBootstrapped) setLoading(false);
  }, [userBootstrapped, storeBootstrapped]);

  useEffect(() => {
    if (isFirstLoad) return;
    if (skipNextStoreSync.current) {
      skipNextStoreSync.current = false;
      setnewfood(initialFood);
      return;
    }
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
          },
        );
        setnewfood(initialFood);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [initialFood, isFirstLoad]);

  const setFood = (index) => {
    const sel = food[index];
    if (!sel || !quantity || Number(quantity) <= 0) return;
    setinitialFood((p) => [...p, { ...sel, quantity: Number(quantity) }]);
    setquantity("");
  };

  useEffect(() => {
    let cal = 0,
      pro = 0,
      fat = 0,
      carb = 0,
      vA = 0,
      vB = 0,
      vC = 0,
      vE = 0,
      vK = 0,
      iron = 0,
      calc = 0,
      mag = 0;
    for (const f of newfood) {
      const q = Number(f.quantity || 0);
      cal += Math.round((f.calories || 0) * q);
      pro += Math.round((f.proteins || 0) * q);
      fat += Math.round((f.fats || 0) * q);
      carb += Math.round((f.carbohydrates || 0) * q);
      vA += Math.round((f.vA || 0) * q);
      vB += Number((f.vB || 0) * q);
      vC += Math.round((f.vC || 0) * q);
      vE += Math.round((f.vE || 0) * q);
      vK += Math.round((f.vK || 0) * q);
      iron += Math.round((f.iron || 0) * q);
      calc += Math.round((f.calcium || 0) * q);
      mag += Math.round((f.magnesium || 0) * q);
    }
    settcalories(cal);
    settproteins(pro);
    settfats(fat);
    settcarbs(carb);
    settVA(vA);
    settVB(Number(vB.toFixed(1)));
    settVC(vC);
    settVE(vE);
    settVK(vK);
    settIron(iron);
    settCalcium(calc);
    settMagnesium(mag);
  }, [newfood]);

  const removefood = (idx) =>
    setinitialFood((p) => p.filter((_, i) => i !== idx));

  useEffect(
    () => setcalPercentage(safePct(tcalories, Crequirement)),
    [tcalories, Crequirement],
  );
  useEffect(
    () => setproPercentage(safePct(tproteins, proteinReq)),
    [tproteins, proteinReq],
  );
  useEffect(() => setfatsPercentage(safePct(tfats, fatsreq)), [tfats, fatsreq]);
  useEffect(
    () => setcarbsPercentage(safePct(tcarbs, carbsreq)),
    [tcarbs, carbsreq],
  );
  useEffect(() => setvApercentage(safePct(tVA, Areq)), [tVA, Areq]);
  useEffect(() => setvBpercentage(safePct(tVB, Breq)), [tVB, Breq]);
  useEffect(() => setvCpercentage(safePct(tVC, Creq)), [tVC, Creq]);
  useEffect(() => setvEpercentage(safePct(tVE, 15)), [tVE]);
  useEffect(() => setvKpercentage(safePct(tVK, Kreq)), [tVK, Kreq]);
  useEffect(() => setironPercentage(safePct(tIron, ireq)), [tIron, ireq]);
  useEffect(
    () => setcalciumPercentage(safePct(tCalcium, calciumReq)),
    [tCalcium, calciumReq],
  );
  useEffect(
    () => setmagnesiumPercentage(safePct(tMagnesium, magnesiumReq)),
    [tMagnesium, magnesiumReq],
  );

  const macroCards = [
    {
      label: "Calories",
      value: tcalories,
      target: Math.round(Crequirement),
      accent: "#fbbf24",
      gradient: "linear-gradient(135deg,#fbbf24,#f97316)",
      icon: Flame,
    },
    {
      label: "Protein",
      value: tproteins,
      target: Math.round(proteinReq),
      accent: "#38bdf8",
      gradient: "linear-gradient(135deg,#38bdf8,#6366f1)",
      icon: Drumstick,
    },
    {
      label: "Fats",
      value: tfats,
      target: Math.round(fatsreq),
      accent: "#fb7185",
      gradient: "linear-gradient(135deg,#fb7185,#f43f5e)",
      icon: Apple,
    },
    {
      label: "Carbs",
      value: tcarbs,
      target: Math.round(carbsreq),
      accent: "#34d399",
      gradient: "linear-gradient(135deg,#34d399,#10b981)",
      icon: Wheat,
    },
  ];

  const macroBars = [
    {
      label: "Calories",
      value: tcalories,
      target: Math.round(Crequirement),
      pct: calPercentage,
      color: "linear-gradient(90deg,#fbbf24,#f97316)",
    },
    {
      label: "Proteins",
      value: tproteins,
      target: Math.round(proteinReq),
      pct: proPercentage,
      color: "linear-gradient(90deg,#38bdf8,#6366f1)",
    },
    {
      label: "Fats",
      value: tfats,
      target: Math.round(fatsreq),
      pct: fatsPercentage,
      color: "linear-gradient(90deg,#fb7185,#f43f5e)",
    },
    {
      label: "Carbs",
      value: tcarbs,
      target: Math.round(carbsreq),
      pct: carbsPercentage,
      color: "linear-gradient(90deg,#34d399,#10b981)",
    },
  ];

  const vitaminCards = [
    {
      label: "Vitamin A",
      value: tVA,
      target: Areq,
      accent: "#a78bfa",
      gradient: "linear-gradient(135deg,#a78bfa,#8b5cf6)",
      icon: ShieldPlus,
    },
    {
      label: "Vitamin B",
      value: tVB,
      target: Breq,
      accent: "#34d399",
      gradient: "linear-gradient(135deg,#6ee7b7,#059669)",
      icon: Zap,
    },
    {
      label: "Vitamin C",
      value: tVC,
      target: Creq,
      accent: "#fbbf24",
      gradient: "linear-gradient(135deg,#fde68a,#f59e0b)",
      icon: Sun,
    },
    {
      label: "Vitamin E",
      value: tVE,
      target: 15,
      accent: "#f472b6",
      gradient: "linear-gradient(135deg,#fbcfe8,#ec4899)",
      icon: Sparkles,
    },
    {
      label: "Vitamin K",
      value: tVK,
      target: Kreq,
      accent: "#8b5cf6",
      gradient: "linear-gradient(135deg,#c4b5fd,#7c3aed)",
      icon: Leaf,
    },
    {
      label: "Iron",
      value: tIron,
      target: ireq,
      accent: "#ef4444",
      gradient: "linear-gradient(135deg,#fca5a5,#dc2626)",
      icon: Pill,
    },
    {
      label: "Calcium",
      value: tCalcium,
      target: calciumReq,
      accent: "#14b8a6",
      gradient: "linear-gradient(135deg,#99f6e4,#0d9488)",
      icon: Bone,
    },
    {
      label: "Magnesium",
      value: tMagnesium,
      target: magnesiumReq,
      accent: "#6366f1",
      gradient: "linear-gradient(135deg,#a5b4fc,#4338ca)",
      icon: Droplets,
    },
  ];

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-950/85 backdrop-blur-md z-50">
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-400 animate-spin" />
              <div
                className="absolute inset-3 rounded-full border-4 border-blue-500/20 border-b-blue-400 animate-spin"
                style={{ animationDirection: "reverse" }}
              />
            </div>
            <p className="text-white/50 text-[11px] font-bold tracking-[0.35em] uppercase">
              Loading your plan…
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white font-sans relative">
        {/* ambient blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-48 -right-48 w-96 h-96 bg-purple-600/12 rounded-full blur-[100px]" />
          <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-600/12 rounded-full blur-[100px]" />
        </div>

        <DNavbar />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 pb-24 pt-6">
          {/* Welcome banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/4 px-5 py-4 backdrop-blur-sm mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-1">
                Welcome back
              </p>
              <h1 className="text-lg sm:text-xl font-bold flex flex-wrap items-center gap-2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {userName || "Athlete"}
                </span>
                <span className="text-white/20 font-light">·</span>
                <span className="text-white/40 font-normal text-sm">
                  Nutrition Tracker
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setshowList(true)}
                className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-xs font-semibold text-white/60 transition-all duration-200 hover:bg-white/12 hover:text-white"
              >
                <ListChecks className="h-3.5 w-3.5" />
                Meal Log
                {newfood.length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[9px] font-black text-white">
                    {newfood.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate("/edit")}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-xs font-semibold text-white/60 transition-all duration-200 hover:bg-white/12 hover:text-white"
              >
                <PencilLine className="h-3.5 w-3.5" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Meal log modal */}
          {showList && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/70 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
                  <div>
                    <h2 className="text-sm font-bold text-white">Meal Log</h2>
                    <p className="text-[11px] text-white/35 mt-0.5">
                      {newfood.length} item{newfood.length !== 1 ? "s" : ""}{" "}
                      tracked today
                    </p>
                  </div>
                  <button
                    onClick={() => setshowList(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:bg-white/8 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-[55vh] overflow-y-auto px-4 py-4 space-y-2">
                  {newfood.length > 0 ? (
                    newfood.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3 hover:bg-white/8 transition-colors duration-150"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {f.name}
                          </p>
                          <p className="text-[11px] text-white/35 mt-0.5">
                            Qty: {f.quantity}
                          </p>
                        </div>
                        <div className="text-right shrink-0 mr-2">
                          <p className="text-xs font-bold text-yellow-400">
                            {Math.round((f.calories || 0) * f.quantity)} kcal
                          </p>
                          <p className="text-[10px] text-white/30">
                            {Math.round((f.proteins || 0) * f.quantity)}g
                            protein
                          </p>
                        </div>
                        <button
                          onClick={() => removefood(i)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-500/25 bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/4">
                        <Salad className="h-5 w-5 text-white/20" />
                      </div>
                      <p className="text-sm text-white/35">
                        No meals logged yet
                      </p>
                      <p className="text-xs text-white/20">
                        Add food using the tracker below
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add food */}
          <div className="relative z-40 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/35 mb-4">
              Add Food
            </p>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              {/* Dropdown trigger */}
              <div
                className={`relative flex-1 ${searchVisiblity ? "z-50" : "z-10"}`}
              >
                <div
                  ref={Box}
                  onClick={() => {
                    if (!searchVisiblity)
                      Box.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    if (!foodSearchInitialized) setFoodSearchInitialized(true);
                    searchFood();
                    rotate();
                    fetchFood();
                  }}
                  className="flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border border-white/15 bg-white/90 px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-white"
                >
                  <span
                    className={`truncate ${selectFood === "Select Food" ? "text-slate-400" : "text-slate-700"}`}
                  >
                    {selectFood}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 ${rotation ? "-rotate-180" : ""}`}
                  />
                </div>

                {/* Dropdown list */}
                {searchVisiblity && (
                  <div
                    ref={sBox}
                    className="absolute left-0 top-[calc(100%+6px)] z-[70] w-full max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl shadow-black/40"
                  >
                    <div className="sticky top-0 bg-white px-3 pt-3 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-yellow-400 transition-colors">
                        <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search food…"
                          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder-slate-400"
                          value={searchText}
                          onChange={(e) => searchItems(e.target.value)}
                        />
                      </div>
                    </div>
                    <ul className="p-2">
                      {empty && (
                        <li className="px-3 py-4 text-center text-sm text-slate-400">
                          No results found
                        </li>
                      )}
                      {searching && (
                        <li className="flex justify-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                        </li>
                      )}
                      {food.map((f, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            searchFood();
                            setindexFood(i);
                            setselectFood(f.name);
                            rotate();
                          }}
                          className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white"
                        >
                          {f.name}
                        </li>
                      ))}
                      {loadMore && (
                        <li className="flex justify-center py-3">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <input
                type="number"
                min="0"
                placeholder="Qty"
                className="h-11 w-full sm:w-28 rounded-xl border border-white/15 bg-white/90 px-4 text-center text-sm font-bold text-slate-700 outline-none transition-all focus:border-yellow-400 focus:bg-white placeholder-slate-400"
                value={quantity}
                onInput={(e) => setquantity(e.target.value)}
              />

              {/* Add */}
              <button
                onClick={(e) => {
                  if (!quantity || Number(quantity) <= 0) {
                    e.preventDefault();
                    return;
                  }
                  setFood(indexFood);
                }}
                className="flex h-11 w-full sm:w-28 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 font-bold text-sm text-white shadow-lg shadow-emerald-900/30 transition-all hover:from-emerald-400 hover:to-emerald-500 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>

          {/* Macro cards */}
          <div className="relative z-0 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {macroCards.map((c) => (
              <MacroCard key={c.label} {...c} />
            ))}
          </div>

          {/* Vitamins & minerals */}
          <SectionHeader
            icon={Salad}
            label="Vitamins & Minerals"
            iconColor="#a78bfa"
          />
          <div className="relative z-0 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {vitaminCards.map((c) => (
              <MacroCard key={c.label} {...c} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default NutritionTracker;
