import useAuthStore from "../store/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = async (path, options = {}) => {
  const { token, logout } = useAuthStore.getState();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401 || res.status === 403) {
    logout();
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    return;
  }

  return res;
};
