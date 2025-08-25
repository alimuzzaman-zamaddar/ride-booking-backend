import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import {
  requestRide,
  updateRideStatus,
  getRidesForRider,
  cancelRide,
  getEarningsForDriver,
  setRiderOnline,
  setRiderOffline,
  getTotalCostForRider,
  getRideById,
  listOpenRequests,
  acceptRide,
  rejectRide,
  getActiveRideForDriver, // ✅ add
} from "./ride.controller";

const router = Router();

router.post("/request", checkAuth("rider"), requestRide);
router.patch("/:id/status", checkAuth("driver", "admin"), updateRideStatus);
router.get("/me", checkAuth("rider", "driver"), getRidesForRider);
router.get("/earnings", checkAuth("driver"), getEarningsForDriver);
router.patch("/:id/cancel", checkAuth("rider"), cancelRide);
router.patch("/:id/online", checkAuth("driver", "admin"), setRiderOnline);
router.patch("/:id/offline", checkAuth("driver", "admin"), setRiderOffline);
router.get("/cost", checkAuth("rider"), getTotalCostForRider);

router.get("/requests/open", checkAuth("driver"), listOpenRequests);
router.patch("/:id/accept", checkAuth("driver"), acceptRide);
router.patch("/:id/reject", checkAuth("driver"), rejectRide);

router.get("/active", checkAuth("driver"), getActiveRideForDriver); // ✅ new

router.get("/:id", checkAuth("admin", "driver", "rider"), getRideById);

export default router;
