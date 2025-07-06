import { useState } from "react";
import { LoginForm } from "../components/moleculs/";

export default function LoginPage() {
  // State untuk data login
  const [loginData, setLoginData] = useState({ phoneNumber: "", password: "" });

  // Event handler untuk input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const openSendOTP = () => {
    alert("Navigasi ke halaman register");
  };

  return (
    <div>
      <LoginForm
        loginData={loginData}
        handleInputChange={handleInputChange}
        openSendOTP={openSendOTP}
      />
    </div>
  );
}
