import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { logo } from "../../assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ConfirmOTPForm({ openRegister }) {
  const [otpCode, setOtpCode] = useState("");
  const inputRefs = useRef([]);

  const handleOTPChange = (e, i) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const otpArr = otpCode.split("");
    otpArr[i] = val;
    const updatedOtp = otpArr.join("");
    setOtpCode(updatedOtp);

    if (val && i < 5) {
      inputRefs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otpCode[i] && i > 0) {
      inputRefs.current[i - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    const phoneFromStorage = localStorage.getItem("phoneNumber");
    try {
      const res = await fetch(`${API_BASE_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneFromStorage,
          otp: otpCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verifikasi OTP gagal");

      const { phoneNumber } = data.data;
      localStorage.setItem("phoneNumber", phoneNumber);

      toast.success("Verifikasi OTP berhasil!");
      setOtpCode("");
      openRegister();
    } catch (err) {
      console.error("Verifikasi OTP error:", err.message);
      toast.error(err.message || "Verifikasi OTP gagal!");
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
        <h2 className="text-xl font-semibold mb-1">Verifikasi OTP</h2>
        <p className="text-xs text-gray-500 mb-4">
          Masukkan 4 digit kode OTP yang dikirim ke WhatsApp Anda
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-10 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                value={otpCode[i] || ""}
                onChange={(e) => handleOTPChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputRefs.current[i] = el)}
              />
            ))}
        </div>

        <button
          className="bg-black text-white px-4 py-2 w-full rounded-md hover:bg-gradient-to-r from-black to-gray-800 mb-2"
          onClick={handleVerifyOTP}
        >
          Verifikasi
        </button>
      </div>
    </div>
  );
}

ConfirmOTPForm.propTypes = {
  registerData: PropTypes.shape({
    phoneNumber: PropTypes.string.isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  openRegister: PropTypes.func.isRequired,
};
