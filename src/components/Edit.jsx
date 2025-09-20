import React, { useEffect, useMemo, useState } from "react";
import DNavbar from "./DNavbar";
import axios from "axios";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Edit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [goaltype, setgoaltype] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    goal: "",
    mode: "",
    date: "", // YYYY-MM-DD
    height: "",
    lengthScale: "",
    weight: "",
    weightScale: "",
    activity: "",
    verified: false, // read-only hint
    _id: "",
  });
  const [initialForm, setInitialForm] = useState(null);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/editdata`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        });
        if (response.status < 200 || response.status >= 300)
          throw new Error("Fetch failed");
        const resData = response.data;

        const dateISO = resData?.date
          ? new Date(resData.date).toISOString().slice(0, 10)
          : "";
        const normalized = {
          name: resData?.name ?? "",
          email: resData?.email ?? "",
          gender: resData?.gender ?? "",
          goal: resData?.goal ?? "",
          mode: resData?.mode ?? "",
          date: dateISO,
          height: resData?.height != null ? String(resData.height) : "",
          lengthScale: resData?.lengthScale ?? "",
          weight: resData?.weight != null ? String(resData.weight) : "",
          weightScale: resData?.weightScale ?? "",
          activity: resData?.activity != null ? String(resData.activity) : "",
          verified: !!resData?.verified,
          _id: resData?._id ?? "",
        };

        setForm(normalized);
        setInitialForm(normalized);
      } catch (e) {
        console.error(e);
        alert("Could not load your info.");
      } finally {
        setLoading(false);
      }
    };
    getInfo();
  }, []);

  const isDirty = useMemo(() => {
    if (!initialForm) return false;
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDirty) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      // Build payload to match your schema & types
      const payload = {
        email: form.email, // server identifies by token email; allowing update here is optional
        name: form.name,
        date: form.date ? new Date(form.date).toISOString() : null,
        gender: form.gender || null,
        weight: form.weight === "" ? null : Number(form.weight),
        weightScale: form.weightScale || null,
        height: form.height === "" ? null : Number(form.height),
        lengthScale: form.lengthScale || null,
        goal: form.goal || null,
        mode: form.mode || null,
        activity: form.activity === "" ? null : Number(form.activity),
        // array/password/refreshtoken/verified not edited here
      };

      const response = await axios.put(`${API_URL}/editdata`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        validateStatus: () => true,
      });

      if (response.status < 200 || response.status >= 300) {
        const errText = response.data?.message || "Save failed";
        throw new Error(errText);
      }

      const updated = response.data;
      // reflect server truth in the form
      const next = {
        ...form,
        // if server normalized anything, prefer it:
        email: updated.email ?? form.email,
        name: updated.name ?? form.name,
        date: updated.date
          ? new Date(updated.date).toISOString().slice(0, 10)
          : form.date,
        gender: updated.gender ?? form.gender,
        weight: updated.weight != null ? String(updated.weight) : form.weight,
        weightScale: updated.weightScale ?? form.weightScale,
        height: updated.height != null ? String(updated.height) : form.height,
        lengthScale: updated.lengthScale ?? form.lengthScale,
        goal: updated.goal ?? form.goal,
        mode: updated.mode ?? form.mode,
        activity:
          updated.activity != null ? String(updated.activity) : form.activity,
      };
      setForm(next);
      setInitialForm(next);

      alert("Profile updated successfully!");
    } catch (e) {
      console.error(e);
      alert("There was a problem saving your changes.");
    } finally {
      setSaving(false);
    }
  };

  const activityOptions = [
    {
      label: "Sedentary",
      sub: "Little or no workout",
      value: 1.2,
      badge: "Easy",
    },
    {
      label: "Lightly Active",
      sub: "Exercise 1–3 days/week",
      value: 1.375,
      badge: "Light",
    },
    {
      label: "Moderately Active",
      sub: "Exercise 3–5 days/week",
      value: 1.55,
      badge: "Balanced",
    },
    {
      label: "Very Active",
      sub: "Exercise 6–7 days/week",
      value: 1.725,
      badge: "High",
    },
    {
      label: "Super Active",
      sub: "For athletes",
      value: 1.9,
      badge: "Athlete",
    },
  ];

  useEffect(() => {
    console.log(form.goal);
    if (form.goal == "musclegain") {
      setgoaltype(["Moderate Musclegain", "Fast Musclegain"]);
    } else if (form.goal == "fatloss") {
      setgoaltype(["Moderate fatloss", "Fast fatloss"]);
    }
  }, [form.goal]);

  useEffect(() => {
    console.log(goaltype);
  }, [goaltype]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 font-dm-sans overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <DNavbar />

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 md:px-6">
        <section className="min-h-[calc(100vh-120px)] flex items-center justify-center py-10">
          <div className="w-full rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="rounded-t-3xl p-5 md:p-6 bg-gradient-to-r from-purple-600/80 to-blue-600/80 border-b border-white/20 text-center">
              <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                Edit Profile
              </h1>
              <p className="text-purple-100/90 text-sm md:text-base mt-1">
                Update your info below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {form._id && (
                  <span className="text-xs rounded-full px-3 py-1 bg-white/10 text-white/80">
                    ID: {form._id}
                  </span>
                )}
                <span
                  className={`text-xs rounded-full px-3 py-1 ${
                    form.verified
                      ? "bg-green-500/20 text-green-200"
                      : "bg-yellow-500/20 text-yellow-100"
                  }`}
                >
                  {form.verified ? "Verified" : "Not Verified"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-sm text-purple-100/90 mb-1">
                    Name *
                  </label>
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/70"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-purple-100/90 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/70"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-purple-100/90 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/70"
                  >
                    <option value="" className="bg-slate-900">
                      Select…
                    </option>
                    <option value="male" className="bg-slate-900">
                      Male
                    </option>
                    <option value="female" className="bg-slate-900">
                      Female
                    </option>
                    <option value="other" className="bg-slate-900">
                      Other
                    </option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-purple-100/90 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    max={new Date().toISOString().slice(0, 10)}
                    className="rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/70"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-purple-100/90 mb-1">
                    Goal
                  </label>
                  <select
                    name="goal"
                    value={form.goal}
                    onChange={handleChange}
                    className="rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/70"
                  >
                    <option value="musclegain" className="bg-slate-900">
                      Muscle Gain
                    </option>
                    <option value="fatloss" className="bg-slate-900">
                      Fat Loss
                    </option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-purple-100/90 mb-1">
                    Mode
                  </label>
                  <select
                    name="mode"
                    value={form.mode}
                    onChange={handleChange}
                    className="rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/70"
                  >
                    {goaltype.map((type) => (
                      <option key={type} value={type} className="bg-slate-900">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-purple-100/90 mb-1">
                    Height
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      step="0.01"
                      name="height"
                      value={form.height}
                      onChange={handleChange}
                      placeholder="e.g., 6 or 180"
                      className="flex-1 rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/70"
                    />
                    <select
                      name="lengthScale"
                      value={form.lengthScale}
                      onChange={handleChange}
                      className="w-28 rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/70"
                    >
                      <option value="ft" className="bg-slate-900">
                        ft
                      </option>
                      <option value="cm" className="bg-slate-900">
                        cm
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-purple-100/90 mb-1">
                    Weight
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      step="0.1"
                      name="weight"
                      value={form.weight}
                      onChange={handleChange}
                      placeholder="e.g., 76"
                      className="flex-1 rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/70"
                    />
                    <select
                      name="weightScale"
                      value={form.weightScale}
                      onChange={handleChange}
                      className="w-28 rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/70"
                    >
                      <option value="Kgs" className="bg-slate-900">
                        Kgs
                      </option>
                      <option value="Lbs" className="bg-slate-900">
                        Lbs
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <label className="text-sm text-purple-100/90 mb-3 block">
                  Activity Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activityOptions.map((opt) => {
                    const selected =
                      String(opt.value) === String(form.activity);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            activity: String(opt.value),
                          }))
                        }
                        className={[
                          "group w-full text-left rounded-2xl border bg-white/[0.06] transition-all px-4 py-4",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70",
                          selected
                            ? "border-yellow-400/60 shadow-lg shadow-yellow-400/10"
                            : "border-white/15 hover:border-yellow-400/40 hover:shadow-md hover:shadow-yellow-400/10",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 grid place-items-center">
                            <span className="text-black text-xs font-semibold">
                              {opt.badge}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {opt.label}
                            </div>
                            <div className="text-purple-200/90 text-sm">
                              {opt.sub}
                            </div>
                          </div>
                          {selected && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="ml-auto h-5 w-5 text-yellow-300"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-white/90 bg-white/5 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isDirty || saving}
                  className={[
                    "px-5 py-2.5 rounded-xl font-semibold transition",
                    !isDirty || saving
                      ? "bg-yellow-400/40 text-black/60 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-95",
                  ].join(" ")}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>

              <p className="text-[11px] text-purple-300/80 mt-4">
                You can easily update your infodata from here
              </p>
            </form>
          </div>
        </section>
      </main>

      {(loading || saving) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Edit;
