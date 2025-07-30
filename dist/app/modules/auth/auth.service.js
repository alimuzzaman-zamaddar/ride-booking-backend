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
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_model_1 = __importDefault(require("./auth.model")); // Assuming UserModel is your Mongoose model
class AuthService {
    // Register a new user
    register(email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield auth_model_1.default.findOne({ email });
            if (existingUser)
                throw new Error("User already exists");
            const newUser = new auth_model_1.default({ email, password, role });
            yield newUser.save();
            return newUser;
        });
    }
    // Login and return JWT
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield auth_model_1.default.findOne({ email })); // Explicitly cast to User
            if (!user)
                throw new Error("Invalid credentials");
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch)
                throw new Error("Invalid credentials");
            const payload = {
                userId: user._id.toString(), // Convert ObjectId to string
                role: user.role,
            };
            const jwtSecret = process.env.JWT_ACCESS_SECRET;
            if (!jwtSecret) {
                throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
            }
            const token = jsonwebtoken_1.default.sign(payload, jwtSecret, {
                expiresIn: process.env.JWT_ACCESS_EXPIRES,
            });
            return token;
        });
    }
    // Verify JWT Token and get user payload
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
                return decoded;
            }
            catch (error) {
                console.error("Error verifying token:", error);
                throw new Error("Invalid or expired token");
            }
        });
    }
}
exports.default = new AuthService();
