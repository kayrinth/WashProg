import { useState, useEffect } from "react";
import { hero2 } from "../../../assets";
import { Parallax } from "react-parallax";
import { RotatingText, GradientText } from "@/components/reactBits";

export default function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = hero2;
    img.onload = () => {
      setImageLoaded(true);
      setTimeout(() => setIsVisible(true), 100);
    };
  }, []);

  return (
    <Parallax
      bgImage={hero2}
      bgImageAlt="Hero background"
      strength={300}
      bgImageStyle={{ objectFit: "cover" }}
    >
      <div className="md:min-h-screen w-full relative flex flex-col items-center justify-center text-center py-20 md:py-0 px-6">
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 z-0" />
        )}

        <div
          className={`relative z-10 rounded-xl p-6 max-w-4xl w-full mx-auto transform transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-5xl xl:text-8xl text-white font-bold leading-tight">
            Biar Penampilan Selalu On Point — dari{" "}
            <span className="inline-flex items-center">
              <RotatingText
                texts={["Sepatu", "Tas", "Topi"]}
                mainClassName="px-2 sm:px-2 md:px-3 bg-[#068FFF] text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg inline-block"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </span>
          </h1>
          <GradientText
            colors={["#9AA6B2", "#FAF6E9"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class text-xl md:text-2xl xl:text-3xl"
          >
            Kami kasih perawatan terbaik biar tetap bersih, wangi, dan awet.
            WashProg solusinya!!
          </GradientText>
        </div>
      </div>
    </Parallax>
  );
}
