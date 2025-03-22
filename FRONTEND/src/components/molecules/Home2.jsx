import { logo2 } from "../../assets";
export default function Home2() {
  return (
    <div className="pt-7">
      <div className="py-20 flex flex-col items-center justify-center bg-gray-400 bg-opacity-30 px-6">
        <div className="w-full max-w-7xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Layanan Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Kami memberikan berbagai macam layanan untuk merawat barang
            kesayangan Anda, seperti sepatu, tas, dan topi, dengan kualitas
            terbaik.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6 max-w-6xl mx-auto">
            <div className="bg-black w-full max-w-md mx-auto rounded-xl shadow-lg overflow-hidden text-center p-4">
              <div className="relative">
                {/* Logo WashProg di kiri atas */}
                <img
                  src={logo2}
                  alt="WashProg Logo"
                  className="absolute top-2 left-2 w-20" // Ukuran bisa disesuaikan
                />

                {/* Gambar utama */}
                <img
                  src="https://picsum.photos/200/300"
                  alt="Premium Treatment"
                  className="w-full h-48 object-cover rounded-lg border-4 border-solid border-[#FF8225]"
                />
              </div>

              <h2 className="text-xl font-bold text-white mt-4">Fast Wash</h2>
            </div>
            <div className="bg-black  w-full max-w-md mx-auto rounded-xl shadow-lg overflow-hidden text-center p-4 border-spacing-64">
              <div className="relative">
                {/* Logo WashProg di kiri atas */}
                <img
                  src={logo2}
                  alt="WashProg Logo"
                  className="absolute top-2 left-2 w-20" // Ukuran bisa disesuaikan
                />

                {/* Gambar utama */}
                <img
                  src="https://picsum.photos/200/300"
                  alt="Premium Treatment"
                  className="w-full h-48 object-cover rounded-lg border-4 border-solid border-[#FF8225]"
                />
              </div>

              <h2 className="text-xl font-bold text-white mt-4">
                Deep Cleaning
              </h2>
            </div>
            <div className="bg-black w-full max-w-md mx-auto rounded-xl shadow-lg overflow-hidden text-center p-4">
              <div className="relative">
                {/* Logo WashProg di kiri atas */}
                <img
                  src={logo2}
                  alt="WashProg Logo"
                  className="absolute top-2 left-2 w-20" // Ukuran bisa disesuaikan
                />

                {/* Gambar utama */}
                <img
                  src="https://picsum.photos/200/300"
                  alt="Premium Treatment"
                  className="w-full h-48 object-cover rounded-lg border-4 border-solid border-[#FF8225]"
                />
              </div>

              <h2 className="text-xl font-bold text-white mt-4">Repaint</h2>
            </div>
          </div>
        </div>
        <a
          href="#"
          className="mt-10 inline-block bg-[#FF8225] hover:bg-opacity-50 text-white text-xl md:text-2xl xl:text-3xl font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
        >
          Selengkapnya...
        </a>
      </div>
    </div>
  );
}
