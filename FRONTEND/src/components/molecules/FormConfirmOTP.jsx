import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { ShieldCheck } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ConfirmOTPForm({ openRegister, goToNextStep }) {
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
      goToNextStep();
    } catch (err) {
      console.error("Verifikasi OTP error:", err.message);
      toast.error(err.message || "Verifikasi OTP gagal!");
    }
  };

  return (
    <div className="text-center w-full max-w-sm mx-auto">
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
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-2 w-full rounded-md text-base font-semibold shadow-sm shadow-gray-900/20 transition-all duration-300 hover:bg-gray-800 hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0 justify-center "
        onClick={handleVerifyOTP}
      >
        <ShieldCheck className="w-4 h-4" />
        Verifikasi
      </button>
    </div>
  );
}

ConfirmOTPForm.propTypes = {
  registerData: PropTypes.shape({
    phoneNumber: PropTypes.string.isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  openRegister: PropTypes.func.isRequired,
  goToNextStep: PropTypes.func.isRequired,
};
