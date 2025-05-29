import PropTypes from "prop-types";

const LoadingOverlay = ({
  title = "Memproses Pesanan",
  message = "Mohon tunggu, pesanan Anda sedang diproses...",
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: 10000 }}
    >
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-[#FF8225] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

LoadingOverlay.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

export default LoadingOverlay;
