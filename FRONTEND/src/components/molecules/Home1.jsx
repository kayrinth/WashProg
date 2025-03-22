export default function Home1() {
  return (
    <div className="">
      <div className="flex items-center justify-center px-6 pt-7">
        <div className="bg-black bg-opacity-70 rounded-xl shadow-2xl p-10 md:p-12 w-full max-w-8xl text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
            Kenapa Harus Mencuci di <br className="hidden sm:block" />
            <span className="text-[#FF8225]">WashProg</span> ?
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6 mx-auto max-w-6xl">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
              <h1 className="text-lg md:text-xl lg:text-2xl font-semibold">
                Berpengalaman
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-gray-600 mt-2">
                WashProg menggunakan teknik pencucian yang tepat sesuai dengan
                bahan dan jenis barang, sehingga kebersihan maksimal tanpa
                merusak produk.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
              <h1 className="text-lg md:text-xl lg:text-2xl font-semibold">
                Hemat Waktu & Praktis
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-gray-600 mt-2">
                Daripada repot mencuci sendiri, cukup serahkan ke WashProg dan
                barang kesayangan Anda akan bersih dan siap digunakan tanpa
                perlu usaha ekstra.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
              <h1 className="text-lg md:text-xl lg:text-2xl font-semibold">
                Pelayanan & Harga Terbaik
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-gray-600 mt-2">
                Dengan harga yang bersahabat, WashProg memberikan pelayanan
                maksimal untuk menjaga kebersihan dan kenyamanan barang Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
