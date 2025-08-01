import PropTypes from "prop-types";
import { Input } from "../atoms";
import { logo } from "../../assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SendOTPForm({
  registerData,
  handleInputChange,
  onClose,
  openConfirmOTP,
}) {
  const handleSendOTP = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      console.log("Full response data:", data);

      if (!res.ok) throw new Error(data.message || "send OTP gagal");

      const { phoneNumber } = data.data;
      localStorage.setItem("phoneNumber", phoneNumber);
      localStorage.setItem("otpSent", "true");

      toast.success("Send OTP berhasil!");

      handleInputChange({ target: { name: "phoneNumber", value: "" } });
      openConfirmOTP();
    } catch (err) {
      console.error("Send OTP error:", err.message);
      toast.error("Send OTP gagal!");
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
        <h2 className="text-xl font-semibold">Registrasi</h2>
        <h5 className="text-xs font-normal mb-4">
          Masukkan Nomor untuk kirim OTP
        </h5>

        <Input
          type="number"
          name="phoneNumber"
          value={registerData.phoneNumber}
          placeholder="0812XXXXXXXX"
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          className="bg-black text-white px-4 py-2 w-full rounded-md hover:bg-gradient-to-r from-black to-gray-800 mb-2"
          onClick={handleSendOTP}
        >
          Kirim OTP
        </button>

        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          Batal
        </button>
      </div>
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
};
