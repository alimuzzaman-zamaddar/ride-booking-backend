/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envVars } from "../config/env"; // Assuming your environment variables are in env.ts

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

      // Proceed to the next middleware/handler
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
