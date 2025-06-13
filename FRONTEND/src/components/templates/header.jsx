// components/Header.jsx
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { logo } from "../../assets";
import { LoginForm, RegisterForm } from "../molecules";
import useAuthStore from "../../stores/useAuthStore";
import { useLoginModal } from "../../stores/loginLogoutModal";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const {
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
    logout,
  } = useLoginModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 py-4 px-6 flex justify-between items-center max-w-7xl mx-auto rounded-b-2xl transition-all duration-300
    ${isScrolled && !isOpen ? "shadow-lg backdrop-blur-xl pt-4" : ""}
    ${isOpen ? "bg-white shadow-lg" : ""}
  `}
      >
        {/* Logo */}
        <div className="text-black font-bold text-lg flex items-center">
          <img src={logo} alt="WashProg" className="h-10" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-black font-medium">
          <a href="/" className="hover:text-gray-600">
            Beranda
          </a>
          <a href="/menu" className="hover:text-gray-600">
            Daftar Menu
          </a>
          <a
            href="#"
            onClick={handlePesanClick}
            className="hover:text-gray-600"
          >
            Pesan Sekarang
          </a>
          <a href="#" className="hover:text-gray-600">
            Tentang Kami
          </a>
        </nav>

        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">
              Halo, {user.name}
            </span>
            <button
              onClick={logout}
              className="text-red-500 text-sm hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="bg-[#FF8225] text-white font-semibold px-4 py-2 rounded-md hover:bg-opacity-50 hidden md:flex items-center"
            onClick={openLogin}
          >
            Login
          </button>
        )}
        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={28} />
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-4 text-center md:hidden">
            <a href="/" className="hover:text-gray-600">
              Beranda
            </a>
            <a href="/menu" className="hover:text-gray-600">
              Daftar Menu
            </a>
            <a
              href="#"
              onClick={handlePesanClick}
              className="hover:text-gray-600"
            >
              Pesan Sekarang
            </a>
            <a href="#" className="hover:text-gray-600">
              Tentang Kami
            </a>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">
                  Halo, {user.name}
                </span>
                <button
                  // onClick={logout}
                  className="text-red-500 text-sm hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="bg-[#FF8225] text-white font-semibold px-4 py-2 rounded-md hover:bg-opacity-50"
                onClick={openLogin}
              >
                Login
              </button>
            )}
          </div>
        )}
      </header>

      {/* Login Popup */}
      {isLoginOpen && (
        <LoginForm
          loginData={loginData}
          handleInputChange={handleLoginInputChange}
          onGoogleSignIn={onGoogleSignIn}
          onClose={closeAllModals}
          openRegister={openRegister}
        />
      )}

      {isRegisterOpen && (
        <RegisterForm
          registerData={registerData}
          handleChange={handleRegisterInputChange}
          onClose={closeAllModals}
        />
      )}
    </>
  );
}
