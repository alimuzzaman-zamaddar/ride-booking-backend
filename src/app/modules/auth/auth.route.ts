import { Router } from "express";
import {
  register,
  login,
  getAllUsers,
  blockUser,
  approveDriver,
  suspendDriver,
  logout,
  getMe,
  updateMe,
  changePassword,
} from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

// Route for registering a user
router.post("/register", register);

// Route for logging in a user
router.post("/login", login);

router.post("/logout", logout);

// Route to get all users (admin only)
router.get("/getall", checkAuth("admin"), getAllUsers);



// Route to block/unblock a user (admin only)
router.patch("/block/:id", checkAuth("admin"), blockUser);

// Route to approve a driver (admin only)
router.patch("/drivers/approve/:id", checkAuth("admin"), approveDriver);
// Route to suspend/unsuspend a driver (admin only)
router.patch("/drivers/suspend/:id", checkAuth("admin"), suspendDriver);

// profile endpoints
router.get("/me", checkAuth("admin", "driver", "rider"), getMe);
router.patch("/me", checkAuth("admin", "driver", "rider"), updateMe);
router.patch(
  "/me/change-password",
  checkAuth("admin", "driver", "rider"),
  changePassword
);

export default router;
