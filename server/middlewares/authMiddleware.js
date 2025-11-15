const jwt = require("jsonwebtoken");
const UserModel = require("../Models/Users.js");

const authenticateUser = async (req, res, next) => {
    try {
        // Extract access token from cookies or Authorization header
        const token = req.cookies.accessToken || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized. Please sign in." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded || !decoded.userId) {
            console.log("Hii")
            return res.status(403).json({ message: "Invalid token structure" });
        }

        // Get user from database to include role
        const user = await UserModel.findById(decoded.userId).select("role email name");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach user details to request
        req.user = {
            userId: decoded.userId,
            email: user.email,
            name: user.name,
            role: user.role
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