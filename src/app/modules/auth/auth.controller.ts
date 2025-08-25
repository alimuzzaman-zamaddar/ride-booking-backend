import { Request, Response } from "express";
import authService from "./auth.service";
import UserModel from "./auth.model";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  console.log(email, password, role);
  
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

  try {
    const { user, token } = await authService.login(email, password);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(400).json({
      message: error instanceof Error ? error.message : "An error occurred",
    });
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

export const approveDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Driver not found" });
    }
    if (user.role !== "driver") {
      return res.status(400).json({ message: "User is not a driver" });
    }
    user.isApproved = true;
    await user.save();
    res.status(200).json({ message: "Driver approved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve driver" });
  }
};

export const suspendDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isSuspended } = req.body;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Driver not found" });
    }
    if (user.role !== "driver") {
      return res.status(400).json({ message: "User is not a driver" });
    }
    user.isSuspended = isSuspended;
    await user.save();
    res.status(200).json({
      message: `Driver ${
        isSuspended ? "suspended" : "unsuspended"
      } successfully`,
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update driver suspension status" });
  }
};


export const getMe = async (req: Request, res: Response) => {
  try {
    const me = await UserModel.findById(req.user.userId).select("-password");
    if (!me) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: me });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const { name, phone } = req.body as { name?: string; phone?: string };

    // Only allow name & phone changes here (not role/email/password)
    const updates: Record<string, any> = {};
    if (typeof name === "string") updates.name = name;
    if (typeof phone === "string") updates.phone = phone;

    const updated = await UserModel.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true, select: "-password" }
    );
    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated", data: updated });
  } catch (e) {
    res.status(400).json({ message: "Failed to update profile" });
  }
};


export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId; // set by checkAuth
    const { oldPassword, newPassword } = req.body as {
      oldPassword?: string;
      newPassword?: string;
    };

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "oldPassword and newPassword are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await UserModel.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Assign new password (pre-save hook will hash on modify)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ message: "Failed to change password" });
  }
};


export const logout = (req: Request, res: Response) => {
  try {
    // Clear the token from the cookies (the client should delete the token as well)
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};