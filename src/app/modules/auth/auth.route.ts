import { Router } from "express";
import { register, login, getAllUsers, blockUser } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

// Route for registering a user
router.post("/register", register);

// Route for logging in a user
router.post("/login", login);

// Route to get all users (admin only)
router.get("/getall", checkAuth("admin"), getAllUsers);

// Route to block/unblock a user (admin only)
router.patch("/block/:id", checkAuth("admin"), blockUser);

export default router;
