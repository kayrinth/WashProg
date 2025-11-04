import { useState, useEffect } from "react";
import MapComponent from "../molecules/leaflet/MapComponent";
import { MdDelete } from "react-icons/md";
import LoadingOverlay from "../templates/loading";
import SuccessModal from "../templates/success";
import ErrorModal from "../templates/error";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Receipt() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [value, setValue] = useState("");
  const maxLength = 100;
  // const navigate = useNavigate();

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
    setIsSubmitting(true);
    setOrderStatus(null);

    if (!selectedLatLng) {
      alert("Silakan pilih lokasi pada peta terlebih dahulu");
      return;
    }

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("auth");

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
      lat: selectedLatLng.lat,
      lng: selectedLatLng.lng,
      latLng: selectedLatLng,
    };

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
      //mendelay pesanan
      await new Promise((resolve) => setTimeout(resolve, 2000));
      //menampilkan modal
      setOrderStatus("success");
      setCartItems([]);
      localStorage.removeItem("cartItems");
    } catch (error) {
      console.error("Receipt - Error confirming order:", error);
      setOrderStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalHarga = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setValue(e.target.value);
    setAddress(e.target.value);
  };

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

      <div className="mt-6 z-50">
        <MapComponent onLocationSelect={handleLocationSelect} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <textarea
            className="w-full p-2 border rounded mt-4"
            value={address}
            onChange={handleChange}
            maxLength={maxLength}
            rows={4}
            placeholder="Masukkan Detail Alamat..."
          />
          <small
            style={{
              alignSelf: "flex-end",
              color: value.length === maxLength ? "red" : "black",
            }}
          >
            {value.length}/{maxLength}
          </small>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-gray-600 hover:underline"
        >
          Kembali
        </button>
        <div>
          <button
            onClick={handleConfirmOrder}
            className={`px-4 py-2 rounded-lg text-white ${
              isSubmitting || cartItems.length === 0 || !selectedLatLng
                ? "bg-gray-400 cursor-not-allowed"
                : "w-full bg-[#068FFF] text-white py-2 rounded-md text-sm md:text-lg transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#068FFF] hover:to-blue-600hover:shadow-lg hover:shadow-blue-900/50 hover:scale-[1.02] active:scale-[0.98]"
            }`}
            disabled={isSubmitting || cartItems.length === 0 || !selectedLatLng}
          >
            {isSubmitting ? "Konfirmasi" : "Konfirmasi"}
          </button>

          {isSubmitting && <LoadingOverlay />}

          {orderStatus === "success" && (
            <SuccessModal
              onClose={() => setOrderStatus(null)}
              title="Pesanan Berhasil Dikirim!"
              message="Pesanan Anda telah berhasil diterima dan sedang diproses."
            />
          )}

          {orderStatus === "error" && (
            <ErrorModal
              onClose={() => setOrderStatus(null)}
              onRetry={handleConfirmOrder}
              title="Gagal Mengirim Pesanan"
              message="Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi."
            />
          )}
        </div>
      </div>
    </div>
  );
}
