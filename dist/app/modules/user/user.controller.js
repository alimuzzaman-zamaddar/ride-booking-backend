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
exports.blockUser = exports.getAllUsers = void 0;
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
exports.getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield auth_model_1.default.find();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All users fetched successfully",
        data: users,
    });
}));
exports.blockUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { isBlocked } = req.body;
    const user = yield auth_model_1.default.findById(id);
    if (!user) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 404,
            success: false,
            message: "User not found",
        });
    }
    if (user.role === "admin") {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 403,
            success: false,
            message: "Cannot block admin users",
        });
    }
    user.isBlocked = isBlocked;
    yield user.save();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
        data: {
            id: user._id,
            email: user.email,
            role: user.role,
            isBlocked: user.isBlocked,
        },
    });
}));
