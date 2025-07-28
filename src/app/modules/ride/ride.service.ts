import RideModel from "./ride.model";

class RideService {
  // Request a ride
  async requestRide(
    riderId: string,
    pickupLocation: string,
    destination: string
  ) {
    const newRide = new RideModel({
      riderId,
      pickupLocation,
      destination,
      status: "requested", // Status is a literal type, no longer a generic string
    });
    await newRide.save();
    return newRide;
  }

  // Update ride status (Driver or Admin can update)
  async updateRideStatus(
    rideId: string,
    status: "requested" | "accepted" | "in_transit" | "completed" | "canceled",
    driverId: string
  ) {
    const ride = await RideModel.findById(rideId);
    if (!ride) throw new Error("Ride not found");

    ride.status = status;
    if (status === "accepted") {
      ride.driverId = driverId; // Assign driver when accepted
    }

    if (status === "completed") {
      // Example logic for earnings calculation (fixed amount per ride)
      const earnings = 50; // You can replace this with a dynamic calculation logic
      ride.earnings = earnings;
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
}

export default new RideService();
