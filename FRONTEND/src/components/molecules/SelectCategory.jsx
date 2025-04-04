import { useState } from "react";
import { Select } from "../atoms";

export default function SelectService() {
  const [selectedOption, setSelectedOption] = useState("Kategori");

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wider">
        Pilih kategori
      </label>
      <Select
        name="example"
        value={selectedOption}
        options={["Kategori", "Option 1", "Option 2", "Option 3"]}
        onChange={(e) => setSelectedOption(e.target.value)}
        className="w-full p-3 pr-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-200 bg-white text-gray-700 hover:border-gray-300"
      />
    </div>
  );
}
