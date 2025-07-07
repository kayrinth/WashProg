import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-xl mt-4 text-gray-700">Halaman tidak ditemukan</p>
      <p className="mt-2 text-gray-500">
        Sepertinya halaman yang kamu cari tidak tersedia.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}
