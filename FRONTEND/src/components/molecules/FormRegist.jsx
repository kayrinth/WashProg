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
        placeholder="Nama Lengkap"
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-2"
      />

      <Input
        type="password"
        name="password"
        value={registerData.password}
        placeholder="Password"
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-2"
      />

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
