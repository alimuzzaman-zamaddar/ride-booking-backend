/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import RideModel from "./ride.model";
import { RideStatus } from "./ride.interface";
import mongoose from "mongoose";

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
    destination: string,
    fare?: number // <— accept optional fare (to match your controller)
  ) {
    const activeRide = await RideModel.findOne({
      riderId,
      status: { $in: ["requested", "accepted", "in_transit", "picked_up"] },
    });
    if (activeRide) {
      throw new Error("You already have an active ride.");
    }
    const newRide = new RideModel({
      riderId,
      pickupLocation,
      destination,
      status: "requested",
      rideCost: fare ?? 0, // <— set fare now
    });
    await newRide.save();
    return newRide.toObject();
  }


  
  async updateRideStatus(
    rideId: string,
    nextStatus: RideStatus,
    actorUserId: string,
    actorRole: "driver" | "admin" | "rider"
  ) {
    const ride = await RideModel.findById(rideId);
    if (!ride) throw new Error("Ride not found");

    const isAcceptingRequested =
      ride.status === "requested" && nextStatus === "accepted";

    if (actorRole !== "admin" && !isAcceptingRequested) {
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

    if (isAcceptingRequested) {
      ride.driverId = new mongoose.Types.ObjectId(actorUserId);
    }

    ride.status = nextStatus;

    if (nextStatus === "completed") {
      const baseFare =
        typeof ride.rideCost === "number" && ride.rideCost > 0
          ? ride.rideCost
          : 50;
      ride.rideCost = baseFare;

      const driverShare = Math.round(baseFare * 0.8);
      ride.earnings = driverShare;
    }

    await ride.save();
    return ride;
  }

  async getDriverEarningsBuckets(
    driverId: string,
    range: "daily" | "weekly" | "monthly"
  ) {
    // Mongo expressions for bucketing
    const matchStage = {
      $match: {
        driverId: new mongoose.Types.ObjectId(driverId),
        status: "completed",
      },
    };

    // Build group key depending on range
    let groupId: any = {};
    if (range === "daily") {
      groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    } else if (range === "monthly") {
      groupId = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    } else {
      // weekly (ISO week)
      groupId = {
        $concat: [
          { $toString: { $isoWeekYear: "$createdAt" } },
          "-W",
          {
            $toString: {
              $cond: [
                { $lt: [{ $isoWeek: "$createdAt" }, 10] },
                { $concat: ["0", { $toString: { $isoWeek: "$createdAt" } }] },
                { $toString: { $isoWeek: "$createdAt" } },
              ],
            },
          },
        ],
      };
    }

    const pipeline = [
      matchStage,
      {
        $group: {
          _id: groupId,
          totalEarnings: { $sum: { $ifNull: ["$earnings", 0] } },
          totalRides: { $sum: 1 },
          // earliest docs’ date (optional, for sorting robustness)
          firstDate: { $min: "$createdAt" },
        },
      },
      { $sort: { firstDate: 1 } },
      {
        $project: {
          _id: 0,
          label: "$_id",
          totalEarnings: 1,
          totalRides: 1,
        },
      },
    ];

    const rows = await RideModel.aggregate(pipeline);
    return rows as Array<{
      label: string;
      totalEarnings: number;
      totalRides: number;
    }>;
  }

  async getRidesForDriverWithFilters(
    driverId: string,
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
    const query: any = { driverId };

    if (filters.status) query.status = filters.status;

    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    if (filters.minFare || filters.maxFare) {
      query.rideCost = {};
      if (filters.minFare !== undefined) query.rideCost.$gte = filters.minFare;
      if (filters.maxFare !== undefined) query.rideCost.$lte = filters.maxFare;
    }

    const [items, total] = await Promise.all([
      RideModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      RideModel.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
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
