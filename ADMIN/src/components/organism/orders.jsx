import { OrderTable } from "../moleculs/";
import { useState, useEffect } from "react";
import useAuthStore from "../../stores/useAuthStore";
import Swal from "sweetalert2";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Orders() {
  const { token } = useAuthStore.getState();
  const [orders, setOrders] = useState([]);

  async function fetchOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
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
      const result = await Swal.fire({
        title: "Apakah kamu yakin?",
        text: "Kamu ingin mengganti status ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, ubah status!",
      });
      if (!result.isConfirmed) return;
      const res = await fetch(`${API_BASE_URL}/orders/status/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) {
        console.error(data);
        return Swal.fire(
          "Error",
          data.message || "Gagal mengubah status",
          "error"
        );
      }
      await Swal.fire({
        title: "Berhasil!",
        text: `Status berhasil diubah menjadi ${status}`,
        icon: "success",
      });
      fetchOrders();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Terjadi kesalahan", "error");
    }
  }

  async function handleUpdatePaymentStatus(orderId, paymentStatus) {
    try {
      const result = await Swal.fire({
        title: "Apakah kamu yakin?",
        text: "Kamu ingin mengganti status ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, ubah status!",
      });
      if (!result.isConfirmed) return;
      const res = await fetch(`${API_BASE_URL}/orders/payment/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        console.error(data);
        return Swal.fire(
          "Error",
          data.message || "Gagal mengubah status",
          "error"
        );
      }
      await Swal.fire({
        title: "Berhasil!",
        text: `Status berhasil diubah menjadi ${paymentStatus}`,
        icon: "success",
      });
      fetchOrders();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Terjadi kesalahan", "error");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 mx-auto">
      <div className="flex flex-col items-start justify-start mt-14 md:mt-0">
        <h1 className="text-2xl font-semibold mb-1">Daftar Pesanan</h1>
        <div className=" w-44 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-8 md:mb-0"></div>
      </div>
      <OrderTable
        orders={orders}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
      />
    </div>
  );
}
