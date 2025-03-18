import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // Use axiosInstance

function Success() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await axiosInstance.get("/api/userRoutes/success"); // Uses interceptor for token refresh
                setMessage(response.data.message);
            } catch (error) {
                console.error("Auth Error:", error.response?.data || error);
                navigate("/signin"); // Redirect if not authenticated
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
