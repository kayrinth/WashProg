import { useState, useEffect } from "react";
import MapComponent from "../molecules/leaflet/MapComponent";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Receipt() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedCartItems = localStorage.getItem("cartItems");
      if (savedCartItems) {
        const parsedItems = JSON.parse(savedCartItems);
        setCartItems(parsedItems);
      } else {
        console.log("Receipt - No cart items found in localStorage");
      }
    } catch (error) {
      console.error("Receipt - Error loading cart items:", error);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!loadingData) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, loadingData]);

  const handleRemoveFromCart = (key) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.key !== key));
  };

  const handleLocationSelect = (latlng) => {
    setSelectedLatLng(latlng);
    console.log("Selected coordinates:", latlng);
  };

  const handleConfirmOrder = async () => {
    // ✅ Validasi koordinat sebelum mengirim
    if (!selectedLatLng) {
      alert("Silakan pilih lokasi pada peta terlebih dahulu");
      return;
    }

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("auth");

    // ✅ Debug dan perbaiki pengambilan userId
    console.log("Raw user string:", userString);

    let userId = null;
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        console.log("Parsed user data:", userData);
        userId = userData.state?.user?.userId;
        console.log("Extracted userId:", userId);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    if (!userId) {
      alert("User ID tidak ditemukan. Silakan login ulang.");
      return;
    }

    const services = cartItems.map((item) => {
      const match = item.name.match(/\(([^)]+)\)/);
      const extractedItem = match ? match[1] : "";

      return {
        serviceId: item.id,
        quantity: item.quantity,
        items: extractedItem,
        latLng: item.latLng,
      };
    });

    const orderData = {
      userId,
      services,
      address,
      latLng: selectedLatLng, // ✅ Gunakan koordinat yang dipilih dari peta
    };

    console.log("=== Data yang dikirim ke backend ===");
    console.log(JSON.stringify(orderData, null, 2));

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengkonfirmasi pesanan");
      }

      alert("Pesanan berhasil dikonfirmasi!");
      setCartItems([]);
      localStorage.removeItem("cartItems");
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error("Receipt - Error confirming order:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalHarga = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h3 className="text-2xl font-bold mb-4 text-center">Nota Pesanan</h3>

      {loadingData ? (
        <p className="text-center text-gray-500">Memuat data pesanan...</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Keranjang kosong.</p>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <span className="flex-grow">
                    {item.name} x {item.quantity}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>Rp {item.price * item.quantity}</span>
                    <button
                      onClick={() => handleRemoveFromCart(item.key)}
                      className="text-red-500 hover:bg-red-100 rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="mt-4 text-right font-semibold">
              Total: Rp {totalHarga.toLocaleString("id-ID")}
            </div>
          )}
        </>
      )}

      <div className="mt-6">
        {/* ✅ Pass handler ke MapComponent untuk menerima koordinat */}
        <MapComponent onLocationSelect={handleLocationSelect} />
        <input
          type="text"
          placeholder="Masukkan Detail Alamat"
          className="w-full p-2 border rounded mt-4"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* ✅ Tampilkan koordinat yang dipilih */}
        {selectedLatLng && (
          <p className="text-sm text-gray-600 mt-2">
            Koordinat: {selectedLatLng.lat.toFixed(6)},{" "}
            {selectedLatLng.lng.toFixed(6)}
          </p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-gray-600 hover:underline"
        >
          Kembali
        </button>
        <button
          onClick={handleConfirmOrder}
          className={`px-4 py-2 rounded-lg text-white ${
            isSubmitting || cartItems.length === 0 || !selectedLatLng
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FF8225] hover:bg-[#e9741f]"
          }`}
          disabled={isSubmitting || cartItems.length === 0 || !selectedLatLng}
        >
          {isSubmitting ? "Mengirim..." : "Konfirmasi"}
        </button>
      </div>
    </div>
  );
}
