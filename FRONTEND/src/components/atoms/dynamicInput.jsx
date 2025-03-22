import PropTypes from "prop-types";

const Input = ({
  type,
  name,
  value,
  placeholder,
  onChange,
  className,
  disabled,
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      className={className}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Input;
