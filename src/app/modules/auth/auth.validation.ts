import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["admin", "rider", "driver"]),
    vehicleInfo: z.string().optional(),
    licenseNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "driver") {
      if (!data.vehicleInfo || data.vehicleInfo.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "vehicleInfo is required for drivers",
          path: ["vehicleInfo"],
        });
      }
      if (!data.licenseNumber || data.licenseNumber.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "licenseNumber is required for drivers",
          path: ["licenseNumber"],
        });
      }
    }
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
