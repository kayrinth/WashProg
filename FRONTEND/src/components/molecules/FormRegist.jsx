import PropTypes from "prop-types";
import { Input } from "../atoms";
import { logo } from "../../assets";

export default function RegisterForm({ registerData, handleChange, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <img
          src={logo}
          alt="WashProg Logo"
          className="w-28 md:w-36 xl:w-48 mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold mb-4">Registrasi</h2>

        <Input
          type="text"
          name="username"
          value={registerData.username}
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />
        <Input
          type="email"
          name="email"
          value={registerData.email}
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />
        <Input
          type="password"
          name="password"
          value={registerData.password}
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <button className="bg-black text-white px-4 py-2 w-full rounded-md hover:bg-gradient-to-r from-black to-gray-800 mb-2">
          Daftar
        </button>

        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          Batal
        </button>
      </div>
    </div>
  );
}

RegisterForm.propTypes = {
  registerData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
