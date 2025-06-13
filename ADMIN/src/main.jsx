import { StrictMode } from "react";
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

library.add(faTwitter, faFacebook, faInstagram);

const MainApp = () => {
  return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainApp />
    <ToastContainer />
  </StrictMode>
);
