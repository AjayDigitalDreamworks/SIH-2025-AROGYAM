import axios from "axios";

// Create an axios instance
const api = axios.create({
  // baseURL: "http://localhost:3000", // Base URL for all requests
  baseURL: "https://sih-2025-arogyam-0cf2.onrender.com"
});

// Add an interceptor to add the Authorization header
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default api;
