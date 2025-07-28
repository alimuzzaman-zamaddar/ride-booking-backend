// src/types/custom.d.ts
import { User } from "./modules/auth/auth.interface"; // Import your User interface

declare global {
  namespace Express {
    interface Request {
      user: User & { userId: string }; // Extend the user object to include userId
    }
  }
}
