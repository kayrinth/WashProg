import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Input } from "../atoms";
import { logo2 } from "../../assets";
import useAuthStore from "../../stores/useAuthStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginForm({ loginData, handleInputChange }) {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login gagal");

      const { token, user, userId } = data.data;

      setUser(
        { phoneNumber: user.phoneNumber, name: user.name, userId },
        token
      );
      toast.success("Login berhasil!");
      handleInputChange({ target: { name: "phoneNumber", value: "" } });
      handleInputChange({ target: { name: "password", value: "" } });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.message);
      toast.error("Login gagal!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center pb-12">
        <img src={logo2} alt="WashProg Logo" className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Login</h1>
        <p className="text-gray-500 text-sm">Untuk Admin</p>

        <form onSubmit={handleLogin} className="mt-4 space-y-3">
          <Input
            type="text"
            name="phoneNumber"
            value={loginData.phoneNumber}
            placeholder="Nomor Whatsapp"
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <Input
            type="password"
            name="password"
            value={loginData.password}
            placeholder="Password"
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="bg-black text-white rounded w-full p-2 hover:bg-gradient-to-r from-black to-gray-800"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

LoginForm.propTypes = {
  loginData: PropTypes.shape({
    phoneNumber: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  openRegister: PropTypes.func.isRequired,
};
