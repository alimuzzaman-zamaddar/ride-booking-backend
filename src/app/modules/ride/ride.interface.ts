import mongoose, { Document } from "mongoose";

export type RideStatus =
  | "requested"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "completed"
  | "canceled";

export interface Ride extends Document {
  riderId: string;
  driverId?: mongoose.Types.ObjectId;
  pickupLocation: string;
  destination: string;
  status: RideStatus;
  rideCost?: number;
  earnings?: number;
  createdAt: Date;
  updatedAt: Date;
  rejectedBy?: mongoose.Types.ObjectId[];
}
