import { Request, Response } from "express";
import authService from "./auth.service";
import UserModel from "./auth.model";

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  try {
    const user = await authService.register(email, password, role);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
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
    console.error("Error during login:", error);
    res
      .status(400)
      .json({ message: error.message || "An error occurred during login" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent blocking admins
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot block admin users" });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.status(200).json({
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status" });
  }
};
