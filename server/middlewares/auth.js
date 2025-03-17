const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please sign in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Ensure consistency with auth.js

        if (!decoded || !decoded.userId) {
            return res.status(403).json({ message: "Invalid token structure" });
        }

        req.user = { userId: decoded.userId };
        
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired. Please refresh the token." });
        }
        return res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authenticateUser;
