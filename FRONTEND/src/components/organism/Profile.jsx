import { Input } from "../atoms";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../../stores/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditProfile() {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        const user = parsed?.state?.user;
        setFormData((prev) => ({
          ...prev,
          name: user?.name || "",
          phoneNumber: user?.phoneNumber || "",
        }));

        console.log("Auth parsed:", parsed);
      } catch (err) {
        console.error("Gagal parsing auth:", err);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const auth = localStorage.getItem("auth");
      const parsed = JSON.parse(auth);
      const userId = parsed?.state?.user?.userId;

      const res = await fetch(`${API_BASE_URL}/user/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${parsed?.state?.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.data, parsed?.state?.token);
        setFormData((prev) => ({
          ...prev,
          name: data.data?.name || prev.name,
        }));
        toast.success("Update berhasil!");
        navigate("/");
      } else {
        toast.error(data.message || "Update gagal!");
      }
    } catch (err) {
      console.error("Update error:", err.message);
      toast.error("Update gagal!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button className="mr-" onClick={() => window.history.back()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 text-center w-full">
            Edit Profil
          </h1>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleUpdateProfile}>
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Nomor Telepon
            </label>
            <Input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder="Nomor Telepon"
              disabled
              className="w-full p-2 border rounded mb-2 bg-gray-100 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700">
              Nama
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Nama Lengkap"
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#068FFF] text-white py-1 rounded-md text-sm md:text-lg transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-900 hover:to-blue-600hover:shadow-lg hover:shadow-blue-900/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
