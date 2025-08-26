import { Router } from "express";
import {
  approveDriver,
  suspendDriver,
  getEarningsForDriver,
  setDriverOnline,
  setDriverOffline,
  getEarningsSummary,
  getDriverRideHistory,
} from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.patch("/approve/:id", checkAuth("admin"), approveDriver);
router.patch("/suspend/:id", checkAuth("admin"), suspendDriver);
router.get("/earnings", checkAuth("driver"), getEarningsForDriver);
router.patch("/me/online", checkAuth("driver"), setDriverOnline);
router.patch("/me/offline", checkAuth("driver"), setDriverOffline);
// NEW: summarized earnings (daily/weekly/monthly)
router.get("/earnings/summary", checkAuth("driver"), getEarningsSummary);
router.get("/rides", checkAuth("driver"), getDriverRideHistory);

export default router;
