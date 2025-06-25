import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => {
        // Simpan ke Zustand
        set({ user, token });

        // Simpan manual ke localStorage
        localStorage.setItem("name", user.name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("token", token);
      },
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
      },
    }),
    {
      name: "auth",
    }
  )
);

export default useAuthStore;
