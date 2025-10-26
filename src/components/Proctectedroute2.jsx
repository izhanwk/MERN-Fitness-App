import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        } else {
          setShouldRenderChildren(true);
        }
      } catch (err) {
        if (!isActive) return;

        console.error(err);
        setShouldRenderChildren(true);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [navigate]);

  if (!shouldRenderChildren) {
    return (
      <div className="min-h-screen flex justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-0 m-0  items-center font-dm-sans relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
}

export default Protectedroute2;