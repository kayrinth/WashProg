import { useState, useEffect } from "react";
// import { Menu } from "lucide-react";
import { logo } from "../../assets";
import {
  LoginForm,
  RegisterForm,
  SendOTPForm,
  ConfirmOTPForm,
} from "../molecules";
import useAuthStore from "../../stores/useAuthStore";
import { useLoginModal } from "../../stores/loginLogoutModal";
import { NavLink, useLocation } from "react-router-dom";
import { Squash as Hamburger } from "hamburger-react";
import Stepper, { Step } from "../reactBits/Stepper/Stepper";
import { LogIn } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  const {
    isLoginOpen,
    isSendOTPOpen,
    isConfirmOTPOpen,
    isRegisterOpen,
    loginData,
    registerData,
    goToLogin,
    openLogin,
    openSendOTP,
    openConfirmOTP,
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

  useEffect(() => {
    if (
      isLoginOpen ||
      isSendOTPOpen ||
      isConfirmOTPOpen ||
      isRegisterOpen ||
      isDropdownOpen
    ) {
      setIsOpen(false);
    }
  }, [
    isLoginOpen,
    isSendOTPOpen,
    isConfirmOTPOpen,
    isRegisterOpen,
    isDropdownOpen,
  ]);

  const isPesanActive = (path) => {
    return location.pathname === path || location.pathname === "/receipt";
  };

  return (
    <>
      <header
        className={`sticky top-0 w-full z-[999] py-4 px-6 flex justify-between items-center max-w-7xl mx-auto rounded-b-2xl transition-all duration-300 ${
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
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Beranda
            </NavLink>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Daftar Menu
            </NavLink>
            <NavLink
              to="/pesan"
              onClick={handlePesanClick}
              className={() =>
                isPesanActive("/pesan")
                  ? "text-blue-600 font-bold border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Pesan Sekarang
            </NavLink>
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
                  <NavLink
                    to="/history"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Riwayat Pesanan
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Profil
                  </NavLink>
                  {/* <a
                    href="/history"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Edit Profil
                  </a> */}
                  <button
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-md shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0"
              onClick={openLogin}
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
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
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsOpen(false);
              }}
            >
              {user.name}
              {isDropdownOpen && (
                <div>
                  <div className="absolute top-20 left-0 right-0 mx-auto w-3/4 bg-white shadow-md p-4 flex flex-col space-y-2 text-center md:hidden mt-1 rounded-xl">
                    <NavLink
                      to="/history"
                      className="block px-4 py-1 text-gray-800 hover:bg-gray-100"
                    >
                      Riwayat Pesanan
                    </NavLink>
                    <NavLink
                      to="/profile"
                      className="block px-4 py-1 text-gray-800 hover:bg-gray-100"
                    >
                      Profil
                    </NavLink>
                    <button
                      onClick={logout}
                      className="block px-4 py-1  hover:bg-gray-100 bg-red-500 text-white rounded-md"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </span>
          )}

          <div className="flex justify-center flex-1">
            <img src={logo} alt="WashProg" className="h-10" />
          </div>
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setIsDropdownOpen(false);
            }}
          >
            {/* <Menu size={28} /> */}
            <Hamburger toggled={isOpen} toggle={setIsOpen} size={28} />
          </button>
        </div>

        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-4 text-center md:hidden">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Beranda
            </NavLink>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Daftar Menu
            </NavLink>
            <NavLink
              to="/pesan"
              onClick={handlePesanClick}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Pesan Sekarang
            </NavLink>
            {user ? null : (
              <button
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-base font-semibold shadow-md shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 justify-center"
                onClick={openLogin}
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
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
          openSendOTP={openSendOTP}
        />
      )}
      {/* 
      {isSendOTPOpen && (
        <SendOTPForm
          registerData={registerData}
          handleInputChange={handleRegisterInputChange}
          onClose={closeAllModals}
          openConfirmOTP={openConfirmOTP}
        />
      )}

      {isConfirmOTPOpen && (
        <ConfirmOTPForm
          registerData={registerData}
          handleInputChange={handleRegisterInputChange}
          onClose={closeAllModals}
          openRegister={openRegister}
        />
      )}

      {isRegisterOpen && (
        <RegisterForm
          registerData={registerData}
          handleInputChange={handleRegisterInputChange}
          goToLogin={goToLogin}
          onClose={closeAllModals}
        />
      )} */}

      {(isSendOTPOpen || isConfirmOTPOpen || isRegisterOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className=" p-0 md:p-6 w-full max-w-md relative m-6">
            <button
              onClick={closeAllModals}
              className="absolute -top-3 -right-3 bg-white/90 hover:bg-white text-gray-500 hover:text-gray-700 rounded-full shadow-md p-1 transition-all z-10"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <Stepper
              initialStep={1}
              onStepChange={(step) => {
                console.log("Stepper step:", step);
              }}
              onFinalStepCompleted={() => {
                console.log("Registration flow completed!");
                closeAllModals();
              }}
            >
              <Step>
                <SendOTPForm
                  registerData={registerData}
                  handleInputChange={handleRegisterInputChange}
                  onClose={closeAllModals}
                  openConfirmOTP={openConfirmOTP}
                />
              </Step>

              <Step>
                <ConfirmOTPForm
                  registerData={registerData}
                  handleInputChange={handleRegisterInputChange}
                  onClose={closeAllModals}
                  openRegister={openRegister}
                />
              </Step>

              <Step>
                <RegisterForm
                  registerData={registerData}
                  handleInputChange={handleRegisterInputChange}
                  goToLogin={goToLogin}
                  onClose={closeAllModals}
                />
              </Step>
            </Stepper>
          </div>
        </div>
      )}
    </>
  );
}
