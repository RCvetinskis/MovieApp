"use server";
import axios from "axios";
import Cookies from "js-cookie";
import https from "https";
const URL = process.env.BACKEND_API_URL;

export const interceptToken = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
interceptToken.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth-token"); // Retrieve token from cookies
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
interceptToken.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to token expiration
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh token endpoint
        const refreshToken = Cookies.get("auth-token"); // Retrieve refresh token from cookies
        const response = await axios.post(`${URL}/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        Cookies.set("auth-token", accessToken); // Set new access token

        // Retry the original request with the new token
        interceptToken.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return interceptToken(originalRequest);
      } catch (refreshError) {
        // Handle logout or redirect to login
        Cookies.remove("auth-token");
        Cookies.remove("refresh-token");
        throw new Error("Session expired. Please log in again.");
      }
    }

    return Promise.reject(error);
  }
);

export const API = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    if (error) {
      console.error("API Error Response:", error.response.data);
      console.error("Status Code:", error.response.status);
    } else if (error.request) {
      console.error("API Error Request:", error.request);
    } else {
      console.error("API Error Message:", error.message);
    }
    return Promise.reject(error);
  }
);
