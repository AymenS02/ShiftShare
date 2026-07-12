import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";
export async function authMiddleware(req, res, next) {
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
        const user = await User.findById(decoded.id).select("_id role companyId");
        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }
        req.user = {
            id: user._id.toString(),
            role: user.role,
            companyId: user.companyId ? user.companyId.toString() : null,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}
