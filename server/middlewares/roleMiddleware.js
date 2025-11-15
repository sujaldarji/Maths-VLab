// src/middlewares/roleMiddleware.js
const checkRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  next();
};

module.exports = checkRole;
