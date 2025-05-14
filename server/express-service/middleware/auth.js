const jwt = require("jsonwebtoken");
const userKey = process.env.JWT_USER_SECRET;
const adminKey = process.env.JWT_ADMIN_SECRET;

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, userKey, (userErr, user) => {
    if (!userErr) {
      req.user = user;
      console.log("User token verified");
      return next();
    }
    jwt.verify(token, adminKey, (adminErr, admin) => {
      if (adminErr) {
        console.error("Error verifying token:", adminErr);
        return res.status(403).json({ error: "Forbidden: Invalid token" });
      }
      console.log("Admin token verified");
      next();
    });
  });
}

function authenticateAdminToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, adminKey, (err, user) => {
    if (err) {
      console.error("Error verifying token:", err); // Log the error for debugging
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    console.log("token good");
    next();
  });
}
module.exports = { authenticateToken, authenticateAdminToken };
