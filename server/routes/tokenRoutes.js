<<<<<<< HEAD
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Refresh Token Endpoint
router.post("/refresh-token", (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token, please log in again" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired refresh token" });
        }

        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );

        res.json({ accessToken: newAccessToken });
    });
});

// Logout Endpoint
router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
=======
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Refresh Token Endpoint
router.post("/refresh-token", (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token, please log in again" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired refresh token" });
        }

        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );

        res.json({ accessToken: newAccessToken });
    });
});

// Logout Endpoint
router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
>>>>>>> 59d7a14 (sample content for algebra topic)
