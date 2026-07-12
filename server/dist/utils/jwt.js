import jwt from "jsonwebtoken";
function getJWTSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }
    return secret;
}
export function generateToken(userId) {
    return jwt.sign({
        id: userId,
    }, getJWTSecret(), {
        expiresIn: "30d",
    });
}
export function verifyToken(token) {
    return jwt.verify(token, getJWTSecret());
}
