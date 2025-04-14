import PropTypes from "prop-types";
import { Input } from "../atoms";
import { logo } from "../../assets";
import { FcGoogle } from "react-icons/fc";
import useAuthStore from "../../stores/useAuthStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm({
  loginData,
  handleInputChange,
  onGoogleSignIn,
  onClose,
  openRegister,
}) {
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");

      const { token, user } = data.data;

      setUser(
        {
          email: user.email,
          name: user.name,
        },
        token
      );
      toast.success("Login berhasil!");

      handleInputChange({ target: { name: "email", value: "" } });
      handleInputChange({ target: { name: "password", value: "" } });

      onClose();
    } catch (err) {
      console.error("Login error:", err.message);
      toast.error("Login gagal!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <img src={logo} alt="WashProg Logo" className="w-28 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <Input
          type="text"
          name="email"
          value={loginData.email}
          placeholder="Email"
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-2"
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
          onClick={openRegister}
        >
          Registrasi
        </button>

        <div className="my-4 text-gray-500">Atau</div>

        <button
          className="flex items-center justify-center w-full border rounded-md py-2 hover:bg-gray-100"
          onClick={onGoogleSignIn}
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
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onGoogleSignIn: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  openRegister: PropTypes.func.isRequired,
};
