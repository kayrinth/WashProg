import { useState } from "react";
import { Select } from "../atoms";

export default function SelectService({ onAddToCart }) {
  const [selectedService, setSelectedService] = useState("");

  const services = [
    { id: "1", name: "Cuci AC" },
    { id: "2", name: "Service Kompor" },
    { id: "3", name: "Perbaikan Listrik" },
  ];

  const handleChange = (e) => {
    const selected = services.find((s) => s.id === e.target.value);
    setSelectedService(selected.id);
    onAddToCart && onAddToCart(selected); // Kirim data ke cart
  };

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wider">
        Pilih Layanan
      </label>
      <select
        value={selectedService}
        onChange={handleChange}
        className="w-full p-3 pr-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-200 bg-white text-gray-700"
      >
        <option value="">Pilih layanan</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>
    </div>
  );
}
