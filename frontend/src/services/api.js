import axios from "axios";

// dotenv.config();

const API_URI = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URI,
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
