import { loginUser, registerUser } from "../services/authService.js";
import User from "../models/User.js";
export async function register(req, res) {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const result = await registerUser(firstName, lastName, email, password, role);
        res.status(201).json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                message: error.message,
            });
        }
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                message: error.message,
            });
        }
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}
export async function logout(req, res) {
    try {
        res.status(200).json({
            message: "Logout successful",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                message: error.message,
            });
        }
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}
export async function getProfile(req, res) {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const user = await User.findById(req.user.id)
            .select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
}
