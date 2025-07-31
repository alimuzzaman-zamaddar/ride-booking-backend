"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = (0, express_1.Router)();
router.get("/getall", (0, checkAuth_1.checkAuth)("admin"), user_controller_1.getAllUsers);
router.patch("/block/:id", (0, checkAuth_1.checkAuth)("admin"), user_controller_1.blockUser);
exports.default = router;
