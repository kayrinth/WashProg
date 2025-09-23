import { useState, useEffect } from "react";
import { hero1 } from "../../../assets";

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
        threshold: 0.2,
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
        "WashProg menggunakan teknik pencucian yang sesuai dengan bahan dan jenis barang, sehingga kebersihan maksimal tanpa merusak produk.",
    },
    {
      id: "card2",
      title: "Hemat Waktu & Praktis",
      description:
        "Daripada repot mencuci sendiri, cukup serahkan ke WashProg dan barang kesayangan Anda akan bersih dan siap digunakan tanpa perlu usaha ekstra.",
    },
    {
      id: "card3",
      title: "Pelayanan & Harga Terbaik",
      description:
        "Dengan harga yang bersahabat, WashProg memberikan pelayanan maksimal untuk menjaga kebersihan dan kenyamanan barang Anda.",
    },
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className=" justify-center hidden lg:flex">
          <img
            src={hero1}
            alt="Laundry Illustration"
            className="rounded-xl shadow-lg w-full max-w-xl lg:max-w-2xl"
            loading="lazy"
          />
        </div>

        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black drop-shadow-md mb-8">
            Kenapa Harus Mencuci di{" "}
            <span className="text-[#068FFF]">WashProg</span>?
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
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
                <div className="bg-white hover:bg-[#068FFF] hover:text-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h2 className="text-lg md:text-xl font-semibold mb-2">
                    {card.title}
                  </h2>
                  <p className="text-sm md:text-base">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
