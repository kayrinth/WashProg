import { useState } from "react";
import { SelectCategory, SelectService, InputNameItems } from "../molecules";
import MapComponent from "../molecules/leaflet/MapComponent";
import { order } from "../../assets";

export default function Menu() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [inputName, setInputName] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);

  const handleAddToCart = () => {
    if (!selectedService || inputName.trim() === "") return;

    const uniqueKey = `${selectedService.id}-${inputName.trim().toLowerCase()}`;

    const serviceToAdd = {
      key: uniqueKey,
      id: selectedService.id,
      name: `${selectedService.name} (${inputName})`,
    };

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.key === uniqueKey);
      if (existingItem) {
        return prevItems.map((item) =>
          item.key === uniqueKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...serviceToAdd, quantity: 1 }];
      }
    });

    // Reset form
    setInputName("");
    // setSelectedService(null);
  };

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <div
        className="relative w-full h-96 flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${order})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Pesan Layanan dengan Mudah
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Temukan layanan terbaik untuk kebutuhan Anda
          </p>
        </div>
      </div>

      {/* Order Section */}
      <div className="flex items-center justify-center px-4">
        <div className="p-8 max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 transform -translate-y-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Pilih Kategori & Layanan
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            <SelectCategory />
            <SelectService onSelectService={setSelectedService} />
            <InputNameItems inputName={inputName} setInputName={setInputName} />

            <div className="pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#FF8225] text-white text-lg py-2 rounded-lg shadow-md hover:bg-opacity-50 transition-all"
              >
                Pesan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 border-t z-50">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">Pesanan Anda:</h4>
              {cartItems.map((item, index) => (
                <p key={index}>
                  {item.name} x {item.quantity}
                </p>
              ))}
            </div>
            <button
              onClick={() => setShowReceipt(true)}
              className="bg-[#FF8225] text-white px-4 py-2 rounded-lg shadow-md"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl max-h-[90vh] max-w-md w-full shadow-2xl relative mx-4 overflow-y-auto p-6">
            <h3 className="text-xl font-bold mb-4 text-center">Nota Pesanan</h3>

            <div className="space-y-2 mb-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>x {item.quantity}</span>
                </div>
              ))}

              <MapComponent />
            </div>

            <div className="flex justify-between mt-4 sticky bottom-0 bg-white pt-4">
              <button
                onClick={() => setShowReceipt(false)}
                className="text-sm text-gray-600 hover:underline"
              >
                Kembali
              </button>
              <button
                onClick={() => {
                  alert("Pesanan berhasil dikonfirmasi!");
                  setCartItems([]);
                  setShowReceipt(false);
                }}
                className="bg-[#FF8225] text-white px-4 py-2 rounded-lg"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
