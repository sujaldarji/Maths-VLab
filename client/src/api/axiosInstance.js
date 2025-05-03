import axios from "axios";

 const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
 
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

// Function to add failed requests to queue while refreshing
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Expired Tokens
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    addRefreshSubscriber((newToken) => {
                        if (newToken) {
                            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                            resolve(axiosInstance(originalRequest));
                        } else {
                            reject(error);
                        }
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Refresh Token Request
                const { data } = await axiosInstance.post('/api/tokenRoutes/refresh-token');

                localStorage.setItem("accessToken", data.accessToken);
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
                
                onTokenRefreshed(data.accessToken); // Notify all subscribers
                
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Refresh Token Expired. Redirecting to login...");
                localStorage.removeItem("accessToken");
                
                onTokenRefreshed(null); // Notify subscribers that refresh failed
                
                window.location.href = "/signin"; // Redirect to login
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const fetchTopicData = async (topicId) => {
    try {
        const response = await axiosInstance.get(`/api/topicRoutes/${topicId}`);
        return response.data; // Return the topic data
    } catch (error) {
        throw new Error('Failed to fetch topic data');
    }
};

export default axiosInstance;
