import { createBrowserRouter } from "react-router-dom";
import {
  HomePage,
  MenuPage,
  OrderPage,
  ReceiptPage,
  AuthSuccess,
  HistoryPage,
} from "../pages";
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
    path: "/history",
    element: <HistoryPage />,
  },
  {
    path: "*",
    element: <h1>404</h1>,
  },
  {
    path: "/auth/success",
    element: <AuthSuccess />,
  },
]);
