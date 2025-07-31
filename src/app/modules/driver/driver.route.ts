import { Router } from "express";
import {
  approveDriver,
  suspendDriver,
  getEarningsForDriver,
} from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.patch("/approve/:id", checkAuth("admin"), approveDriver);
router.patch("/suspend/:id", checkAuth("admin"), suspendDriver);
router.get("/earnings", checkAuth("driver"), getEarningsForDriver);

export default router;
