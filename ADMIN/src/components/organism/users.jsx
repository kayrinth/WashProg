import { UserTable } from "../moleculs/";
import { useState, useEffect } from "react";
import useAuthStore from "../../stores/useAuthStore";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Users() {
  const { token } = useAuthStore.getState();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${API_BASE_URL}/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setUsers(data.data);
          console.log(data.data);
        } else {
          console.error("Data users tidak sesuai format:", data);
        }
      } catch (error) {
        console.error("Gagal memuat users:", error);
      }
    }
    fetchUsers();
  }, []);
  return (
    <div className="p-6 mx-auto">
      <div className="flex flex-col items-start justify-start mt-14 md:mt-0">
        <h1 className="text-2xl font-semibold mb-1">Daftar Pelanggan</h1>
        <div className=" w-44 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-8 "></div>
      </div>
      <UserTable users={users} />
    </div>
  );
}
