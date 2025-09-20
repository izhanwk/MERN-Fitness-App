import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for hamburger icons
import Loader from "./Loader";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function DNavbar() {
  const navigate = useNavigate();
  const [visible2, setvisible2] = useState(false);
  const [visible, setvisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isRefreshing = useRef(false);
  const refreshPromiseRef = useRef(null);

  const logOut = async () => {
    console.log("Loggin out");
    setLoading(true);
    const token = localStorage.getItem("token");
    await axios.get(`${API_URL}/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      validateStatus: () => true,
    });
    localStorage.removeItem("token");
    setLoading(false);
    navigate("/signin");
  };

  const refreshtoken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshtoken");
      console.log("Our refresh token:", refreshToken);

      const response = await axios.post(
        `${API_URL}/refresh-token`,
        { refreshtoken: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        }
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        console.log("New token:", localStorage.getItem("token"));
        console.log("Token refreshed successfully");
        return data.token;
      } else {
        localStorage.removeItem("token");
        console.log("Login failed");
        alert("Session Expired");
        navigate("/signin");
        return null;
      }
    } catch (err) {
      console.error("Error occurred:", err);
      localStorage.removeItem("token");
      alert("Session Expired");
      navigate("/signin");
      return null;
    }
  };

  useEffect(() => {
    // Global axios request interceptor: attach access token and refresh token
    axios.interceptors.request.use((config) => {
      const refreshToken = localStorage.getItem("refreshtoken");

      config.headers = {
        ...config.headers,
        ...(refreshToken && { "X-Refresh-Token": refreshToken }),
      };

      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;
        const status = error?.response?.status;
        const isRefreshEndpoint =
          originalRequest?.url?.includes("/refresh-token");

        if (
          status === 403 &&
          originalRequest &&
          !originalRequest._retry &&
          !isRefreshEndpoint
        ) {
          originalRequest._retry = true;

          // start exactly one refresh; everyone else awaits the same promise
          let starter = false;
          if (!isRefreshing.current) {
            isRefreshing.current = true;
            refreshPromiseRef.current = refreshtoken(); // MUST return new token
            starter = true;
          }

          let newToken;
          try {
            newToken = await refreshPromiseRef.current; // wait until refresh finishes
          } finally {
            // only the starter clears the lock/promise
            if (starter) {
              isRefreshing.current = false;
              refreshPromiseRef.current = null;
            }
          }

          if (newToken) {
            // since you removed the request interceptor, set header explicitly on RETRY
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };
            return axios(originalRequest); // retry once with fresh token
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const interValid = setInterval(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");

          const response = await axios.get(`${API_URL}/getdata`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            validateStatus: () => true,
          });

          if (response.status === 200) {
            console.log("Token is valid");
          } else if (response.status === 403) {
            await refreshtoken();
          } else {
            logOut();
          }
        } catch (err) {
          if (err.response?.status === 403) {
            // Token expired, try refreshing
            await refreshtoken();
          } else {
            console.error("Error in fetchData:", err);
            logOut();
          }
        }
      };

      fetchData();
    }, 60000); // Runs every 60 seconds

    return () => clearInterval(interValid);
  }, []);

  const show = () => {
    setvisible(!visible);
  };

  const session_Function = async () => {
    navigate("/sessions");
  };

  return (
    <div className="relative">
      {loading && <Loader />}
      {/* Modal for Contact/About/Guide */}
      {visible2 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center">
          <div className="w-96 max-w-[90%] h-auto bg-white/95 rounded-2xl shadow-2xl text-slate-800 flex flex-col justify-center items-center font-bold relative p-6 border border-white/20">
            <div id="text"></div>
            <div
              className="bg-gradient-to-r from-red-500 to-red-600 mt-6 px-6 py-2 text-white rounded-full cursor-pointer hover:from-red-400 hover:to-red-500 transition-all duration-300 shadow-lg"
              onClick={() => setvisible2(false)}
            >
              Close
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="w-full h-20 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center relative z-20">
        <div className="flex items-center justify-between w-full px-6 md:px-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-black font-bold"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl">FitTracker</span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex text-white font-dm-sans space-x-8 items-center">
            <li
              className="hover:cursor-pointer hover:text-yellow-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
              onClick={() => {
                setvisible2(true);
                setTimeout(() => {
                  document.querySelector("#text").innerHTML =
                    "<p>Email: <span class='font-normal'>izhan3008@gmail.com</span></p><p>Contact No: <span class='font-normal'>+923486186394</span></p>";
                }, 0);
              }}
            >
              Contact
            </li>
            <li
              className="hover:cursor-pointer hover:text-yellow-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
              onClick={() => {
                setvisible2(true);
                setTimeout(() => {
                  document.querySelector("#text").innerHTML =
                    "<p class='font-normal text-base text-center'>I am a full stack web-developer with expertise in creating userfriendly web app for multiple audiences</p>";
                }, 0);
              }}
            >
              About us
            </li>
            <li
              className="hover:cursor-pointer hover:text-yellow-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
              onClick={() => {
                setvisible2(true);
                setTimeout(() => {
                  document.querySelector("#text").innerHTML =
                    "<p class='font-normal text-base text-center'>This app has all the essential micro and macronutients data available for you to track your fitness needs. Whether you want to gain or loss the weight this app will guide you throughout achieving your fitnessgoals</p>";
                }, 0);
              }}
            >
              Guide
            </li>
            <span
              className="hover:cursor-pointer hover:text-yellow-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
              onClick={() => {
                session_Function();
              }}
            >
              Sessions
            </span>
            <li
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 px-6 py-2 rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              onClick={show}
            >
              Logout
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black/80 backdrop-blur-lg z-40 flex flex-col space-y-4 px-6 py-4 text-white">
          <span
            className="cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={() => {
              setvisible2(true);
              setMenuOpen(false);
              setTimeout(() => {
                document.querySelector("#text").innerHTML =
                  "<p>Email: <span class='font-normal'>izhan3008@gmail.com</span></p><p>Contact No: <span class='font-normal'>+923486186394</span></p>";
              }, 0);
            }}
          >
            Contact
          </span>
          <span
            className="cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={() => {
              setvisible2(true);
              setMenuOpen(false);
              setTimeout(() => {
                document.querySelector("#text").innerHTML =
                  "<p class='font-normal text-base text-center'>I am a full stack web-developer with expertise in creating userfriendly web app for multiple audiences</p>";
              }, 0);
            }}
          >
            About us
          </span>
          <span
            className="cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={() => {
              setvisible2(true);
              setMenuOpen(false);
              setTimeout(() => {
                document.querySelector("#text").innerHTML =
                  "<p class='font-normal text-base text-center'>This app has all the essential micro and macronutients data available for you to track your fitness needs...</p>";
              }, 0);
            }}
          >
            Guide
          </span>
          <span
            className="cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={() => {
              session_Function();
            }}
          >
            Sessions
          </span>
          <span
            className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-2 rounded-full text-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            onClick={() => {
              show();
              setMenuOpen(false);
            }}
          >
            Logout
          </span>
        </div>
      )}

      {/* Logout Confirmation */}
      {visible && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"></div>
          <div className="w-96 max-w-[90%] h-auto bg-white/95 rounded-2xl shadow-2xl fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 p-6 border border-white/20">
            <p className="text-slate-800 font-dm-sans text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </p>
            <div
              className="bg-gradient-to-r from-red-500 to-red-600 text-center rounded-lg py-2 mt-3 cursor-pointer hover:from-red-400 hover:to-red-500 text-white font-medium transition-all duration-300"
              onClick={logOut}
            >
              Yes
            </div>
            <div
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-center rounded-lg py-2 mt-3 cursor-pointer hover:from-gray-400 hover:to-gray-500 text-white font-medium transition-all duration-300"
              onClick={show}
            >
              No
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DNavbar;
