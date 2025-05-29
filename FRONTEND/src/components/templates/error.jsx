import PropTypes from "prop-types";
const ErrorModal = ({
  onClose,
  onRetry,
  title = "Pesanan Gagal",
  message = "Maaf, terjadi kesalahan saat memproses pesanan Anda. Silakan coba lagi.",
  helpMessage = "Periksa koneksi internet Anda atau hubungi customer service jika masalah berlanjut.",
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center "
      style={{ zIndex: 10000 }}
    >
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-700">{helpMessage}</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={onRetry}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;

ErrorModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  helpMessage: PropTypes.string,
};
