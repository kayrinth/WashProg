import { useState, useEffect, useRef } from "react";
import { logo2, gambar2, gambar3, gambar1 } from "../../../assets";

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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "50px" }
    );

    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-12 md:py-16 bg-gradient-to-b from-blue-50 to-white bg-opacity-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center justify-center ">
        <div className="w-full max-w-7xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-3">
            Layanan Kami
          </h1>
          <p className="text-base text-gray-700 max-w-2xl mx-auto mb-10">
            Kami memberikan berbagai macam layanan untuk merawat barang
            kesayangan Anda, seperti sepatu, tas, dan topi, dengan kualitas
            terbaik.
          </p>

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
                <div className="bg-white text-black border border-gray-200 w-full max-w-md mx-auto rounded-xl shadow-md overflow-hidden text-center p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#068FFF] hover:bg-[#068FFF] hover:text-white">
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
          className="mt-12 inline-block bg-[#068FFF] text-white px-6 py-2 rounded-lg text-lg md:text-xl xl:text-2xl 
             transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#068FFF] hover:to-blue-700
             hover:shadow-lg hover:shadow-blue-900/40 
             hover:scale-[1.02] active:scale-[0.98]"
        >
          Selengkapnya...
        </a>
      </div>
    </div>
  );
}
