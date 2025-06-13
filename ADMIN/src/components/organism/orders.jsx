import { OrderTable } from "../moleculs/";
import { useState, useEffect } from "react";
import useAuthStore from "../../stores/useAuthStore";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Orders() {
  const { token } = useAuthStore.getState();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
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
          console.log(data.data);
        } else {
          console.error("Data orders tidak sesuai format:", data);
        }
      } catch (error) {
        console.error("Gagal memuat orders:", error);
      }
    }
    fetchOrders();
  }, []);
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Daftar Pesanan</h1>
      <OrderTable orders={orders} />
    </div>
  );
}

// const dummyOrders = [
//   {
//     id: "1",
//     nama: "Damar",
//     tanggal: "2025-06-13",
//     item_pesanan: "Sepatu",
//     total_harga: "20000",
//     layanan: "Cuci Kering",
//     status: "menunggu",
//   },
//   {
//     id: "2",
//     nama: "Damar",
//     tanggal: "2025-06-13",
//     item_pesanan: "Sepatu",
//     total_harga: "20000",
//     layanan: "Cuci Kering",
//     status: "diproses",
//   },
//   {
//     id: "3",
//     nama: "Damar",
//     tanggal: "2025-06-13",
//     item_pesanan: "Sepatu",
//     total_harga: "20000",
//     layanan: "Cuci Kering",
//     status: "selesai",
//   },
//   {
//     id: "4",
//     nama: "Damar",
//     tanggal: "2025-06-13",
//     item_pesanan: "Sepatu",
//     total_harga: "20000",
//     layanan: "Cuci Kering",
//     status: "dibatalkan",
//   },
// ];
