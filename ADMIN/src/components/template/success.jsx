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
      const timer = setTimeout(() => {}, 10000);

      return () => clearTimeout(timer);
    }
  }, [navigate, showAutoRedirect]);

  const btnclose = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center "
      style={{ zIndex: 10000 }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-center shadow-lg">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto mb-4">
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

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>

        {/* Message */}
        <p className="text-gray-600">{message}</p>

        {/* OK Button */}
        <button
          onClick={btnclose}
          className="mt-4 px-4 py-2 bg-[#068FFF] text-white rounded hover:bg-[#1b486d]"
        >
          OK
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
