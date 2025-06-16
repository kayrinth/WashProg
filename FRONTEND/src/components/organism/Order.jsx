import { useState, useEffect } from "react";
import { SelectCategory, SelectService, InputNameItems } from "../molecules";
import { order } from "../../assets";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [inputName, setInputName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    if (savedCartItems) {
      try {
        const parsedItems = JSON.parse(savedCartItems);
        setCartItems(parsedItems);
      } catch (error) {
        console.error("Tidak bisa parsing items:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleAddToCart = () => {
    if (!selectedService || inputName.trim() === "") return;

    const uniqueKey = `${selectedService._id}-${inputName
      .trim()
      .toLowerCase()}`;

    const serviceToAdd = {
      key: uniqueKey,
      id: selectedService._id,
      name: `${selectedService.title} (${inputName})`,
      price: selectedService.price,
    };

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.key === uniqueKey);
      let newItems;

      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.key === uniqueKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prevItems, { ...serviceToAdd, quantity: 1 }];
      }
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      return newItems;
    });
  };

  const handleClick = () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    navigate("/receipt");
  };

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <div
        className="relative w-full h-96 flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6)), url(${order})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        loading="lazy"
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
            <SelectCategory onCategorySelect={handleCategorySelect} />
            <SelectService
              categoryId={selectedCategoryId}
              onAddToCart={(service) => setSelectedService(service)}
            />
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
            <div>
              <button
                onClick={handleClick}
                className="bg-[#FF8225] text-white px-4 py-2 rounded-lg shadow-md"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
