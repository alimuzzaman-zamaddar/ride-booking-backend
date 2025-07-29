import mongoose, { Document } from "mongoose";

export interface Ride extends Document {
  riderId: string; // The user ID of the rider
  driverId?: mongoose.Types.ObjectId; // The user ID of the driver (optional initially)
  pickupLocation: string; // The pickup location of the ride
  destination: string; // The destination of the ride
  status: "requested" | "accepted" | "in_transit" | "completed" | "canceled"; // Ride status
  rideCost?: number; // Optional cost of the ride (calculated)
  earnings?: number; // Driver's earnings (optional)
  createdAt: Date; // Date when the ride was created
  updatedAt: Date; // Date when the ride was last updated
}
