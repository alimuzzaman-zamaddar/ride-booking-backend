/* eslint-disable @typescript-eslint/no-non-null-assertion */
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "./auth.model"; // Assuming UserModel is your Mongoose model
import { AuthPayload } from "./auth.interface"; // Import AuthPayload
import { User } from "./auth.interface"; // Import User interface

class AuthService {
  // Register a new user
  async register(
    email: string,
    password: string,
    role: "admin" | "rider" | "driver"
  ) {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const newUser = new UserModel({ email, password, role });
    await newUser.save();
    return newUser;
  }

  // Login and return JWT
  async login(email: string, password: string) {
    const user = (await UserModel.findOne({ email })) as User; // Explicitly cast to User
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const payload: AuthPayload = {
      userId: user._id.toString(), // Convert ObjectId to string
      role: user.role,
    };

    const jwtSecret = process.env.JWT_ACCESS_SECRET;
    if (!jwtSecret) {
      throw new Error(
        "JWT_ACCESS_SECRET is not defined in environment variables"
      );
    }

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });
    return token;
  }

  // Verify JWT Token and get user payload
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      ) as AuthPayload;
      return decoded;
    } catch (error) {
      console.error("Error verifying token:", error);
      throw new Error("Invalid or expired token");
    }
  }
}

export default new AuthService();
