import { verifyToken } from "../utils/jwt.js";
export function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Invalid token format",
            });
        }
        const decoded = verifyToken(token);
        req.user = {
            id: decoded.id,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}
