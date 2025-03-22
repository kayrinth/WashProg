import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
]);
