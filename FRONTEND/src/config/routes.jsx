import { createBrowserRouter } from "react-router-dom";
import { HomePage, MenuPage, OrderPage } from "../pages";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/menu",
    element: <MenuPage />,
  },
  {
    path: "/pesan",
    element: <OrderPage />,
  },
]);
