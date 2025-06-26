import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { logo } from "../../assets";
import { LoginForm, RegisterForm } from "../molecules";
import useAuthStore from "../../stores/useAuthStore";
import { useLoginModal } from "../../stores/loginLogoutModal";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        className={`sticky top-0 w-full z-50 py-4 px-6 flex justify-between items-center max-w-7xl mx-auto rounded-b-2xl transition-all duration-300 ${
          isScrolled && !isOpen ? "shadow-lg backdrop-blur-xl pt-4" : ""
        } ${isOpen ? "bg-white shadow-lg" : ""}`}
      >
        {/* ==========================
              DESKTOP LAYOUT
             ========================== */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="text-black font-bold text-lg flex items-center">
            <img src={logo} alt="WashProg" className="h-10" />
          </div>
          <nav className="flex space-x-6 text-black font-medium">
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
            <div className="relative flex items-center gap-2">
              <span
                className="text-sm font-medium text-gray-800 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user.name}
              </span>

              {isDropdownOpen && (
                <div className="absolute top-10 right-0 mt-1 w-40 rounded-md bg-white shadow-lg z-10">
                  <a
                    href="/history"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Riwayat Pesanan
                  </a>
                  <a
                    href="/edit-profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Edit Profil
                  </a>
                  <button
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="bg-[#068FFF] text-white font-semibold px-4 py-2 rounded-md hover:bg-opacity-50"
              onClick={openLogin}
            >
              Login
            </button>
          )}
        </div>

        {/* ==========================
              MOBILE LAYOUT
             ========================== */}
        <div className="flex justify-between items-center w-full md:hidden">
          {user && (
            <span
              className="text-sm font-medium text-gray-800 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user.name}
              {isDropdownOpen && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-2 text-center md:hidden">
                  <a
                    href="/history"
                    className="block px-4 py-1 text-gray-800 hover:bg-gray-100"
                  >
                    Riwayat Pesanan
                  </a>
                  <a
                    href="/edit-profile"
                    className="block px-4 py-1 text-gray-800 hover:bg-gray-100"
                  >
                    Edit Profil
                  </a>
                  <button
                    onClick={logout}
                    className="block px-4 py-1  hover:bg-gray-100 bg-red-500 text-white rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </span>
          )}

          <div className="flex justify-center flex-1">
            <img src={logo} alt="WashProg" className="h-10" />
          </div>
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu size={28} />
          </button>
        </div>

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
            <a href="#" className="hover:text-gray-600 ">
              Tentang Kami
            </a>
            {user ? null : (
              <button
                className="bg-[#068FFF] text-white font-semibold px-4 py-2 rounded-md hover:bg-opacity-50"
                onClick={openLogin}
              >
                Login
              </button>
            )}
          </div>
        )}
      </header>
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
