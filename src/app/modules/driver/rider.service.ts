import UserModel from "../auth/auth.model";


class RiderService {
  // Set Rider to Online
  async setRiderOnline(riderId: string, currentUserRole: string) {
    // Check if the user exists
    const rider = await UserModel.findById(riderId);
    if (!rider) throw new Error("Rider not found");

    // Ensure only drivers or admins can set the rider's online status
    if (currentUserRole !== "admin" && currentUserRole !== "driver") {
      throw new Error("Only drivers or admins can set rider online status");
    }

    // Set rider's status to online
    rider.isOnline = true;
    await rider.save();

    return rider;
  }

  // Set Rider to Offline
  async setRiderOffline(riderId: string, currentUserRole: string) {
    // Check if the user exists
    const rider = await UserModel.findById(riderId);
    if (!rider) throw new Error("Rider not found");

    // Ensure only drivers or admins can set the rider's offline status
    if (currentUserRole !== "admin" && currentUserRole !== "driver") {
      throw new Error("Only drivers or admins can set rider offline status");
    }

    // Set rider's status to offline
    rider.isOnline = false;
    await rider.save();

    return rider;
  }
}


export default new RiderService();
