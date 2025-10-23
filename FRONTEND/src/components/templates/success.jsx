import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SuccessModal = ({
  onClose,
  title = "Pesanan Berhasil!",
  message = "Terima kasih! Pesanan Anda telah berhasil dikonfirmasi dan sedang diproses.",
  showAutoRedirect = true,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (showAutoRedirect) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [navigate, showAutoRedirect]);

  const btnclose = () => {
    onClose();
    navigate("/");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center "
      style={{ zIndex: 10000 }}
    >
      <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full text-center shadow-lg mx-6">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto mb-2">
          <svg
            className="w-full h-full text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 text-sm">{message}</p>

        {/* OK Button */}
        <button
          onClick={btnclose}
          className="mt-4 bg-[#068FFF] text-white px-4 py-2 rounded-md 
             transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#068FFF] hover:to-blue-600
             hover:shadow-lg hover:shadow-blue-900/50 
             hover:scale-[1.02] active:scale-[0.98]"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

SuccessModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  showAutoRedirect: PropTypes.bool,
};

export default SuccessModal;
