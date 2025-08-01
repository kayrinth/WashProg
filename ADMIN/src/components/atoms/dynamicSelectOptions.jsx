// atoms/dynamicSelectOptions.jsx
import PropTypes from "prop-types";

const Select = ({ name, value, options, onChange, className }) => {
  return (
    <select name={name} value={value} onChange={onChange} className={className}>
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Select;
