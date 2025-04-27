import PropTypes from "prop-types";
import { Input } from "../atoms";

export default function InputNameItems({ inputName, setInputName }) {
  return (
    <>
      <label className="block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wider">
        Masukan Detail Barang
      </label>

      <Input
        type="text"
        placeholder="New Balance, Puma, dll"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
      />
    </>
  );
}

InputNameItems.propTypes = {
  inputName: PropTypes.string.isRequired,
  setInputName: PropTypes.func.isRequired,
};
