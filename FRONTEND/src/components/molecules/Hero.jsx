import { useState, useEffect } from "react";
import { hero1 } from "../../assets";

export default function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = `${hero1}`;
    img.onload = () => {
      setImageLoaded(true);
      setTimeout(() => setIsVisible(true), 100);
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden relative flex flex-col items-center justify-center text-center px-6">
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: imageLoaded ? `url(${hero1})` : `${hero1}`,
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      )}

      <div
        className={`relative z-10 rounded-xl p-6 max-w-4xl w-full mx-auto transform transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <h1 className="text-4xl md:text-6xl lg:text-5xl xl:text-6xl text-white font-bold mb-6 leading-tight">
          Biar Sepatu, Tas, dan Topimu Selalu On Point!
        </h1>
        <h3 className="text-xl md:text-2xl xl:text-3xl text-white leading-relaxed">
          Kami kasih perawatan terbaik biar tetap bersih, wangi, dan awet.
          <span className="font-bold text-[#068FFF]"> WashProg</span>{" "}
          solusinya!!
        </h3>
      </div>
    </div>
  );
}
