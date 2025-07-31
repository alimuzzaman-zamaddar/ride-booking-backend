import { Request, Response } from "express";
import RideService from "./ride.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import riderService from "../driver/rider.service";

// Request a ride
export const requestRide = async (req: Request, res: Response) => {
  const { pickupLocation, destination } = req.body;
  try {
    const newRide = await RideService.requestRide(
      req.user.userId,
      pickupLocation,
      destination
    );
    res
      .status(201)
      .json({ message: "Ride requested successfully", ride: newRide });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Update ride status (Driver or Admin)
export const updateRideStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedRide = await RideService.updateRideStatus(
      id,
      status,
      req.user.userId // TypeScript now knows `userId` exists
    );
    res.status(200).json({ message: "Ride status updated", ride: updatedRide });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Get rides for the authenticated rider
export const getRidesForRider = async (req: Request, res: Response) => {
  try {
    const rides = await RideService.getRidesForRider(req.user.userId); // Now TypeScript knows `userId` exists
    res.status(200).json({ rides });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Cancel Ride Controller
export const cancelRide = async (req: Request, res: Response) => {
  const rideId = req.params.rideId;
  const userId = req.user.userId; // Retrieved from the decoded JWT

  try {
    const ride = await RideModel.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if the ride belongs to the user
    if (ride.riderId.toString() !== userId) {
      return res.status(403).json({ message: "You can only cancel your own rides" });
    }

    // Proceed with canceling the ride
    ride.status = "canceled";
    await ride.save();

    return res.status(200).json({
      message: "Ride canceled successfully",
      ride,
    });
  } catch (error) {
    console.error("Error canceling ride:", error); // Log the error details
    return res.status(500).json({
      message: "Error canceling ride",
      error: error.message || error, // Return the error details in the response
    });
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
