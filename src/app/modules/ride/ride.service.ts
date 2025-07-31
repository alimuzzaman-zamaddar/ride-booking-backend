import RideModel from "./ride.model";
import UserModel from "../auth/auth.model";

class RideService {
  // Request a ride
  async requestRide(
    riderId: string,
    pickupLocation: string,
    destination: string
  ) {
    // Check if rider has an active ride
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

  async updateRideStatus(
    rideId: string,
    status: "requested" | "accepted" | "in_transit" | "completed" | "canceled",
    driverId: string
  ) {
    const ride = await RideModel.findById(rideId);
    if (!ride) throw new Error("Ride not found");

    // If accepting a ride, check driver eligibility
    if (status === "accepted") {
      const driver = await UserModel.findById(driverId);
      if (!driver) throw new Error("Driver not found");
      if (driver.role !== "driver") throw new Error("User is not a driver");
      if (driver.isSuspended) throw new Error("Driver is suspended");
      if (driver.isBlocked) throw new Error("Driver is blocked");
      // Check if driver already has an active ride
      const activeRide = await RideModel.findOne({
        driverId,
        status: { $in: ["accepted", "in_transit"] },
      });
      if (activeRide) {
        throw new Error("You already have an active ride.");
      }
      ride.driverId = driverId;
    }

    ride.status = status;

    if (status === "completed") {
      const earnings = 50;
      ride.earnings = earnings;
      ride.rideCost = 50; // Add cost for the rider
    }

    await ride.save();
    return ride;
  }

  // Get rides for a specific rider
  async getRidesForRider(riderId: string) {
    const rides = await RideModel.find({ riderId });
    if (!rides) throw new Error("No rides found for the rider");
    return rides;
  }

  // Get earnings for a specific driver
  async getEarningsForDriver(driverId: string) {
    // Find all completed rides for the driver and sum the earnings
    const completedRides = await RideModel.find({
      driverId,
      status: "completed",
    });
    if (!completedRides || completedRides.length === 0) {
      throw new Error("No completed rides found for the driver");
    }

    const earnings = completedRides.reduce(
      (total, ride) => total + (ride.earnings || 0),
      0
    );
    return earnings; // Return the total earnings for the driver
  }

  // Cancel a ride (Rider can cancel within allowed time)
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

  // Get total cost for a specific rider
  async getTotalCostForRider(riderId: string) {
    const completedRides = await RideModel.find({
      riderId,
      status: "completed",
    });
    if (!completedRides || completedRides.length === 0) {
      throw new Error("No completed rides found for the rider");
    }
    const totalCost = completedRides.reduce(
      (total, ride) => total + (ride.rideCost || 0),
      0
    );
    return totalCost;
  }
}

export default new RideService();
