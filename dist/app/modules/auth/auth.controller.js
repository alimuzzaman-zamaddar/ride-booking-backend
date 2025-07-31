"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suspendDriver = exports.approveDriver = exports.blockUser = exports.getAllUsers = exports.login = exports.register = void 0;
const auth_service_1 = __importDefault(require("./auth.service"));
const auth_model_1 = __importDefault(require("./auth.model"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    try {
        const user = yield auth_service_1.default.register(email, password, role);
        res.status(201).json({ message: "User registered successfully", user });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log("Request Body:", req.body); // Add this line to log incoming data
    try {
        const token = yield auth_service_1.default.login(email, password);
        res.status(200).json({
            message: "Login successful",
            token,
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res
            .status(400)
            .json({ message: error.message || "An error occurred during login" });
    }
});
exports.login = login;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield auth_model_1.default.find();
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});
exports.getAllUsers = getAllUsers;
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isBlocked } = req.body;
        const user = yield auth_model_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Prevent blocking admins
        if (user.role === "admin") {
            return res.status(403).json({ message: "Cannot block admin users" });
        }
        user.isBlocked = isBlocked;
        yield user.save();
        res.status(200).json({
            message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update user status" });
    }
});
exports.blockUser = blockUser;
const approveDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield auth_model_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Driver not found" });
        }
        if (user.role !== "driver") {
            return res.status(400).json({ message: "User is not a driver" });
        }
        user.isApproved = true;
        yield user.save();
        res.status(200).json({ message: "Driver approved successfully", user });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to approve driver" });
    }
});
exports.approveDriver = approveDriver;
const suspendDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { isSuspended } = req.body;
        const user = yield auth_model_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Driver not found" });
        }
        if (user.role !== "driver") {
            return res.status(400).json({ message: "User is not a driver" });
        }
        user.isSuspended = isSuspended;
        yield user.save();
        res.status(200).json({
            message: `Driver ${isSuspended ? "suspended" : "unsuspended"} successfully`,
            user,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to update driver suspension status" });
    }
});
exports.suspendDriver = suspendDriver;
