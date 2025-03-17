import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Backend URL

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Allow cookies (refresh token)
});

// Flag to track if a refresh request is in progress
let isRefreshing = false;
let refreshSubscribers = [];

// Function to subscribe to new access tokens
const onTokenRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
};

// Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken"); // Get token
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Expired Tokens
axiosInstance.interceptors.response.use(
    (response) => response, // If successful, return response
    async (error) => {
        const originalRequest = error.config;

        // If unauthorized (401) & not already trying to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Wait for new token if refresh is in progress
                return new Promise((resolve) => {
                    refreshSubscribers.push((newToken) => {
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            // Mark request as retried
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Request new access token using refresh token
                const { data } = await axios.post(`${API_BASE_URL}/api/token/refresh-token`, {}, { withCredentials: true });

                localStorage.setItem("accessToken", data.accessToken); // Store new token
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
                
                onTokenRefreshed(data.accessToken); // Notify subscribers
                
                return axiosInstance(originalRequest); // Retry failed request
            } catch (refreshError) {
                console.error("Refresh Token Expired. Redirecting to login...");
                localStorage.removeItem("accessToken");
                window.location.href = "/signin"; // Redirect to login page
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
