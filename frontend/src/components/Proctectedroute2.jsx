import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

const API_URL = import.meta.env.VITE_API_URL;

function Protectedroute2({ children }) {
  const navigate = useNavigate();
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const token = localStorage.getItem("token");
        const sessionId = localStorage.getItem("sessionId");

        if (!token) {
          navigate("/signin", { replace: true });
          return;
        }

        const response = await axios.get(`${API_URL}/checkData`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(sessionId && { "X-Session-Id": sessionId }),
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        });

        if (!isActive) return;

        if (response.status === 200) {
          navigate("/dashboard", { replace: true });
        } else if (response.status === 210) {
          setShouldRenderChildren(true);
        } else {
          navigate("/signin", { replace: true });
        }
      } catch (err) {
        if (!isActive) return;

        console.error(err);
        navigate("/signin", { replace: true });
      }
    })();

    return () => {
      isActive = false;
    };
  }, [navigate]);

  if (!shouldRenderChildren) {
    return (
      <div className="app-shell flex items-center justify-center font-dm-sans">
        <div className="ambient-orbs" />
        <div className="ambient-orb-center" />
        <Loader />
      </div>
    );
  }

  return children;
}

export default Protectedroute2;
