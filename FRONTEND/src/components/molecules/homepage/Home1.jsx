import { useState, useEffect } from "react";
import { hero1 } from "../../../assets";
import { Clock, Star, ShieldCheck, Footprints } from "lucide-react"; // contoh icon

export default function Home1() {
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
        threshold: 0.5,
        rootMargin: "50px",
      }
    );

    const cards = document.querySelectorAll("[data-card-id]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const cardData = [
    {
      id: "card1",
      title: "Berpengalaman",
      description:
        "tiap sepatu, tas, dan topi punya karakter sendiri. Karena itu, kami pakai teknik dan bahan pembersih yang pas biar hasilnya bersih maksimal tanpa bikin rusak.",
      icon: <ShieldCheck className="w-8 h-8" />,
    },
    {
      id: "card2",
      title: "Hemat Waktu",
      description:
        "Waktu kamu terlalu berharga buat dipakai nyikat sepatu. Serahkan ke WashProg, kamu tinggal tunggu. Kami yang bikin semuanya beres.",
      icon: <Clock className="w-8 h-8" />,
    },
    {
      id: "card3",
      title: "Harga Bersahabat",
      description:
        "Cucian premium nggak harus mahal. Di WashProg, kamu dapat hasil maksimal dengan harga yang tetap ramah di kantong.",
      icon: <Star className="w-8 h-8" />,
    },
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
          <Footprints className="w-4 h-4" />
          <span>WashProg</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="justify-center hidden lg:flex  h-[36rem]">
          <img
            src={hero1}
            alt="Laundry Illustration"
            className="rounded-xl shadow-lg w-full max-w-xl lg:max-w-2xl h-auto object-cover"
            loading="lazy"
          />
        </div>

        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-8 text-left">
            Kenapa Harus Mencuci di{" "}
            <span className="text-[#068FFF]">WashProg</span>?
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 text-center md:text-left">
            {cardData.map((card, index) => (
              <div
                key={card.id}
                data-card-id={card.id}
                className={`transform transition-all duration-700 ease-out ${
                  visibleCards.has(card.id)
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Versi Desktop (judul + deskripsi) */}
                <div className="hidden sm:block bg-white hover:bg-[#068FFF] hover:text-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h2 className="text-lg md:text-xl font-semibold mb-2">
                    {card.title}
                  </h2>
                  <p className="text-sm md:text-base">{card.description}</p>
                </div>

                {/* Versi Mobile (icon + judul singkat) */}
                <div className="block sm:hidden flex flex-col items-center justify-center bg-white hover:bg-[#068FFF] hover:text-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="mb-2 text-[#068FFF] group-hover:text-white">
                    {card.icon}
                  </div>
                  <h2 className="text-sm font-normal">{card.description}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
