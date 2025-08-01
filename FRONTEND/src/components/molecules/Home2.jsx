import { useState, useEffect } from "react";
import { logo2, gambar2, gambar3, gambar1 } from "../../assets";

export default function Home2() {
  const [visibleCards, setVisibleCards] = useState(new Set());

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
      {
        threshold: 0.2,
        rootMargin: "50px",
      }
    );

    const cards = document.querySelectorAll("[data-card-id]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const serviceData = [
    {
      id: "service1",
      title: "Fast Wash",
      description:
        "Fast Wash adalah proses pembersihan meliputi upper, midsole, dan outsole",
      image: `${gambar1}`,
      logo: `${logo2}`,
    },
    {
      id: "service2",
      title: "Deep Cleaning",
      description:
        "Deep Wash adalah proses pembersihan meliputi upper, midsole, outsole, dan insole",
      image: `${gambar2}`,
      logo: `${logo2}`,
    },
    {
      id: "service3",
      title: "Repaint",
      description:
        "Repaint adalah proses pengecatan ulang sepatu untuk mengembalikan atau mengubah warna.",
      image: `${gambar3}`,
      logo: `${logo2}`,
    },
  ];

  return (
    <div className="bg-cover bg-center bg-black bg-opacity-50 min-h-screen mx-3 lg:mx-6 rounded-lg">
      <div className="py-20 flex flex-col items-center justify-center m-9">
        <div className="w-full max-w-7xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
            Layanan Kami
          </h1>
          <p className="text-lg text-gray-50 max-w-2xl mx-auto mb-10">
            Kami memberikan berbagai macam layanan untuk merawat barang
            kesayangan Anda, seperti sepatu, tas, dan topi, dengan kualitas
            terbaik.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6 max-w-6xl mx-auto">
            {serviceData.map((service, index) => (
              <div
                key={service.id}
                data-card-id={service.id}
                className={`transform transition-all duration-700 ease-out ${
                  visibleCards.has(service.id)
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-[#068FFF] hover:bg-white text-white  hover:text-[#068FFF] border-white hover:border-[#068FFF]  border-4 border-solid  w-full max-w-md mx-auto rounded-xl shadow-lg overflow-hidden text-center p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={service.logo}
                      alt="WashProg Logo"
                      className="absolute top-2 left-2 w-20 z-10"
                      loading="lazy"
                    />

                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>

                  <h2 className="text-xl font-bold  mt-4">{service.title}</h2>
                  <p className="text-sm ">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <a
          href="/menu"
          className="mt-10 inline-block bg-[#068FFF] hover:bg-[#75c1ff] text-white text-xl md:text-2xl xl:text-3xl font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
        >
          Selengkapnya...
        </a>
      </div>
    </div>
  );
}
