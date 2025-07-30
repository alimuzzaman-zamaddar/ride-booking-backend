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
const auth_model_1 = __importDefault(require("../auth/auth.model"));
class RiderService {
    // Set Rider to Online
    setRiderOnline(riderId, currentUserRole) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the user exists
            const rider = yield auth_model_1.default.findById(riderId);
            if (!rider)
                throw new Error("Rider not found");
            // Ensure only drivers or admins can set the rider's online status
            if (currentUserRole !== "admin" && currentUserRole !== "driver") {
                throw new Error("Only drivers or admins can set rider online status");
            }
            // Set rider's status to online
            rider.isOnline = true;
            yield rider.save();
            return rider;
        });
    }
    // Set Rider to Offline
    setRiderOffline(riderId, currentUserRole) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the user exists
            const rider = yield auth_model_1.default.findById(riderId);
            if (!rider)
                throw new Error("Rider not found");
            // Ensure only drivers or admins can set the rider's offline status
            if (currentUserRole !== "admin" && currentUserRole !== "driver") {
                throw new Error("Only drivers or admins can set rider offline status");
            }
            // Set rider's status to offline
            rider.isOnline = false;
            yield rider.save();
            return rider;
        });
    }
}
exports.default = new RiderService();
