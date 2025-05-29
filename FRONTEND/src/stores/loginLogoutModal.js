// hooks/useLoginModal.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const useLoginModal = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
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
    setIsRegisterOpen(false);
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
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

    toast.success("Logout Berhasil!");
    navigate("/");
    window.location.reload();
  };

  return {
    isLoginOpen,
    isRegisterOpen,
    loginData,
    registerData,
    openLogin,
    openRegister,
    closeAllModals,
    handleLoginInputChange,
    handleRegisterInputChange,
    handlePesanClick,
    onGoogleSignIn,
    setIsLoginOpen,
    setIsRegisterOpen,
    logout,
  };
};
