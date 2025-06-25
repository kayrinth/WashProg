import { Navigate } from "react-router-dom";
import Sidebar from "./sidebarHeader.jsx";
import useAuthStore from "../../stores/useAuthStore";
import "./style.css";

export default function AdminLayout({ children }) {
  const { token } = useAuthStore((state) => state);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-layout flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
