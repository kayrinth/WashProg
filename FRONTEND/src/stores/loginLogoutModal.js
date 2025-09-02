// hooks/useLoginModal.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const useLoginModal = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSendOTPOpen, setisSendOTPOpen] = useState(false);
  const [isConfirmOTPOpen, setisConfirmOTPOpen] = useState(false);
  const [isRegisterOpen, setisRegisterOpen] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setisSendOTPOpen(false);
  };

  const openSendOTP = () => {
    setisSendOTPOpen(true);
    setIsLoginOpen(false);
  };

  const openConfirmOTP = () => {
    setisConfirmOTPOpen(true);
    setisSendOTPOpen(false);
  };

  const openRegister = () => {
    setisRegisterOpen(true);
    setisConfirmOTPOpen(false);
  };

  const goToLogin = () => {
    setIsLoginOpen(true);
    setisRegisterOpen(false);
  };

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setisSendOTPOpen(false);
  };

  const handlePesanClick = (e) => {
    e.preventDefault();

    const user = localStorage.getItem("auth");

    if (user) {
      navigate("/pesan");
    } else {
      openLogin();
    }
  };

  const onGoogleSignIn = () => {
    console.log("Login dengan Google...");
  };

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("otpSent");
    localStorage.removeItem("cartItems");

    toast.success("Logout Berhasil!");
    navigate("/");
    window.location.reload();
  };

  return {
    isLoginOpen,
    isSendOTPOpen,
    isConfirmOTPOpen,
    isRegisterOpen,
    loginData,
    registerData,
    openLogin,
    goToLogin,
    openRegister,
    openSendOTP,
    openConfirmOTP,
    closeAllModals,
    handleLoginInputChange,
    handleRegisterInputChange,
    handlePesanClick,
    onGoogleSignIn,
    setIsLoginOpen,
    setisSendOTPOpen,
    logout,
  };
};
