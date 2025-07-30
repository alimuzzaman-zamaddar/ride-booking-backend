"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideValidationSchema = void 0;
const zod_1 = require("zod");
// Define the Zod schema for Ride validation
exports.rideValidationSchema = zod_1.z.object({
    riderId: zod_1.z.string().uuid("Invalid riderId format"),
    driverId: zod_1.z.string().uuid().optional(), // Driver is optional initially
    pickupLocation: zod_1.z.string().min(1, "Pickup location is required"),
    destination: zod_1.z.string().min(1, "Destination is required"),
    status: zod_1.z
        .enum(["requested", "accepted", "in_transit", "completed", "canceled"])
        .default("requested"),
    rideCost: zod_1.z.number().optional().default(0),
    earnings: zod_1.z.number().optional().default(0),
});
