import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Success() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:3001/success", 
                    { withCredentials: true } // Ensure cookies are sent
                );
                setMessage(response.data.message);
            } catch (error) {
                console.error("Auth Error:", error.response?.data || error);
                navigate("/signin"); // Redirect to login if not authenticated
            }
        };

        checkAuth();
    }, []);

    return (
        <div>
            <h2>Protected Page</h2>
            <p>{message}</p>
        </div>
    );
}

export default Success;
