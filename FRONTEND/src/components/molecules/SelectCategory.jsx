import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "../atoms/dynamicSelectOptions";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SelectCategory({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.error("Data kategori tidak sesuai format:", data);
        }
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
      }
    }
    fetchCategories();
  }, []);

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.title,
  }));

  const handleChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    // Kirim categoryId ke parent component
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wider">
        Pilih Kategori
      </label>
      <Select
        name="category"
        value={selectedCategory}
        options={categoryOptions}
        onChange={handleChange}
        className="w-full p-3 pr-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-200 bg-white text-gray-700"
      />
    </div>
  );
}

SelectCategory.propTypes = {
  onCategorySelect: PropTypes.func,
};
