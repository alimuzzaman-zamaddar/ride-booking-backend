"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const rideSchema = new mongoose_1.Schema({
    riderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    driverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    }, // Driver is optional until the ride is accepted
    pickupLocation: { type: String, required: true },
    destination: { type: String, required: true },
    status: {
        type: String,
        enum: ["requested", "accepted", "in_transit", "completed", "canceled"],
        default: "requested",
    },
    rideCost: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
    versionKey: false,
});
// Pre-save hook to update the 'updatedAt' field when the document is modified
rideSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});
const RideModel = mongoose_1.default.model("Ride", rideSchema);
exports.default = RideModel;
