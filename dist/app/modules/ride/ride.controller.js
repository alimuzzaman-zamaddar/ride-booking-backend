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
exports.getTotalCostForRider = exports.setRiderOffline = exports.setRiderOnline = exports.getEarningsForDriver = exports.cancelRide = exports.getRidesForRider = exports.updateRideStatus = exports.requestRide = void 0;
const ride_service_1 = __importDefault(require("./ride.service"));
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const rider_service_1 = __importDefault(require("../driver/rider.service"));
// Request a ride
const requestRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pickupLocation, destination } = req.body;
    try {
        const newRide = yield ride_service_1.default.requestRide(req.user.userId, pickupLocation, destination);
        res
            .status(201)
            .json({ message: "Ride requested successfully", ride: newRide });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.requestRide = requestRide;
// Update ride status (Driver or Admin)
const updateRideStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedRide = yield ride_service_1.default.updateRideStatus(id, status, req.user.userId // TypeScript now knows `userId` exists
        );
        res.status(200).json({ message: "Ride status updated", ride: updatedRide });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateRideStatus = updateRideStatus;
// Get rides for the authenticated rider
const getRidesForRider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rides = yield ride_service_1.default.getRidesForRider(req.user.userId); // Now TypeScript knows `userId` exists
        res.status(200).json({ rides });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getRidesForRider = getRidesForRider;
// Cancel a ride
const cancelRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const riderId = req.user.userId; // Assuming the user's id is in the JWT payload
    try {
        const canceledRide = yield ride_service_1.default.cancelRide(id, riderId);
        res.status(200).json({
            message: "Ride canceled",
            ride: canceledRide,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.cancelRide = cancelRide;
// Get earnings for the driver
const getEarningsForDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId; // The driver ID comes from the authenticated user
    try {
        // Call the service to get the earnings of the driver
        const earnings = yield ride_service_1.default.getEarningsForDriver(driverId);
        res
            .status(200)
            .json({ success: true, message: "Your Total Earnings", data: earnings });
    }
    catch (error) {
        res
            .status(400)
            .json({ message: error.message || "Something went wrong!" });
    }
});
exports.getEarningsForDriver = getEarningsForDriver;
exports.setRiderOnline = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = req.params.id; // Rider ID passed in the route params
    const currentUserRole = req.user.role; // Get the role of the current authenticated user (from JWT)
    // Call the RiderService to set rider's online status
    const rider = yield rider_service_1.default.setRiderOnline(riderId, currentUserRole);
    // Send the response with the updated rider information
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Rider is now online",
        data: rider,
    });
}));
// Set Rider Offline (Only allowed for drivers or admins)
exports.setRiderOffline = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = req.params.id;
    const currentUserRole = req.user.role; // Get the role of the current authenticated user (from JWT)
    // Call the RiderService to set rider's offline status
    const rider = yield rider_service_1.default.setRiderOffline(riderId, currentUserRole);
    // Send the response with the updated rider information
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Rider is now offline",
        data: rider,
    });
}));
// Get total cost for the rider
const getTotalCostForRider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const riderId = req.user.userId;
        const totalCost = yield ride_service_1.default.getTotalCostForRider(riderId);
        res.status(200).json({
            success: true,
            message: "Your Total Ride Cost",
            data: totalCost,
        });
    }
    catch (error) {
        res
            .status(400)
            .json({ message: error.message || "Something went wrong!" });
    }
});
exports.getTotalCostForRider = getTotalCostForRider;
