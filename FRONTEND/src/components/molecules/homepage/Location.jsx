export default function Location() {
  return (
    <div className="py-16">
      <div className="py-0 md:py-10 max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col justify-center p-8 bg-blue-50 rounded-lg">
          <h1 className="text-3xl font-bold mb-4">Lokasi Toko Kami</h1>
          <p className="text-gray-700 mb-6">
            Toko kami berlokasi di pusat kota Jakarta, mudah dijangkau dengan
            kendaraan umum maupun pribadi. Kami buka setiap hari dari pukul
            09.00 hingga 21.00 WIB. Kunjungi kami untuk melihat langsung
            berbagai produk unggulan kami!
          </p>
          <a
            href="https://www.google.com/maps?q=-7.7544706085053035, 110.40924735420622"
            target="_blank"
            rel="noopener noreferrer"
            // className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            className="inline-block bg-[#068FFF] text-white text-center px-6 py-2 rounded-lg text-md md:text-lg xl:text-xl 
             transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#068FFF] hover:to-blue-700
             hover:shadow-lg hover:shadow-blue-900/40 
             hover:scale-[1.02] active:scale-[0.98]"
          >
            Buka di Google Maps
          </a>
        </div>
        <div className="w-full h-96 lg:h-full">
          <iframe
            title="Lokasi Toko"
            src="https://www.google.com/maps?q=-7.7544706085053035,110.40924735420622&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            className="rounded-lg"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
