import PropTypes from "prop-types";
import { Input } from "../atoms";

export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  className = "",
  labelClassName = "",
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          className={`block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wider ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition duration-200 ${className}`}
      />
    </div>
  );
}

FormInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
};
