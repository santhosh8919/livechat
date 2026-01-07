import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://chatlive1-32ws.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
  timeout: 10000, // 10 second timeout
});
