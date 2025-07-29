import { Types } from "mongoose";

export interface AuthPayload {
  userId: string;
  role: "admin" | "rider" | "driver";
}

export interface User {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: "admin" | "rider" | "driver";
  isActive: boolean;
  isDeleted: boolean; 
  isblocked: boolean;
  cost: number;
  earning: number;
  rides: string[]; 
  createdAt: Date;
  updatedAt: Date;
}
