import { logo2 } from "../../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-wrap items-center justify-between">
        {/* Logo & Deskripsi */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/4 text-center md:text-left mb-6 md:mb-0">
          <img src={logo2} alt="WashProg Logo" className="w-28 mb-3" />
          <p className="text-gray-400 text-sm md:text-base">
            Solusi terbaik untuk merawat sepatu, tas, dan topi kesayangan Anda.
          </p>
        </div>

        {/* Navigasi */}
        <div className="w-full md:w-1/4 text-center mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-3">Navigasi</h3>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="hover:text-[#DC5F00] transition duration-300"
            >
              Beranda
            </a>
            <a
              href="#"
              className="hover:text-[#DC5F00] transition duration-300"
            >
              Layanan
            </a>
            <a
              href="#"
              className="hover:text-[#DC5F00] transition duration-300"
            >
              Testimoni
            </a>
            <a
              href="#"
              className="hover:text-[#DC5F00] transition duration-300"
            >
              Kontak
            </a>
          </div>
        </div>

        {/* Social Media */}
        <div className="w-full md:w-1/4 text-center md:text-right">
          <h3 className="text-lg font-semibold mb-3">Ikuti Kami</h3>
          <div className="flex justify-center md:justify-end space-x-4">
            <a
              href="#"
              className="hover:text-[#DC5F00] transition duration-300"
            >
              <FontAwesomeIcon icon={faFacebook} className="text-xl" />
            </a>
            <a
              href="#"
              className="hover:text-[#DC5F00] transition duration-300"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-xl" />
            </a>
            <a
              href="#"
              className="hover:text-[#DC5F00] transition duration-300"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} WashProg. All Rights Reserved.
      </div>
    </footer>
  );
}
