const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_dev";

module.exports = function userFromHeader(req, res, next) {
  // Primary: read pre-parsed user from gateway's X-User-Payload header
  const header = req.headers["x-user-payload"];
  if (header) {
    try {
      const obj = typeof header === "string" ? JSON.parse(header) : header;
      req.user = { userId: obj.userId, email: obj.email, role: obj.role };
      return next();
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid X-User-Payload" });
    }
  }

  // Fallback: verify JWT directly from Authorization header
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
      req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token", errorCode: "INVALID_TOKEN" });
    }
  }

  return res.status(401).json({ success: false, message: "Missing X-User-Payload or Authorization header" });
};

