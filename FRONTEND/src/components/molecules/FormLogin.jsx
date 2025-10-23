import PropTypes from "prop-types";
import { useState } from "react";
import { Input } from "../atoms";
import { logo } from "../../assets";
import useAuthStore from "../../stores/useAuthStore";
import { toast } from "react-toastify";
import { LogIn, UserPlus } from "lucide-react";
import { AnimatedContent } from "../reactBits";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginForm({
  loginData,
  handleInputChange,
  onClose,
  openSendOTP,
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const [errors, setErrors] = useState({
    phoneNumber: "",
    password: "",
  });

  const validate = () => {
    let isValid = true;
    const newErrors = { phoneNumber: "", password: "" };

    if (!loginData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Nomor telepon wajib diisi";
      isValid = false;
    }

    if (!loginData.password.trim()) {
      newErrors.password = "Password wajib diisi";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const phoneToSend = loginData.phoneNumber.startsWith("0")
        ? "+62" + loginData.phoneNumber.slice(1)
        : "+62" + loginData.phoneNumber;

      const payload = {
        ...loginData,
        phoneNumber: phoneToSend,
      };

      const res = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");

      const { token, user, userId } = data.data;

      setUser(
        {
          phoneNumber: user.phoneNumber,
          name: user.name,
          userId: userId,
        },
        token
      );
      toast.success("Login berhasil!");

      handleInputChange({ target: { name: "phoneNumber", value: "" } });
      handleInputChange({ target: { name: "password", value: "" } });
      setErrors({ phoneNumber: "", password: "" });

      onClose();
    } catch (err) {
      console.error("Login error:", err.message);
      toast.error("Nomor telepon atau password salah!");
    }
  };

  // const handleLoginGoogle = () => {
  //   try {
  //     sessionStorage.setItem("loginAttempt", "google");
  //     toast.info("Mengarahkan ke Google...");
  //     window.location.href = `${API_BASE_URL}/user/google/login`;
  //   } catch (error) {
  //     console.error("Error initiating Google login:", error);
  //     toast.error("Gagal memulai login Google");
  //   }
  // };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <AnimatedContent className="fixed inset-0 flex justify-center items-center z-999">
          <div className="bg-white p-6 rounded-[2rem] shadow-lg w-80 text-center border border-gray-800">
            <img
              src={logo}
              alt="WashProg Logo"
              className="w-44 md:w-48 mx-auto mb-4"
              loading="lazy"
            />
            <h2 className="text-xl font-semibold mb-4">Masuk</h2>

            <div className="mb-2 text-left">
              <Input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={15}
                name="phoneNumber"
                value={loginData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleInputChange({ target: { name: "phoneNumber", value } });
                  if (value)
                    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
                }}
                placeholder="Nomor Telepon"
                className={`w-full p-2 border rounded ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="mb-2 text-left">
              <Input
                type="password"
                name="password"
                value={loginData.password}
                placeholder="Password"
                onChange={(e) => {
                  handleInputChange(e);
                  if (e.target.value)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`w-full p-2 border rounded ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 w-full rounded-md text-base font-semibold shadow-md shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 justify-center mb-2"
              onClick={handleLogin}
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </button>

            <button
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 w-full rounded-md text-base font-semibold shadow-md shadow-gray-900/20 transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0 justify-center "
              onClick={openSendOTP}
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar</span>
            </button>

            {/* <div className="my-4 text-gray-500">Atau</div> */}

            {/* 
        <button
          className="flex items-center justify-center w-full border rounded-md py-2 hover:bg-gray-100"
          onClick={handleLoginGoogle}
        >
          <FcGoogle className="text-2xl mr-2" />
          <span>Google</span>
        </button> 
        */}

            <button
              className="text-gray-500 hover:text-gray-700 mt-4"
              onClick={onClose}
            >
              Batal
            </button>
          </div>
        </AnimatedContent>
      </div>
    </>
  );
}

LoginForm.propTypes = {
  loginData: PropTypes.shape({
    phoneNumber: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  openSendOTP: PropTypes.func.isRequired,
};
