import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./config/routes";
import "./index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTwitter,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

library.add(faTwitter, faFacebook, faInstagram);

function checkTokenExpiration(token) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}

const lokalToken = localStorage.getItem("token");
console.log(checkTokenExpiration(lokalToken));
const MainApp = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && checkTokenExpiration(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      window.location.href = "/";
    }
  }, []);

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainApp />
    <ToastContainer />
  </StrictMode>
);
