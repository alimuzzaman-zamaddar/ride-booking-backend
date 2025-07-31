"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth"); // Ensure the middleware is correctly imported
const ride_controller_1 = require("./ride.controller"); // Import the controller functions
const router = (0, express_1.Router)();
// Route to request a ride (Only allowed for riders)
router.post("/request", (0, checkAuth_1.checkAuth)("rider"), ride_controller_1.requestRide);
// Route to update ride status (Only allowed for drivers or admins)
router.patch("/:id/status", (0, checkAuth_1.checkAuth)("driver", "admin"), ride_controller_1.updateRideStatus);
// Route to get all rides for the authenticated rider
router.get("/me", (0, checkAuth_1.checkAuth)("rider", "driver"), ride_controller_1.getRidesForRider);
// Route to get earnings for a specific driver
router.get("/earnings", (0, checkAuth_1.checkAuth)("driver"), ride_controller_1.getEarningsForDriver);
// Route to cancel a ride (Only allowed for the rider who created it)
router.patch("/:id/cancel", (0, checkAuth_1.checkAuth)("rider"), ride_controller_1.cancelRide);
// Route to set rider status to online (only accessible to the rider and admins)
router.patch("/:id/online", (0, checkAuth_1.checkAuth)("driver", "admin"), ride_controller_1.setRiderOnline);
// Route to set rider status to offline (only accessible to the rider and admins)
router.patch("/:id/offline", (0, checkAuth_1.checkAuth)("driver", "admin"), ride_controller_1.setRiderOffline);
// Route to get total cost for a specific rider
router.get("/cost", (0, checkAuth_1.checkAuth)("rider"), ride_controller_1.getTotalCostForRider);
exports.default = router;
