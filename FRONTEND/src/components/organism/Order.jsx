import { SelectCategory, SelectService } from "../molecules";
import MapComponent from "../molecules/leaflet/MapComponent";
import { order } from "../../assets";

export default function Menu() {
  return (
    <div className="w-full min-h-screen ">
      {/* Hero Section */}
      <div
        className="relative w-full h-96 md:h-96 flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${order})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="text-center px-4">
          <h1 className="relative z-10 text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Pesan Layanan dengan Mudah
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Temukan layanan terbaik untuk kebutuhan Anda
          </p>
        </div>
      </div>

      {/* Order Section */}
      <div className="flex items-center justify-center px-4">
        <div className="p-8 max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 transform -translate-y-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Pilih Kategori & Layanan
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            <SelectCategory />
            <SelectService />

            <div className="pt-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm uppercase tracking-wider">
                Pilih kategori
              </label>
              <MapComponent />
            </div>

            <div className="pt-4">
              <button className="w-full items-center justify-center bg-[#FF8225] hover:bg-opacity-50 text-white text-lg md:text-xl xl:text-2xl py-2 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                Pesan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
