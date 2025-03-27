import { createBrowserRouter } from "react-router-dom";
import { HomePage, MenuPage } from "../pages";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/menu",
    element: <MenuPage />,
  },
]);
