import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";

function Protectedroute2({ children }) {
  const navigate = useNavigate();
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const response = await api.get("/checkData");

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
    return null;
  }

  return children;
}

export default Protectedroute2;
