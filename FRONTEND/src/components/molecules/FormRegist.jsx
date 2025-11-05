import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Input } from "../atoms";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RegisterForm({
  registerData,
  handleInputChange,
  goToLogin,
}) {
  const [storedPhone, setStoredPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const phone = localStorage.getItem("phoneNumber") || "";
    setStoredPhone(phone);
  }, []);

  const handleRegistrasi = async () => {
    try {
      const { name, password } = registerData;

      const payload = {
        name,
        password,
        phoneNumber: storedPhone,
      };

      const res = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(payload);

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registrasi gagal");

      toast.success("Registrasi berhasil!");
      goToLogin();
    } catch (err) {
      console.error("Registrasi error:", err.message);
      toast.error("Registrasi gagal!");
    }
  };

  return (
    <div className="text-center w-full max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Registrasi</h2>

      <Input
        type="text"
        name="phoneNumber"
        value={storedPhone}
        placeholder="Nomor Telepon"
        disabled
        className="w-full p-2 border rounded mb-2 bg-gray-100 text-gray-500"
      />

      <Input
        type="text"
        name="name"
        value={registerData.name}
        placeholder="Masukan Nama Lengkap"
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-2"
      />

      <div className="relative">
        <Input
          id="hs-toggle-password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Masukan password"
          value={registerData.password}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
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
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-2 w-full rounded-md text-base font-semibold shadow-sm shadow-gray-900/20 transition-all duration-300 hover:bg-gray-800 hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0 justify-center "
        onClick={handleRegistrasi}
      >
        <UserPlus className="w-4 h-4" />
        Registrasi
      </button>
    </div>
  );
}

RegisterForm.propTypes = {
  registerData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  goToLogin: PropTypes.func.isRequired,
};
