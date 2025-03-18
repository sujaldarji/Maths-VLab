const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    try {
        // Extract access token from cookies or Authorization header
        const token = req.cookies.accessToken || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized. Please sign in." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(403).json({ message: "Invalid token structure" });
        }

        // Attach user details to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,  // Include email if present
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired. Please refresh the token." });
        }
        return res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authenticateUser;
