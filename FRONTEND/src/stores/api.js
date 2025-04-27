const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = (path, options) => {
  return fetch(`${API_BASE_URL}${path}`, options);
};
