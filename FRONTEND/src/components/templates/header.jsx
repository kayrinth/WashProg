import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { logo } from "../../assets";
import { FcGoogle } from "react-icons/fc";
import { Input } from "../atoms"; // Perbaikan import komponen Input

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onGoogleSignIn = () => {
    console.log("Login dengan Google...");
  };

  const onClose = () => {
    setIsLoginOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 py-4 px-6 flex justify-between items-center max-w-7xl mx-auto rounded-b-2xl transition-all duration-300 ${
          isScrolled ? "shadow-lg backdrop-blur-xl pt-4" : ""
        }`}
      >
        {/* Logo */}
        <div className="text-black font-bold text-lg flex items-center">
          <img src={logo} alt="WashProg" className="h-10" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-black font-medium">
          <a href="#" className="hover:text-gray-600">
            Beranda
          </a>
          <a href="#" className="hover:text-gray-600">
            Daftar Menu
          </a>
          <a href="#" className="hover:text-gray-600">
            Pesan Sekarang
          </a>
          <a href="#" className="hover:text-gray-600">
            Tentang Kami
          </a>
        </nav>

        {/* Login Button */}
        <button
          className="hidden md:block bg-[#FF8225] text-white font-semibold px-4 py-2 rounded-md hover:bg-opacity-50"
          onClick={() => setIsLoginOpen(true)}
        >
          Login
        </button>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={28} />
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-4 text-center md:hidden">
            <a href="#" className="hover:text-gray-600">
              Beranda
            </a>
            <a href="#" className="hover:text-gray-600">
              Daftar Menu
            </a>
            <a href="#" className="hover:text-gray-600">
              Pesan Sekarang
            </a>
            <a href="#" className="hover:text-gray-600">
              Tentang Kami
            </a>
            <button
              className="bg-[#FF8225] text-white font-semibold px-4 py-2 rounded-md hover:bg-opacity-50"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
          </div>
        )}
      </header>

      {/* Login Popup */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            {/* Logo */}
            <img
              src={logo}
              alt="WashProg Logo"
              className="w-28 md:w-36 xl:w-48 mx-auto mb-4"
            />

            {/* Judul */}
            <h2 className="text-xl font-semibold mb-4">Login</h2>

            {/* Input Username */}
            <Input
              type="text"
              name="username"
              value={loginData.username}
              placeholder="Username"
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />

            {/* Input Password */}
            <Input
              type="password"
              name="password"
              value={loginData.password}
              placeholder="Password"
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />

            {/* Tombol Login */}
            <button className="bg-black text-white px-4 py-2 w-full rounded-md hover:bg-gradient-to-r from-black to-gray-800 mb-2">
              Masuk
            </button>
            <button className="bg-black text-white px-4 py-2 w-full rounded-md hover:bg-gradient-to-r from-black to-gray-800">
              Registrasi
            </button>

            {/* Atau Login dengan */}
            <div className="my-4 text-gray-500">Atau</div>

            {/* Tombol Login dengan Google */}
            <button
              className="flex items-center justify-center w-full border rounded-md py-2 hover:bg-gray-100"
              onClick={onGoogleSignIn}
            >
              <FcGoogle className="text-2xl mr-2" />
              <span>Google</span>
            </button>

            {/* Tombol Batal */}
            <button
              className="text-gray-500 hover:text-gray-700 mt-4"
              onClick={onClose}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </>
  );
}
