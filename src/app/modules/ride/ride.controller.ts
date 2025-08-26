import { Request, Response } from "express";
import RideService from "./ride.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import riderService from "../driver/rider.service";
import RideModel from "./ride.model";
import UserModel from "../auth/auth.model";


// src/controllers/ride.controller.ts
export const requestRide = async (req: Request, res: Response) => {
  const { pickupLocation, destination } = req.body;

  // Calculate fare estimation (simplified logic)
  const fare = calculateFare(pickupLocation, destination);

  try {
    const newRide = await RideService.requestRide(
      req.user.userId,
      pickupLocation,
      destination,
      fare
    );
    res.status(201).json({
      message: "Ride requested successfully",
      ride: { ...newRide, rideCost: fare }, // Include fare in the response
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Basic fare calculation function (this can be replaced with real API or algorithm)
const calculateFare = (pickupLocation: string, destination: string): number => {
  return 50; // Just an example value
};


// Update ride status (Driver or Admin) — hardened to use allowed transitions
export const updateRideStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: RideStatus };

  try {
    const updatedRide = await RideService.updateRideStatus(
      id,
      status, // ← use the requested status from the body
      req.user.userId, // ← current authenticated user id
      req.user.role // ← current authenticated user role
    );

    res.status(200).json({ message: "Ride status updated", ride: updatedRide });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};




// Controller - Get Rides for Rider with filters and pagination
export const getRidesForRider = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10, status, startDate, endDate, minFare, maxFare } = req.query;
  try {
    const rides = await RideService.getRidesForRiderWithFilters(
      req.user.userId,
      parseInt(page as string),
      parseInt(pageSize as string),
      {
        status,
        startDate,
        endDate,
        minFare: minFare ? parseFloat(minFare as string) : undefined,
        maxFare: maxFare ? parseFloat(maxFare as string) : undefined,
      }
    );
    res.status(200).json({ rides });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};




// Cancel a ride
export const cancelRide = async (req: Request, res: Response) => {
  const { id } = req.params;
  const riderId = req?.user?.userId;  // Assuming the user's id is in the JWT payload

  try {
    const canceledRide = await RideService.cancelRide(id, riderId);
    res.status(200).json({
      message: "Ride canceled",
      ride: canceledRide,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




// Get earnings for the driver
export const getEarningsForDriver = async (req: Request, res: Response) => {
  const driverId = req.user.userId; // The driver ID comes from the authenticated user

  try {
    // Call the service to get the earnings of the driver
    const earnings = await RideService.getEarningsForDriver(driverId);
    res
      .status(200)
      .json({ success: true, message: "Your Total Earnings", data: earnings });
  } catch (error) {
    res
      .status(400)
      .json({ message: (error as Error).message || "Something went wrong!" });
  }
};

export const setRiderOnline = catchAsync(
  async (req: Request, res: Response) => {
    const riderId = req.params.id; // Rider ID passed in the route params
    const currentUserRole = req.user.role; // Get the role of the current authenticated user (from JWT)

    // Call the RiderService to set rider's online status
    const rider = await riderService.setRiderOnline(riderId, currentUserRole);

    // Send the response with the updated rider information
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Rider is now online",
      data: rider,
    });
  }
);

// Set Rider Offline (Only allowed for drivers or admins)
export const setRiderOffline = catchAsync(
  async (req: Request, res: Response) => {
    const riderId = req.params.id;
    const currentUserRole = req.user!.role; // Get the role of the current authenticated user (from JWT)

    // Call the RiderService to set rider's offline status
    const rider = await riderService.setRiderOffline(riderId, currentUserRole);

    // Send the response with the updated rider information
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Rider is now offline",
      data: rider,
    });
  }
);

// Get single ride by id (rider can only view own ride; drivers/admins allowed)
export const getRideById = async (req: Request, res: Response) => {
  try {
    const rideId = req.params.id;
    const ride = await RideModel.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const userId = req.user.userId;
    const role = req.user.role;

    // riders: only their own ride
    if (role === "rider" && ride.riderId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // drivers: allow if assigned to this ride (optional, keep simple)
    if (role === "driver" && ride.driverId && ride.driverId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ ride });
  } catch (e) {
    return res.status(400).json({ message: (e as Error).message });
  }
};


// Get total cost for the rider
export const getTotalCostForRider = async (req: Request, res: Response) => {
  try {
    const riderId = req.user!.userId;
    const totalCost = await RideService.getTotalCostForRider(riderId);
    res.status(200).json({
      success: true,
      message: "Your Total Ride Cost",
      data: totalCost,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: (error as Error).message || "Something went wrong!" });
  }
};

export const listOpenRequests = async (req: Request, res: Response) => {
  try {
    const driverId = req.user.userId;
    const rides = await RideModel.find({
      status: "requested",
      $or: [{ driverId: { $exists: false } }, { driverId: null }],
      $and: [
        { $or: [{ rejectedBy: { $ne: driverId } }, { rejectedBy: { $exists: false } }] },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ rides });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};


// PATCH /ride/:id/accept  (driver only)
export const acceptRide = async (req: Request, res: Response) => {
  const { id } = req.params;
  const driverId = req.user.userId;

  try {
    const driver = await UserModel.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    if (driver.role !== "driver") return res.status(403).json({ message: "Only drivers can accept rides" });
    if (driver.isBlocked) return res.status(400).json({ message: "Account is blocked" });
    if (driver.isSuspended) return res.status(400).json({ message: "Account is suspended" });
    if (driver.isApproved === false) return res.status(400).json({ message: "Driver not approved yet" });
    if (!driver.isOnline) return res.status(400).json({ message: "Go online to accept rides" });

    const updatedRide = await RideService.updateRideStatus(
      id,
      "accepted",
      driverId,
      req.user.role    // ← pass role here
    );

    res.status(200).json({ message: "Ride accepted", ride: updatedRide });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};


// PATCH /ride/:id/reject  (driver only)
// Marks this ride as rejected-by this driver so it won't show again to them.
export const rejectRide = async (req: Request, res: Response) => {
  const { id } = req.params;
  const driverId = req.user.userId;

  try {
    const ride = await RideModel.findById(id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "requested") return res.status(400).json({ message: "Ride is not in requested state" });

    // add driverId to rejectedBy if not present
    const already = ride.rejectedBy?.some(d => String(d) === String(driverId));
    if (!already) {
      ride.rejectedBy = [...(ride.rejectedBy ?? []), driverId as any];
      await ride.save();
    }

    res.status(200).json({ message: "Ride rejected" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};



// Driver: get current active ride
export const getActiveRideForDriver = async (req: Request, res: Response) => {
  try {
    const driverId = req.user.userId;
    const ride = await RideService.getActiveRideForDriver(driverId);
    return res.status(200).json({ ride });
  } catch (e) {
    return res.status(400).json({ message: (e as Error).message });
  }
};


