import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // headers: { "Content-Type": "application/json" },
  
});

instance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const lang = typeof window !== 'undefined' ? (localStorage.getItem("lang") || "en") : "en";
    
    if (token && !config.url?.includes("google-signin")) {
      // Only attach token for requests other than Google login
      if (typeof config.headers.set === 'function') {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.headers) {
      if (typeof config.headers.set === 'function') {
        config.headers.set("Accept-Language", lang);
      } else {
        config.headers["Accept-Language"] = lang;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;