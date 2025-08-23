import { Router } from "express";
import { getAllUsers, blockUser, UnblockUser, getUserById } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/getall", checkAuth("admin"), getAllUsers);
router.get("/:id", checkAuth("admin"), getUserById); // ✅ NEW
router.patch("/block/:id", checkAuth("admin"), blockUser);
router.patch("/unblock/:id", checkAuth("admin"), UnblockUser);

export default router;
