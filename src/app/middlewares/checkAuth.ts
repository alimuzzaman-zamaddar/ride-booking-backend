/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envVars } from "../config/env"; // Assuming your environment variables are in env.ts
import UserModel from "../modules/auth/auth.model";

export const checkAuth = (...authRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const decoded = jwt.verify(token, envVars.JWT_ACCESS_SECRET) as {
        userId: string;
        role: string;
      };
      req.user = decoded; // Attach decoded user to request

      // Check if the user's role matches the allowed roles
      if (!authRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Check if user is blocked
      const user = await UserModel.findById(decoded.userId);
      if (user && user.isBlocked) {
        return res.status(403).json({
          message:
            "You are blocked by admin. Please contact admin for assistance.",
        });
      }

      // Proceed to the next middleware/handler
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};

// Separate middleware to check if user is blocked (for routes that need auth but not role-based access)
export const checkUserBlocked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(); // Allow unauthenticated requests to proceed (for login/register)
    }

    const decoded = jwt.verify(token, envVars.JWT_ACCESS_SECRET) as {
      userId: string;
      role: string;
    };

    const user = await UserModel.findById(decoded.userId);
    if (user && user.isBlocked) {
      return res.status(403).json({
        message:
          "You are blocked by admin. Please contact admin for assistance.",
      });
    }

    next();
  } catch (error) {
    next(); // Allow requests to proceed if token is invalid (for login/register)
  }
};
