import { useState } from "react";
import { SelectCategory, SelectService, FormInput } from "../moleculs";
import LoadingOverlay from "../template/loading";
import SuccessModal from "../template/success";
import ErrorModal from "../template/error";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OrderNew() {
  const [selectedService, setSelectedService] = useState(null);
  const [inputName, setInputName] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [InputDetail, setInputDetail] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleOrderNew = async () => {
    setIsSubmitting(true);
    setOrderStatus(null);
    const token = localStorage.getItem("token");
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

    const orderPayload = {
      name: inputName,
      phoneNumber: inputPhone,
      services: [
        {
          serviceId: selectedService._id,
          quantity: 1,
          items: InputDetail,
        },
      ],
    };

    try {
      const res = await fetch(`${API_BASE_URL}/order/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengkonfirmasi pesanan");
      }
      //mendelay pesanan
      await new Promise((resolve) => setTimeout(resolve, 2000));
      //menampilkan modal
      setOrderStatus("success");
    } catch (error) {
      console.error("Error:", error);
      setOrderStatus("error");
    } finally {
      setIsSubmitting(false);
    }

    setInputName("");
    setInputPhone("");
    setInputDetail("");
    setSelectedService(null);
  };

  return (
    <div className="w-full">
      {/* Order Section */}
      <div className="flex items-center justify-center min-h-screen ">
        <div className="p-8 max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Buat Pesanan
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
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
                onClick={handleOrderNew}
                className="w-full bg-[#068FFF] text-white text-lg py-2 rounded-lg shadow-md hover:bg-opacity-50 transition-all"
              >
                Pesan
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
                  onRetry={handleOrderNew}
                  title="Gagal Mengirim Pesanan"
                  message="Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
