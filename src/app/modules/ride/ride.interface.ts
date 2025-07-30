import mongoose, { Document } from "mongoose";

export interface Ride extends Document {
  riderId: string; 
  driverId?: mongoose.Types.ObjectId; 
  pickupLocation: string; 
  destination: string; 
  status: "requested" | "accepted" | "in_transit" | "completed" | "canceled"; 
  rideCost?: number; 
  earnings?: number; 
  createdAt: Date; 
  updatedAt: Date; 
}
