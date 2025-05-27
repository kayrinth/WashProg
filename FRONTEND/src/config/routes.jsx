import { createBrowserRouter } from "react-router-dom";
import { HomePage, MenuPage, OrderPage, ReceiptPage } from "../pages";
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
  {
    path: "/receipt",
    element: <ReceiptPage />,
  },
  {
    path: "*",
    element: <h1>404</h1>,
  },
]);
