"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ride_model_1 = __importDefault(require("./ride.model"));
class RideService {
    // Request a ride
    requestRide(riderId, pickupLocation, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            const newRide = new ride_model_1.default({
                riderId,
                pickupLocation,
                destination,
                status: "requested", // Status is a literal type, no longer a generic string
            });
            yield newRide.save();
            return newRide;
        });
    }
    // Update ride status (Driver or Admin can update)
    updateRideStatus(rideId, status, driverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield ride_model_1.default.findById(rideId);
            if (!ride)
                throw new Error("Ride not found");
            ride.status = status;
            if (status === "accepted") {
                ride.driverId = driverId;
            }
            if (status === "completed") {
                // Example logic for earnings calculation (fixed amount per ride)
                const earnings = 50; // You can replace this with a dynamic calculation logic
                ride.earnings = earnings;
            }
            yield ride.save();
            return ride;
        });
    }
    // Get rides for a specific rider
    getRidesForRider(riderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rides = yield ride_model_1.default.find({ riderId });
            if (!rides)
                throw new Error("No rides found for the rider");
            return rides;
        });
    }
    // Get earnings for a specific driver
    getEarningsForDriver(driverId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find all completed rides for the driver and sum the earnings
            const completedRides = yield ride_model_1.default.find({
                driverId,
                status: "completed",
            });
            if (!completedRides || completedRides.length === 0) {
                throw new Error("No completed rides found for the driver");
            }
            const earnings = completedRides.reduce((total, ride) => total + (ride.earnings || 0), 0);
            return earnings; // Return the total earnings for the driver
        });
    }
    // Cancel a ride (Rider can cancel within allowed time)
    cancelRide(rideId, riderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield ride_model_1.default.findById(rideId);
            if (!ride)
                throw new Error("Ride not found");
            if (ride.riderId.toString() !== riderId) {
                throw new Error("You can only cancel your own rides");
            }
            if (ride.status === "accepted" || ride.status === "in_transit") {
                throw new Error("You cannot cancel a ride once it is accepted or in transit");
            }
            ride.status = "canceled";
            yield ride.save();
            return ride;
        });
    }
}
exports.default = new RideService();
