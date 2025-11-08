import { useEffect, useState, useMemo } from "react";
import MapView from "../components/algoritma/mapView";
import useAuthStore from "../stores/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MapPage() {
  const { token } = useAuthStore.getState();
  const [dataOrders, setDataOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await res.json();

        if (res.ok && Array.isArray(json.data)) {
          setDataOrders(json.data);
        } else {
          console.error("Data orders tidak valid:", json);
          setDataOrders([]);
        }
      } catch (error) {
        console.error("Gagal fetch orders:", error);
        setDataOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const memoOrders = useMemo(() => dataOrders, [dataOrders]);
  if (loading)
    return (
      <p className="flex justify-center items-center h-screen">
        Loading orders.......
      </p>
    );
  return (
    <div>
      <MapView orders={memoOrders} />
    </div>
  );
}
