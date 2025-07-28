import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envVars } from "../config/env";
import { User } from "../modules/auth/auth.interface"; // Import the User interface

export const checkAuth = (...authRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const decoded = jwt.verify(token, envVars.JWT_ACCESS_SECRET) as {
        userId: string;
        role: string;
      };
      req.user = decoded as User & { userId: string }; // Attach the user object with userId to req.user

      if (!authRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
      console.log(error);
    }
  };
};
