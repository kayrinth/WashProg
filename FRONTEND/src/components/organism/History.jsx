import { HistoryTable } from "../molecules";
import { useState, useEffect } from "react";
import useAuthStore from "../../stores/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function History() {
  const { token } = useAuthStore.getState();
  const [orders, setOrders] = useState([]);

  async function fetchOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        console.error("Data orders tidak sesuai format:", data);
      }
    } catch (error) {
      console.error("Gagal memuat orders:", error);
    }
  }

  async function handleUpdateStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/status/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Status berhasil diubah menjadi "${status}"`);
        fetchOrders();
      } else {
        console.error(data);
        alert(data.message || "Gagal mengubah status");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Riwayat Pesanan</h1>
      <HistoryTable orders={orders} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
}
