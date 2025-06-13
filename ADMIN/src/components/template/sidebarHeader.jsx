import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Package, Map, Menu } from "lucide-react";
import { logo } from "../../assets";

const menuItems = [
  { name: "Beranda", path: "/", icon: <Home size={20} /> },
  { name: "Pelanggan", path: "/users", icon: <Users size={20} /> },
  { name: "Pesanan", path: "/orders", icon: <Package size={20} /> },
  { name: "Map", path: "/maps", icon: <Map size={20} /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

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

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 md:h-screen h-full w-56 bg-black text-white flex flex-col z-[9999] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          <img src={logo} alt="logo washprog" />
        </div>
        <nav className="flex-1 p-4 space-y-2 bg-black">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-800"
                }`
              }
              onClick={() => setIsOpen(false)} // auto close on mobile
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
