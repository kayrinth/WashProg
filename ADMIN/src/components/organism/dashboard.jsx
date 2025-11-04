import { useState, useEffect } from "react";
import { DashboardTemplate } from "../moleculs";
import useAuthStore from "../../stores/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const [orders, setOrders] = useState({
    totalOrders: 0,
    waitingOrders: 0,
    totalRevenue: 0,
    dailyRevenue: 0,
    revenueData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useAuthStore.getState();

  async function fetchOrders() {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/orders-dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        console.log(data.data);
      } else {
        console.error("Data orders tidak sesuai format:", data);
      }
    } catch (error) {
      console.error("Gagal memuat orders:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 mx-auto">
      <div className="flex flex-col items-start justify-start  p-6 rounded-xl">
        <h1 className="text-2xl font-semibold mb-1">
          Dashboard Admin Washprog
        </h1>
        <div className=" w-80 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-8 md:mb-4"></div>
      </div>

      <DashboardTemplate orders={orders} isLoading={isLoading} />
    </div>
  );
}
