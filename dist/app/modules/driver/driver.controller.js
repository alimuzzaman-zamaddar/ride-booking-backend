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
exports.getEarningsForDriver = exports.suspendDriver = exports.approveDriver = void 0;
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const ride_service_1 = __importDefault(require("../ride/ride.service"));
const sendResponse_1 = require("../../utils/sendResponse");
const catchAsync_1 = require("../../utils/catchAsync");
exports.approveDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield auth_model_1.default.findById(id);
    if (!user) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 404,
            success: false,
            message: "Driver not found",
        });
    }
    if (user.role !== "driver") {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 400,
            success: false,
            message: "User is not a driver",
        });
    }
    user.isApproved = true;
    yield user.save();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Driver approved successfully",
        data: user,
    });
}));
exports.suspendDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { isSuspended } = req.body;
    const user = yield auth_model_1.default.findById(id);
    if (!user) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 404,
            success: false,
            message: "Driver not found",
        });
    }
    if (user.role !== "driver") {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 400,
            success: false,
            message: "User is not a driver",
        });
    }
    user.isSuspended = isSuspended;
    yield user.save();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: `Driver ${isSuspended ? "suspended" : "unsuspended"} successfully`,
        data: user,
    });
}));
exports.getEarningsForDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId;
    const earnings = yield ride_service_1.default.getEarningsForDriver(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Your Total Earnings",
        data: earnings,
    });
}));
