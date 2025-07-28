import { Request, Response } from "express";
import RideService from "./ride.service";

// Request a ride
export const requestRide = async (req: Request, res: Response) => {
  const { pickupLocation, destination } = req.body;
  try {
    const newRide = await RideService.requestRide(
      req.user.userId, // Now TypeScript knows that userId exists on req.user
      pickupLocation,
      destination
    );
    res
      .status(201)
      .json({ message: "Ride requested successfully", ride: newRide });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
  }
};

// Get rides for the authenticated rider
export const getRidesForRider = async (req: Request, res: Response) => {
  try {
    const rides = await RideService.getRidesForRider(req.user.userId); // Now TypeScript knows `userId` exists
    res.status(200).json({ rides });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Cancel a ride
export const cancelRide = async (req: Request, res: Response) => {
  const { id } = req.params;
  const riderId = req.user.userId;  // Assuming the user's id is in the JWT payload

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
  const driverId = req.user.userId;  // Assuming the driver's ID is in the JWT payload

  try {
    const earnings = await RideService.getEarningsForDriver(driverId);
    res.status(200).json({ earnings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
