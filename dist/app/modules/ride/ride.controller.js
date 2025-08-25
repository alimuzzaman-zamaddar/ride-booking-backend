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
exports.getTotalCostForRider = exports.getRideById = exports.setRiderOffline = exports.setRiderOnline = exports.getEarningsForDriver = exports.cancelRide = exports.getRidesForRider = exports.updateRideStatus = exports.requestRide = void 0;
const ride_service_1 = __importDefault(require("./ride.service"));
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
const rider_service_1 = __importDefault(require("../driver/rider.service"));
const ride_model_1 = __importDefault(require("./ride.model"));
// src/controllers/ride.controller.ts
const requestRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pickupLocation, destination } = req.body;
    // Calculate fare estimation (simplified logic)
    const fare = calculateFare(pickupLocation, destination);
    try {
        const newRide = yield ride_service_1.default.requestRide(req.user.userId, pickupLocation, destination, fare);
        res.status(201).json({
            message: "Ride requested successfully",
            ride: Object.assign(Object.assign({}, newRide), { rideCost: fare }), // Include fare in the response
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.requestRide = requestRide;
// Basic fare calculation function (this can be replaced with real API or algorithm)
const calculateFare = (pickupLocation, destination) => {
    // Here we can calculate fare based on pickup and destination
    // For example, simple static rate or use Google Maps API for distance calculation
    return 50; // Just an example value
};
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
// Controller - Get Rides for Rider with filters and pagination
const getRidesForRider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, pageSize = 10, status, startDate, endDate, minFare, maxFare } = req.query;
    try {
        const rides = yield ride_service_1.default.getRidesForRiderWithFilters(req.user.userId, parseInt(page), parseInt(pageSize), {
            status,
            startDate,
            endDate,
            minFare: minFare ? parseFloat(minFare) : undefined,
            maxFare: maxFare ? parseFloat(maxFare) : undefined,
        });
        res.status(200).json({ rides });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getRidesForRider = getRidesForRider;
// Cancel a ride
const cancelRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const riderId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId; // Assuming the user's id is in the JWT payload
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
// Get single ride by id (rider can only view own ride; drivers/admins allowed)
const getRideById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rideId = req.params.id;
        const ride = yield ride_model_1.default.findById(rideId);
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
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
});
exports.getRideById = getRideById;
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
