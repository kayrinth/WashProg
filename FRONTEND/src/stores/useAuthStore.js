// store/useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => {
        set({ user, token });
        localStorage.setItem("token", token);
      },
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem("token");
      },
    }),
    {
      name: "auth",
    }
  )
);

export default useAuthStore;
