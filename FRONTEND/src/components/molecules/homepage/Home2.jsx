import { useState, useEffect, useRef } from "react";
import { logo2, gambar2, gambar3, gambar1 } from "../../../assets";
import { WashingMachine } from "lucide-react";

export default function Home2() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  const serviceData = [
    {
      id: "service1",
      title: "Fast Wash",
      description:
        "Fast Wash adalah proses pembersihan meliputi upper, midsole, dan outsole",
      image: gambar1,
      logo: logo2,
    },
    {
      id: "service2",
      title: "Deep Cleaning",
      description:
        "Deep Wash adalah proses pembersihan meliputi upper, midsole, outsole, dan insole",
      image: gambar2,
      logo: logo2,
    },
    {
      id: "service3",
      title: "Repaint",
      description:
        "Repaint adalah proses pengecatan ulang sepatu untuk mengembalikan atau mengubah warna.",
      image: gambar3,
      logo: logo2,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards(
              (prev) => new Set([...prev, entry.target.dataset.cardId])
            );
          }
        });
      },
      { threshold: 0.2, rootMargin: "50px" }
    );

    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    // <div className="py-12 md:py-16 bg-gradient-to-b from-blue-50 to-white bg-opacity-50">
    <div className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center justify-center ">
        <div className="w-full max-w-7xl text-center">
          <div className="w-full max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
              <WashingMachine className="w-4 h-4" />
              <span>Layanan Kami</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-3">
              Dari Kotor Jadi Kinclong, Lewat Layanan Kami
            </h1>
            <p className="text-base text-gray-700 max-w-2xl mx-auto mb-10">
              Setiap layanan kami dirancang buat satu tujuan bikin kamu makin
              percaya pakai sepatu, tas, dab topi kesayanganmu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-8 mx-auto max-w-6xl">
            {serviceData.map((service, index) => (
              <div
                key={service.id}
                data-card-id={service.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`transform transition-all duration-700 ease-out ${
                  visibleCards.has(service.id)
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-white text-black border border-gray-200 w-full max-w-md mx-auto rounded-xl shadow-sm overflow-hidden text-center p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#068FFF] hover:bg-[#068FFF] hover:text-white">
                  <div className="relative">
                    <img
                      src={service.logo}
                      alt="WashProg Logo"
                      className="absolute top-2 left-2 w-14 z-10"
                      loading="lazy"
                    />

                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>

                  <h2 className="text-lg font-bold mt-4">{service.title}</h2>
                  <p className="text-sm mt-1">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <a
          href="/menu"
          className="inline-flex items-center gap-2 bg-transparent border-2 border-blue-600 text-blue-600 px-16 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-blue-600 hover:text-white hover:-translate-y-0.5 active:translate-y-0 mt-4"
        >
          Selengkapnya...
        </a>
      </div>
    </div>
  );
}
