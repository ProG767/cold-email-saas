import jwt from "jsonwebtoken";
export const signJwt = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
export const verifyJwt = (token) => { try { return jwt.verify(token, process.env.JWT_SECRET); } catch { return null; } };
export const authMiddleware = (req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Missing token" });
  const decoded = verifyJwt(token);
  if (!decoded) return res.status(401).json({ error: "Invalid token" });
  req.user = decoded; next();
};
