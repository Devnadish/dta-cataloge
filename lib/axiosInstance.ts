import axios from "axios";

// Use the environment variable for the base URL
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

// Create an Axios instance with a base URL and default headers
const axiosInstance = axios.create({
  baseURL, // Use the dynamic base URL from the environment variable
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

export default axiosInstance;
