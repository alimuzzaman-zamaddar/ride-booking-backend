"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
// Route for registering a user
router.post("/register", auth_controller_1.register);
// Route for logging in a user
router.post("/login", auth_controller_1.login);
exports.default = router;
