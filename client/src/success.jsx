import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Success() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                let accessToken = localStorage.getItem("accessToken");
                
                if (!accessToken) {
                    await refreshToken(); // Try refreshing the token
                    accessToken = localStorage.getItem("accessToken");
                    
                    if (!accessToken) {
                        navigate("/signin");
                        return;
                    }
                }

                const response = await axios.get("/api/user/success", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true, // To send refresh token cookies
                });

                setMessage(response.data.message);
            } catch (error) {
                console.error("Auth Error:", error.response?.data || error);
                navigate("/signin"); // Redirect if not authenticated
            }
        };

        const refreshToken = async () => {
            try {
                const response = await axios.post("/api/token/refresh-token", {}, { withCredentials: true });
                localStorage.setItem("accessToken", response.data.accessToken);
            } catch (error) {
                console.error("Refresh Token Error:", error.response?.data || error);
                localStorage.removeItem("accessToken");
            }
        };

        fetchProtectedData();
    }, [navigate]);

    return (
        <div>
            <h2>Protected Page</h2>
            <p>{message}</p>
        </div>
    );
}

export default Success;
