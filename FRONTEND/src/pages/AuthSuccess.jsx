import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../stores/useAuthStore";

const AuthSuccess = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processAuth = async () => {
      try {
        const token = searchParams.get("token");
        const Users = searchParams.get("user");

        if (!token || !Users) {
          throw new Error("Data login tidak lengkap");
        }

        const user = JSON.parse(decodeURIComponent(Users));

        setUser(
          {
            email: user.email,
            name: user.name,
            userId: user.id,
          },
          token
        );

        toast.success("Login Google berhasil!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        console.error("Auth Success Error:", error);
        toast.error("Error memproses login: " + error.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    };
    processAuth();
  }, [searchParams, navigate, setUser]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <div
        className="spinner"
        style={{
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          animation: "spin 2s linear infinite",
          marginBottom: "20px",
        }}
      ></div>
      <h3>Memproses login Google...</h3>
      <p>Mohon tunggu sebentar...</p>
    </div>
  );
};

export default AuthSuccess;
