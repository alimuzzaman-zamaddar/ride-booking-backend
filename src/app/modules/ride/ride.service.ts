/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import RideModel from "./ride.model";
import { RideStatus } from "./ride.interface";

const ALLOWED_TRANSITIONS: Record<RideStatus, RideStatus[]> = {
  requested: ["accepted", "canceled"],
  accepted: ["picked_up", "canceled"],
  picked_up: ["in_transit", "canceled"],
  in_transit: ["completed", "canceled"],
  completed: [],
  canceled: [],
};

class RideService {
  // Request a ride
  async requestRide(
    riderId: string,
    pickupLocation: string,
    destination: string
  ) {
    const activeRide = await RideModel.findOne({
      riderId,
      status: { $in: ["requested", "accepted", "in_transit"] },
    });
    if (activeRide) {
      throw new Error("You already have an active ride.");
    }
    const newRide = new RideModel({
      riderId,
      pickupLocation,
      destination,
      status: "requested",
    });
    await newRide.save();
    return newRide;
  }

  // ✅ Keep only ONE updateRideStatus
  async updateRideStatus(
    rideId: string,
    nextStatus: RideStatus,
    actorUserId: string,
    actorRole: "driver" | "admin" | "rider"
  ) {
    const ride = await RideModel.findById(rideId);
    if (!ride) throw new Error("Ride not found");

    // only admin or assigned driver can update
    if (actorRole !== "admin") {
      if (!ride.driverId || String(ride.driverId) !== String(actorUserId)) {
        throw new Error("Only the assigned driver can update this ride");
      }
    }

    const allowed = ALLOWED_TRANSITIONS[ride.status] || [];
    if (!allowed.includes(nextStatus)) {
      throw new Error(
        `Invalid status transition: ${ride.status} → ${nextStatus}`
      );
    }

    ride.status = nextStatus;

    if (nextStatus === "completed") {
      ride.earnings = ride.earnings ?? 50;
      ride.rideCost = ride.rideCost ?? 50;
    }

    await ride.save();
    return ride;
  }

  // Backend - Ride Service (Adding Filters and Pagination)
  async getRidesForRiderWithFilters(
    riderId: string,
    page: number = 1,
    pageSize: number = 10,
    filters: {
      status?: string;
      startDate?: string;
      endDate?: string;
      minFare?: number;
      maxFare?: number;
    }
  ) {
    const query: any = { riderId };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    if (filters.minFare || filters.maxFare) {
      query.rideCost = {};
      if (filters.minFare) query.rideCost.$gte = filters.minFare;
      if (filters.maxFare) query.rideCost.$lte = filters.maxFare;
    }

    const rides = await RideModel.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return rides;
  }

  async getEarningsForDriver(driverId: string) {
    const completedRides = await RideModel.find({
      driverId,
      status: "completed",
    });
    if (!completedRides || completedRides.length === 0) {
      throw new Error("No completed rides found for the driver");
    }

    return completedRides.reduce(
      (total, ride) => total + (ride.earnings || 0),
      0
    );
  }

  async cancelRide(rideId: string, riderId: string) {
    const ride = await RideModel.findById(rideId);
    if (!ride) throw new Error("Ride not found");

    if (ride.riderId.toString() !== riderId) {
      throw new Error("You can only cancel your own rides");
    }

    if (ride.status === "accepted" || ride.status === "in_transit") {
      throw new Error(
        "You cannot cancel a ride once it is accepted or in transit"
      );
    }

    ride.status = "canceled";
    await ride.save();
    return ride;
  }

  async getTotalCostForRider(riderId: string) {
    const completedRides = await RideModel.find({
      riderId,
      status: "completed",
    });
    if (!completedRides || completedRides.length === 0) {
      throw new Error("No completed rides found for the rider");
    }
    return completedRides.reduce(
      (total, ride) => total + (ride.rideCost || 0),
      0
    );
  }

  async getActiveRideForDriver(driverId: string) {
    return RideModel.findOne({
      driverId,
      status: { $in: ["accepted", "picked_up", "in_transit"] },
    }).sort({ updatedAt: -1 });
  }
}

export default new RideService();
