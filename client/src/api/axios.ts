import axios from "axios";

// Get base URL from environment variables
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;
const enableLogging = import.meta.env.VITE_ENABLE_LOGGING === "true";

const api = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (enableLogging) {
      console.log(
        `🚀 ${config.method?.toUpperCase()} request to: ${config.url}`,
        {
          data: config.data,
          params: config.params,
        }
      );
    }
    return config;
  },
  (error) => {
    if (enableLogging) {
      console.error("❌ Request error:", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (enableLogging) {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url}:`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }
    return response;
  },
  (error) => {
    if (enableLogging) {
      console.error("❌ API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        "Server error";
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(
        new Error("Network error: Unable to connect to server")
      );
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default api;
