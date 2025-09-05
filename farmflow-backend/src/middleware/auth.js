const jwt = require("jsonwebtoken");

// Ensure JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in .env");
}

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
