import { hero2 } from "../../assets";

export default function Hero() {
  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundImage: `url(${hero2})` }}
    >
      <div className="relative z-10 bg-black bg-opacity-40 rounded-xl p-6 max-w-4xl w-full mx-auto">
        <h1 className="text-4xl  md:text-6xl lg:text-5xl xl:text-6xl text-white font-bold mb-6">
          Biar Sepatu, Tas, dan Topimu Selalu On Point!
        </h1>
        <h3 className="text-2xl  md:text-3xl xl:text-4xl text-white">
          Kami kasih perawatan terbaik biar tetap bersih, wangi, dan awet.
          <span className="font-bold"> WashProg</span> solusinya!!
        </h3>
      </div>
    </div>
  );
}
