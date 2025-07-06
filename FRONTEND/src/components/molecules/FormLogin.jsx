import PropTypes from "prop-types";
import { Input } from "../atoms";
import { logo } from "../../assets";
import { FcGoogle } from "react-icons/fc";
import useAuthStore from "../../stores/useAuthStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginForm({
  loginData,
  handleInputChange,
  onClose,
  openSendOTP,
}) {
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
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

      console.log("API_BASE_URL:", API_BASE_URL);
      console.log("Login data:", payload);
      console.log("Response status:", res.status);

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

      onClose();
    } catch (err) {
      console.error("Login error:", err.message);
      toast.error("Login gagal!");
    }
  };

  const handleLoginGoogle = () => {
    try {
      sessionStorage.setItem("loginAttempt", "google");
      toast.info("Mengarahkan ke Google...");
      window.location.href = `${API_BASE_URL}/user/google/login`;
    } catch (error) {
      console.error("Error initiating Google login:", error);
      toast.error("Gagal memulai login Google");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <img src={logo} alt="WashProg Logo" className="w-28 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-4">Login</h2>

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
          }}
          placeholder="0812XXXXXXXX"
          className="w-full p-2 mb-2 border rounded"
        />
        <Input
          type="password"
          name="password"
          value={loginData.password}
          placeholder="Password"
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
        />

        <button
          className="bg-black text-white px-4 py-2 w-full rounded-md hover:bg-gradient-to-r from-black to-gray-800 mb-2"
          onClick={handleLogin}
        >
          Masuk
        </button>
        <button
          className="bg-black text-white px-4 py-2 w-full rounded-md hover:bg-gradient-to-r from-black to-gray-800"
          onClick={openSendOTP}
        >
          Registrasi
        </button>

        <div className="my-4 text-gray-500">Atau</div>

        <button
          className="flex items-center justify-center w-full border rounded-md py-2 hover:bg-gray-100"
          onClick={handleLoginGoogle}
        >
          <FcGoogle className="text-2xl mr-2" />
          <span>Google</span>
        </button>

        <button
          className="text-gray-500 hover:text-gray-700 mt-4"
          onClick={onClose}
        >
          Batal
        </button>
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
  onGoogleSignIn: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  openSendOTP: PropTypes.func.isRequired,
};
