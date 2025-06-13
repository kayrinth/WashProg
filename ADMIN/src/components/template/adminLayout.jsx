import Sidebar from "./sidebarHeader.jsx";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  );
}
