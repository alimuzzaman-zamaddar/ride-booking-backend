import { Document } from "mongoose";

export interface Ride extends Document {
  riderId: string;
  driverId?: string; // Driver is optional until the ride is accepted
  pickupLocation: string;
  destination: string;
  status: "requested" | "accepted" | "in_transit" | "completed" | "canceled";
  price?: number; // Optional, assuming you calculate the fare at some point
  createdAt: Date;
  updatedAt: Date;
}
