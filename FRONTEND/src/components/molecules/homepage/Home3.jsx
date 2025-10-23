import { useLoginModal } from "../../../stores/loginLogoutModal";
import { LoginForm, RegisterForm } from "..";
import { Sparkles, Truck } from "lucide-react";

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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.15) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          ></div>
        </div>

        <div className="relative py-20 px-6 lg:py-28">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>Layanan Pickup & Delivery Tersedia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Tidak Sempat ke Toko?
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Kami Antar Jemput!
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                WashProg hadir dengan layanan pickup dan delivery untuk area
                Sleman!
              </p>
              <button
                onClick={handlePesanClick}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-10 py-5 rounded-2xl text-xl sm:text-2xl font-bold shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:shadow-blue-500/70 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Pesan Sekarang</span>
                <Truck className="relative w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
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
