import { OrderTableAdmin } from "../moleculs";
import { useState, useEffect } from "react";
import useAuthStore from "../../stores/useAuthStore";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OrdersAdmin() {
  const { token } = useAuthStore.getState();
  const [orders, setOrders] = useState([]);
  async function fetchOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
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

  async function handleUpdatePaymentStatus(orderId, paymentStatus) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/payment/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Status pembayaran berhasil diubah menjadi "${paymentStatus}"`);
        fetchOrders();
      } else {
        console.error(data);
        alert(data.message || "Gagal mengubah status pembayaran");
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
      <h1 className="text-2xl font-semibold mb-4 ml-1">Daftar Pesanan</h1>
      <OrderTableAdmin
        orders={orders}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
      />
    </div>
  );
}
