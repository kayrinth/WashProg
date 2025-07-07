import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Input } from "../atoms";
import { logo } from "../../assets";
import { toast } from "react-toastify";
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
          className="bg-black text-white px-4 py-2 w-full rounded-md hover:bg-gradient-to-r from-black to-gray-800 mb-2"
          onClick={handleRegistrasi}
        >
          Registrasi
        </button>
      </div>
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
