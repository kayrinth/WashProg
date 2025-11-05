import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Input } from "../atoms";
import { logo2 } from "../../assets";
import useAuthStore from "../../stores/useAuthStore";
import { toast } from "react-toastify";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginForm({ loginData, handleInputChange }) {
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
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

          <div className="relative">
            <Input
              id="hs-toggle-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Masukan password"
              value={loginData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
            >
              {showPassword ? (
                <svg
                  className="shrink-0 size-4"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg
                  className="shrink-0 size-4"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
              )}
            </button>
          </div>

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
  openSendOTP: PropTypes.func.isRequired,
};
