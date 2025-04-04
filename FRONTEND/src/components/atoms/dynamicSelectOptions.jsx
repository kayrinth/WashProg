import PropTypes from "prop-types";

const Select = ({ name, value, options, onChange, className }) => {
  return (
    <select name={name} value={value} onChange={onChange} className={className}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Select;
