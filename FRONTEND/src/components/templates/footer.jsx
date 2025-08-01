import { logo2 } from "../../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Logo & Deskripsi */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img src={logo2} alt="WashProg Logo" className="w-32 mb-4" />
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Solusi terbaik untuk merawat sepatu, tas, dan topi kesayangan Anda.
          </p>
        </div>

        {/* Menu Navigasi */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Menu</h3>
          <ul className="text-gray-400 space-y-2">
            <li>
              <a
                href="#"
                className="hover:text-[#068FFF] transition duration-300"
              >
                Beranda
              </a>
            </li>
            <li>
              <a
                href="/menu"
                className="hover:text-[#068FFF] transition duration-300"
              >
                Daftar Menu
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#068FFF] transition duration-300"
              >
                Pesan Sekarang
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#068FFF] transition duration-300"
              >
                Tentang Kami
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="text-center md:text-right">
          <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
          <div className="flex justify-center md:justify-end space-x-5">
            <a
              href="#"
              className="hover:text-[#068FFF] transition duration-300"
            >
              <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
            </a>
            <a
              href="https://www.instagram.com/washprog?utm_source=ig_web_button_share_sheet&igsh=bWlyc3FxZmQwaXBl"
              className="hover:text-[#068FFF] transition duration-300"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
            </a>
            <a
              href="#"
              className="hover:text-[#068FFF] transition duration-300"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} WashProg. All Rights Reserved.
      </div>
    </footer>
  );
}
