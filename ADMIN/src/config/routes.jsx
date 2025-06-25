// src/router/index.js
import { createBrowserRouter } from "react-router-dom";
import { MapPage, OrderPage, UserPage, LoginPage } from "../pages";
import AdminLayout from "../components/template/adminLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/maps",
    element: (
      <AdminLayout>
        <MapPage />,
      </AdminLayout>
    ),
  },
  {
    path: "/orders",
    element: (
      <AdminLayout>
        <OrderPage />
      </AdminLayout>
    ),
  },
  {
    path: "/users",
    element: (
      <AdminLayout>
        <UserPage />
      </AdminLayout>
    ),
  },
  {
    path: "*",
    element: (
      <AdminLayout>
        <h1>404 Gak ono</h1>
      </AdminLayout>
    ),
  },
]);
