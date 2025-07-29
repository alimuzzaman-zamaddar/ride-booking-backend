import { z } from "zod";

// Define the Zod schema for Ride validation
export const rideValidationSchema = z.object({
  riderId: z.string().uuid("Invalid riderId format"),
  driverId: z.string().uuid().optional(), // Driver is optional initially
  pickupLocation: z.string().min(1, "Pickup location is required"),
  destination: z.string().min(1, "Destination is required"),
  status: z
    .enum(["requested", "accepted", "in_transit", "completed", "canceled"])
    .default("requested"),
  rideCost: z.number().optional().default(0),
  earnings: z.number().optional().default(0),
});
