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
exports.logout = exports.changePassword = exports.updateMe = exports.getMe = exports.suspendDriver = exports.approveDriver = exports.blockUser = exports.getAllUsers = exports.login = exports.register = void 0;
const auth_service_1 = __importDefault(require("./auth.service"));
const auth_model_1 = __importDefault(require("./auth.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    console.log(email, password, role);
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
    try {
        const { user, token } = yield auth_service_1.default.login(email, password);
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            token,
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(400).json({
            message: error instanceof Error ? error.message : "An error occurred",
        });
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
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const me = yield auth_model_1.default.findById(req.user.userId).select("-password");
        if (!me)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json({ data: me });
    }
    catch (e) {
        res.status(500).json({ message: "Failed to fetch profile" });
    }
});
exports.getMe = getMe;
const updateMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone } = req.body;
        // Only allow name & phone changes here (not role/email/password)
        const updates = {};
        if (typeof name === "string")
            updates.name = name;
        if (typeof phone === "string")
            updates.phone = phone;
        const updated = yield auth_model_1.default.findByIdAndUpdate(req.user.userId, { $set: updates }, { new: true, runValidators: true, select: "-password" });
        if (!updated)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Profile updated", data: updated });
    }
    catch (e) {
        res.status(400).json({ message: "Failed to update profile" });
    }
});
exports.updateMe = updateMe;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // set by checkAuth
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: "oldPassword and newPassword are required" });
        }
        if (newPassword.length < 6) {
            return res
                .status(400)
                .json({ message: "New password must be at least 6 characters" });
        }
        const user = yield auth_model_1.default.findById(userId).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Compare old password
        const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        // Assign new password (pre-save hook will hash on modify)
        user.password = newPassword;
        yield user.save();
        return res.status(200).json({ message: "Password changed successfully" });
    }
    catch (err) {
        console.error("changePassword error:", err);
        return res.status(500).json({ message: "Failed to change password" });
    }
});
exports.changePassword = changePassword;
const logout = (req, res) => {
    try {
        // Clear the token from the cookies (the client should delete the token as well)
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "An error occurred during logout" });
    }
};
exports.logout = logout;
