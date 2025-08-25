"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = (0, express_1.Router)();
// Route for registering a user
router.post("/register", auth_controller_1.register);
// Route for logging in a user
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
// Route to get all users (admin only)
router.get("/getall", (0, checkAuth_1.checkAuth)("admin"), auth_controller_1.getAllUsers);
// Route to block/unblock a user (admin only)
router.patch("/block/:id", (0, checkAuth_1.checkAuth)("admin"), auth_controller_1.blockUser);
// Route to approve a driver (admin only)
router.patch("/drivers/approve/:id", (0, checkAuth_1.checkAuth)("admin"), auth_controller_1.approveDriver);
// Route to suspend/unsuspend a driver (admin only)
router.patch("/drivers/suspend/:id", (0, checkAuth_1.checkAuth)("admin"), auth_controller_1.suspendDriver);
// profile endpoints
router.get("/me", (0, checkAuth_1.checkAuth)("admin", "driver", "rider"), auth_controller_1.getMe);
router.patch("/me", (0, checkAuth_1.checkAuth)("admin", "driver", "rider"), auth_controller_1.updateMe);
router.patch("/me/change-password", (0, checkAuth_1.checkAuth)("admin", "driver", "rider"), auth_controller_1.changePassword);
exports.default = router;
