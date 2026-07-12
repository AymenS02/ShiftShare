import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";


export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}


export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {

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


    const decoded = verifyToken(token) as {
      id: string;
    };


    req.user = {
      id: decoded.id,
    };


    next();


  } catch(error) {

    return res.status(401).json({
      message: "Invalid token",
    });

  }

}