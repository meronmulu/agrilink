import axios from "axios";

const instance = axios.create({
  baseURL: "https://agrilink-1-x6ph.onrender.com",
  headers: { "Content-Type": "application/json" },
  
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.url?.includes("google-signin")) {
      // Only attach token for requests other than Google login
      if (typeof config.headers.set === 'function') {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;