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
exports.checkUserBlocked = exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env"); // Assuming your environment variables are in env.ts
const auth_model_1 = __importDefault(require("../modules/auth/auth.model"));
const checkAuth = (...authRoles) => {
    return (req, res, next
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
        if (!token) {
            return res.status(403).json({ message: "Forbidden" });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.envVars.JWT_ACCESS_SECRET);
            req.user = decoded; // Attach decoded user to request
            // Check if the user's role matches the allowed roles
            if (!authRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "Access denied" });
            }
            // Check if user is blocked
            const user = yield auth_model_1.default.findById(decoded.userId);
            if (user && user.isBlocked) {
                return res.status(403).json({
                    message: "You are blocked by admin. Please contact admin for assistance.",
                });
            }
            // Proceed to the next middleware/handler
            next();
        }
        catch (error) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    });
};
exports.checkAuth = checkAuth;
// Separate middleware to check if user is blocked (for routes that need auth but not role-based access)
const checkUserBlocked = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
        if (!token) {
            return next(); // Allow unauthenticated requests to proceed (for login/register)
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.envVars.JWT_ACCESS_SECRET);
        const user = yield auth_model_1.default.findById(decoded.userId);
        if (user && user.isBlocked) {
            return res.status(403).json({
                message: "You are blocked by admin. Please contact admin for assistance.",
            });
        }
        next();
    }
    catch (error) {
        next(); // Allow requests to proceed if token is invalid (for login/register)
    }
});
exports.checkUserBlocked = checkUserBlocked;
