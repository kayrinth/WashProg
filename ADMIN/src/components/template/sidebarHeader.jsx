import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Package,
  Map,
  Menu,
  LogOut,
  ShoppingCart,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { logo } from "../../assets";
import useAuthStore from "../../stores/useAuthStore";

const menuItems = [
  { name: "Beranda", path: "/dashboard", icon: <Home size={20} /> },
  { name: "Pelanggan", path: "/users", icon: <Users size={20} /> },
  {
    name: "Buat Pesanan",
    path: "/orders/new",
    icon: <ShoppingCart size={20} />,
  },
  { name: "Pesanan", path: "/orders", icon: <Package size={20} /> },
  {
    name: "Pesanan Offline",
    path: "/orders/admin",
    icon: <Store size={20} />,
  },
  { name: "Map", path: "/maps", icon: <Map size={20} /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger Button - only show on mobile */}
      {!isOpen && (
        <button
          className="md:hidden text-white fixed w-full h-16 top-0 left-0 bg-black px-4 py-2 flex items-center justify-end z-[9999]"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-black text-white flex flex-col z-[9999] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-20" : "w-56"}
         md:translate-x-0 md:static md:block md:h-screen`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {!isCollapsed && (
            <img
              src={logo}
              alt="logo washprog"
              className={`transition-all duration-300 ${
                isCollapsed ? "w-0" : "w-32"
              }`}
            />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 bg-black overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/orders"}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-800"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 rounded-lg w-full text-left hover:bg-gray-800"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
