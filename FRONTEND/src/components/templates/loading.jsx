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
      <div className="bg-white rounded-lg p-4 md:p-6 max-w-sm w-full mx-6 text-center">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-[#068FFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-800 ">{title}</h3>

        {/* Message */}
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

LoadingOverlay.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

export default LoadingOverlay;
