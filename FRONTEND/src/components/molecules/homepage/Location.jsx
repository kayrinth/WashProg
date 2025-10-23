export default function Location() {
  return (
    <div className="pb-16">
      <div className="py-0 md:py-10 max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col justify-center p-8 bg-blue-50 rounded-lg">
          <h1 className="text-3xl font-bold mb-4">Lokasi Toko Kami</h1>
          <p className="text-gray-700 mb-6">
            Toko kami berlokasi di sekitar Universitas Amikom Yogyakarta dan UPN
            Veteran Yogyakarta. Kami buka setiap hari dari pukul 10.00 - 22.00
            WIB.
          </p>
          <a
            href="https://www.google.com/maps?q=-7.7544706085053035, 110.40924735420622"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-transparent border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-blue-600 hover:text-white hover:-translate-y-0.5 active:translate-y-0 justify-center"
          >
            Buka di Google Maps
          </a>
        </div>
        <div className="w-full h-96 lg:h-full">
          <iframe
            title="Lokasi Toko"
            src="https://www.google.com/maps?q=-7.754652161762756, 110.4092302392522&output=embed"
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
