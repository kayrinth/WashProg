import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "../atoms/dynamicSelectOptions";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SelectService({ categoryId, onAddToCart }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    async function fetchServices() {
      if (!categoryId) {
        setServices([]);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/service/category/${categoryId}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setServices(data.data);
          setSelectedService(""); // Reset selected service when category changes
        } else {
          console.error("Data service tidak sesuai format:", data);
          setServices([]);
        }
      } catch (error) {
        console.error("Gagal memuat layanan:", error);
        setServices([]);
      }
    }

    fetchServices();
  }, [categoryId]);

  const serviceOptions = services.map((service) => ({
    value: service._id,
    label: `${service.title} - Rp ${service.price.toLocaleString("id-ID")}`,
  }));

  const handleChange = (e) => {
    const serviceId = e.target.value;
    setSelectedService(serviceId);

    const selected = services.find((s) => s._id === serviceId);
    if (selected && onAddToCart) {
      onAddToCart(selected);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wider">
        Pilih Layanan
      </label>
      <Select
        name="service"
        value={selectedService}
        options={serviceOptions}
        onChange={handleChange}
        className="w-full p-3 pr-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-200 bg-white text-gray-700"
        disabled={!categoryId || services.length === 0}
      />
    </div>
  );
}

SelectService.propTypes = {
  categoryId: PropTypes.string,
  onAddToCart: PropTypes.func,
};
