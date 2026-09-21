import { verifyToken } from "../utils/jwt.js";
import { isBlacklisted } from "../utils/tokenBlacklist.js";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (isBlacklisted(token)) {
    return res.status(401).json({
      message: "Token has been revoked",
    });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
  req.user = user;
  next();
}
