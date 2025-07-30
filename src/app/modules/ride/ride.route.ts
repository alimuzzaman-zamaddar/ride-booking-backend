import { Router } from "express";
import {checkAuth }from "../../middlewares/checkAuth"; // Ensure the middleware is correctly imported
import {
  requestRide,
  updateRideStatus,
  getRidesForRider,
  cancelRide,
  getEarningsForDriver,
  setRiderOnline,
  setRiderOffline,
} from "./ride.controller"; // Import the controller functions

const router = Router();

// Route to request a ride (Only allowed for riders)
router.post("/request", checkAuth("rider"), requestRide);

// Route to update ride status (Only allowed for drivers or admins)
router.patch("/:id/status", checkAuth("driver", "admin"), updateRideStatus);

// Route to get all rides for the authenticated rider
router.get("/me", checkAuth("rider","driver"), getRidesForRider);
// Route to get earnings for a specific driver
router.get("/earnings", checkAuth("driver"), getEarningsForDriver); 

// Route to cancel a ride (Only allowed for the rider who created it)
router.patch("/:id/cancel", checkAuth("rider"), cancelRide); 

// Route to set rider status to online (only accessible to the rider and admins)
router.post("/:id/online", checkAuth("driver", "admin"), setRiderOnline);

// Route to set rider status to offline (only accessible to the rider and admins)
router.post("/:id/offline", checkAuth("driver", "admin"), setRiderOffline);

export default router;
