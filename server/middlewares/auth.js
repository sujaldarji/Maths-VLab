const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Support Bearer token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please sign in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(403).json({ message: "Invalid token structure" });
        }

        req.user = { userId: decoded.userId }; // Store only userId in req.user
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please sign in again." });
        }
        return res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authenticateUser;
