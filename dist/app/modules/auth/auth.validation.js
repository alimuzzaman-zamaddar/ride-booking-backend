"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z
    .object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(["admin", "rider", "driver"]),
    vehicleInfo: zod_1.z.string().optional(),
    licenseNumber: zod_1.z.string().optional(),
})
    .superRefine((data, ctx) => {
    if (data.role === "driver") {
        if (!data.vehicleInfo || data.vehicleInfo.trim() === "") {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "vehicleInfo is required for drivers",
                path: ["vehicleInfo"],
            });
        }
        if (!data.licenseNumber || data.licenseNumber.trim() === "") {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "licenseNumber is required for drivers",
                path: ["licenseNumber"],
            });
        }
    }
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
