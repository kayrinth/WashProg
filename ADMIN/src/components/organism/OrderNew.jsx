import { useState } from "react";
import { SelectCategory, SelectService, FormInput } from "../moleculs";
import LoadingOverlay from "../template/loading";
import SuccessModal from "../templa te/success";
import ErrorModal from "../template/error";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OrderNew() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [InputDetail, setInputDetail] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleAddToCart = () => {
    let isValid = true;

    if (inputName.trim() === "") {
      setNameError("Nama Pelanggan wajib diisi");
      isValid = false;
    } else {
      setNameError("");
    }

    if (inputPhone.trim() === "") {
      setPhoneError("Nomor Telepon wajib diisi");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!selectedCategoryId) {
      setCategoryError("Pilih category terlebih dahulu.");
      isValid = false;
    } else {
      setCategoryError("");
    }

    if (!selectedService) {
      setServiceError("Pilih layanan terlebih dahulu.");
      isValid = false;
    } else {
      setServiceError("");
    }

    if (InputDetail.trim() === "") {
      setDetailError("Detail item wajib diisi");
      isValid = false;
    } else {
      setDetailError("");
    }

    if (!isValid) return;

    const uniqueKey = `${
      selectedService._id
    }-${InputDetail.trim().toLowerCase()}`;

    const serviceToAdd = {
      key: uniqueKey,
      id: selectedService._id,
      name: `${selectedService.title} (${InputDetail})`,
      price: selectedService.price,
      detail: InputDetail,
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

    // Reset form setelah menambah ke keranjang
    setInputDetail("");
    setSelectedService(null);
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    setOrderStatus(null);

    const token = localStorage.getItem("token");
    const currentCartItems = [...cartItems];

    const orderData = {
      name: inputName,
      phoneNumber: inputPhone,
      services: currentCartItems.map((item) => ({
        serviceId: item.id,
        quantity: item.quantity,
        items: item.detail,
      })),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/order/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: await res.text() };
      }

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengkonfirmasi pesanan");
      }

      // Reset semua state setelah berhasil
      setCartItems([]);
      localStorage.removeItem("cartItems");
      setInputName("");
      setInputPhone("");
      setInputDetail("");
      setSelectedService(null);
      setSelectedCategoryId("");

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      setOrderStatus("success");
    } catch (error) {
      console.error("Receipt - Error confirming order:", error);
      setIsSubmitting(false);
      setOrderStatus("error");
    }
  };

  const handleModalClose = () => {
    setOrderStatus(null);
  };

  return (
    <div className="w-full">
      {/* Loading Overlay - di level tertinggi */}
      {isSubmitting && <LoadingOverlay />}

      {/* Success Modal */}
      {orderStatus === "success" && (
        <SuccessModal
          onClose={handleModalClose}
          title="Pesanan Berhasil Dikirim!"
          message="Pesanan Anda telah berhasil diterima dan sedang diproses."
        />
      )}

      {/* Error Modal */}
      {orderStatus === "error" && (
        <ErrorModal
          onClose={handleModalClose}
          onRetry={handleConfirmOrder}
          title="Gagal Mengirim Pesanan"
          message="Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi."
        />
      )}

      {/* Order Section */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Buat Pesanan
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            <div>
              <FormInput
                label="Nama Pelanggan"
                placeholder="Masukan Nama Pelanggan"
                value={inputName}
                onChange={setInputName}
                required
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>

            <div>
              <FormInput
                type="number"
                label="Nomor Telepon"
                placeholder="Masukan Nomor Telepon"
                value={inputPhone}
                onChange={setInputPhone}
                required
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>

            <div>
              <SelectCategory onCategorySelect={handleCategorySelect} />
              {categoryError && (
                <p className="text-red-500 text-sm mt-1">{categoryError}</p>
              )}
            </div>

            <div>
              <SelectService
                categoryId={selectedCategoryId}
                onAddToCart={(service) => {
                  setSelectedService(service);
                  setServiceError("");
                }}
              />
              {serviceError && (
                <p className="text-red-500 text-sm mt-1">{serviceError}</p>
              )}
            </div>

            <div>
              <FormInput
                label="Detail Barang"
                placeholder="New Balance, Puma, dll"
                value={InputDetail}
                onChange={setInputDetail}
                required
              />
              {detailError && (
                <p className="text-red-500 text-sm mt-1">{detailError}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isSubmitting}
                className="w-full bg-[#068FFF] text-white py-2 rounded-md text-sm md:text-lg 
                         transition-all duration-300 ease-in-out
                         hover:bg-gradient-to-r hover:from-[#068FFF] hover:to-blue-600
                         hover:shadow-lg hover:shadow-blue-900/50 
                         hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Masukan Keranjang
              </button>
            </div>

            {/* Cart Items Display */}
            {cartItems.length > 0 && (
              <div className="bottom-0 left-0 right-0 bg-white shadow-2xl p-4 border border-gray-200 rounded-md">
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
                      onClick={handleConfirmOrder}
                      disabled={isSubmitting}
                      className="bg-[#068FFF] text-white px-3 py-1 rounded-md text-sm md:text-lg 
                               transition-all duration-300 ease-in-out
                               hover:bg-gradient-to-r hover:from-[#068FFF] hover:to-blue-600
                               hover:shadow-lg hover:shadow-blue-900/50 
                               hover:scale-[1.02] active:scale-[0.98]
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Processing..." : "Checkout"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
