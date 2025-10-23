import PropTypes from "prop-types";
import { Input } from "../atoms";
import { MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SendOTPForm({
  registerData,
  handleInputChange,
  openConfirmOTP,
  goToNextStep,
}) {
  const handleSendOTP = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Send OTP gagal");

      const { phoneNumber } = data.data;
      localStorage.setItem("phoneNumber", phoneNumber);
      localStorage.setItem("otpSent", "true");

      toast.success("Send OTP berhasil!");
      handleInputChange({ target: { name: "phoneNumber", value: "" } });
      openConfirmOTP();
      goToNextStep();
    } catch (err) {
      console.error("Send OTP error:", err.message);
      toast.error("Send OTP gagal!");
    }
  };

  return (
    <div className="text-center w-full max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-1">Registrasi</h2>
      <p className="text-xs font-normal mb-4">Masukkan Nomor untuk kirim OTP</p>

      <Input
        type="number"
        name="phoneNumber"
        value={registerData.phoneNumber}
        placeholder="0812XXXXXXXX"
        onChange={handleInputChange}
        className="w-full p-2 border rounded mb-2"
      />

      <button
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-2 w-full rounded-md text-base font-semibold shadow-sm shadow-gray-900/20 transition-all duration-300 hover:bg-gray-800 hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0 justify-center "
        onClick={handleSendOTP}
      >
        <MessageSquare className="w-4 h-4" />
        Kirim OTP
      </button>
    </div>
  );
}

SendOTPForm.propTypes = {
  registerData: PropTypes.shape({
    phoneNumber: PropTypes.string.isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  openConfirmOTP: PropTypes.func.isRequired,
  goToNextStep: PropTypes.func.isRequired,
};
