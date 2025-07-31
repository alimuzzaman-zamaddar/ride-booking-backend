import { Router } from "express";
import { getAllUsers, blockUser } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/getall", checkAuth("admin"), getAllUsers);
router.patch("/block/:id", checkAuth("admin"), blockUser);

export default router;
