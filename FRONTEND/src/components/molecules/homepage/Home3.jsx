// components/Home3.jsx
import { useLoginModal } from "../../../stores/loginLogoutModal";
import { LoginForm, RegisterForm } from "..";

export default function Home3() {
  const {
    isLoginOpen,
    isRegisterOpen,
    loginData,
    registerData,
    closeAllModals,
    handleLoginInputChange,
    handleRegisterInputChange,
    handlePesanClick,
    onGoogleSignIn,
    openSendOTP,
  } = useLoginModal();

  return (
    <>
      <div className="py-16 bg-gradient-to-b from-blue-50 to-white bg-opacity-50">
        <div className=" flex flex-col items-center justify-center bg-opacity-30 px-6">
          <div className="w-full max-w-7xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Jika Tidak <span className="text-[#068FFF]">Sempat</span> ke Toko
              Kami
            </h1>
            <p className="text-lg max-w-2xl mx-auto">
              Tenang WashProg memiliki layanan pick up dan delevery untuk area
              Sleman
            </p>
          </div>
          <a
            href="#"
            onClick={handlePesanClick}
            // className="mt-10 inline-block bg-black hover:opacity-50 text-white text-xl md:text-2xl xl:text-3xl font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            className="mt-10 inline-block bg-black text-white px-6 py-3 rounded-md text-xl md:text-2xl xl:text-3xl
             transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-black hover:to-gray-800
             hover:shadow-lg hover:shadow-gray-700/50 
             hover:scale-[1.02] active:scale-[0.98]"
          >
            Coba Sekarang!!
          </a>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <LoginForm
          loginData={loginData}
          handleInputChange={handleLoginInputChange}
          onGoogleSignIn={onGoogleSignIn}
          onClose={closeAllModals}
          openSendOTP={openSendOTP}
        />
      )}

      {/* Register Modal */}
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
