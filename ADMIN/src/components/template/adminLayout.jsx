import Sidebar from "./sidebarHeader.jsx";
import "./style.css";

export default function AdminLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
