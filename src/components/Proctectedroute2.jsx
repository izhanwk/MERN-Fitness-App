import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Protectedroute2({ children }) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    (async () => {
      const response = await axios.get(`${API_URL}/checkData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      if (response.data === "Complete") {
        navigate("/dashboard");
      }
    })();
  }, [navigate]);

  return children;
}

export default Protectedroute2;
