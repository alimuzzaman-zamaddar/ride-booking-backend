import { Request, Response } from "express";
import authService from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  try {
    const user = await authService.register(email, password, role);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      // Fallback for unknown error types
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log("Request Body:", req.body); // Add this line to log incoming data

  try {
    const token = await authService.login(email, password);
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(400).json({ message: error.message });
  }
};
