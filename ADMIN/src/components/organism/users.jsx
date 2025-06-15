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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Daftar Pelanggan</h1>
      <UserTable users={users} />
    </div>
  );
}
