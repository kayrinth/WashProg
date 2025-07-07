import { createBrowserRouter } from "react-router-dom";
import {
  HomePage,
  MenuPage,
  OrderPage,
  ReceiptPage,
  AuthSuccess,
  HistoryPage,
  NotFound,
  ProfileEdit,
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
    path: "/profile",
    element: <ProfileEdit />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/auth/success",
    element: <AuthSuccess />,
  },
]);
