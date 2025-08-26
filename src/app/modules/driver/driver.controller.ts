import { Request, Response } from "express";
import UserModel from "../auth/auth.model";
import RideService from "../ride/ride.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

export const approveDriver = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Driver not found",
      data: user,
    });
  }
  if (user.role !== "driver") {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "User is not a driver",
      data: user,
    });
  }
  user.isApproved = true;
  await user.save();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Driver approved successfully",
    data: user,
  });
});


export const getEarningsSummary = catchAsync(
  async (req: Request, res: Response) => {
    const driverId = req.user.userId;
    const rangeRaw = (req.query.range as string) || "daily";
    const range = (["daily", "weekly", "monthly"] as const).includes(
      rangeRaw as any
    )
      ? (rangeRaw as "daily" | "weekly" | "monthly")
      : "daily";

    const buckets = await RideService.getDriverEarningsBuckets(driverId, range);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Earnings summary (${range})`,
      data: buckets,
    });
  }
);

// ▶️ NEW: Driver ride history
export const getDriverRideHistory = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user.userId;

  const {
    page = "1",
    pageSize = "10",
    status,
    startDate,
    endDate,
    minFare,
    maxFare,
  } = req.query as Record<string, string | undefined>;

  const parsed = await RideService.getRidesForDriverWithFilters(
    driverId,
    parseInt(page || "1", 10),
    parseInt(pageSize || "10", 10),
    {
      status,
      startDate,
      endDate,
      minFare: minFare ? parseFloat(minFare) : undefined,
      maxFare: maxFare ? parseFloat(maxFare) : undefined,
    }
  );

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Driver ride history",
    data: parsed,
  });
});

export const suspendDriver = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isSuspended } = req.body;
  const user = await UserModel.findById(id);
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Driver not found",
      data: user,
    });
  }
  if (user.role !== "driver") {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "User is not a driver",
      data: user,
    });
  }
  user.isSuspended = isSuspended;
  await user.save();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Driver ${isSuspended ? "suspended" : "unsuspended"} successfully`,
    data: user,
  });
});

export const getEarningsForDriver = catchAsync(
  async (req: Request, res: Response) => {
    const driverId = req.user.userId;
    const earnings = await RideService.getEarningsForDriver(driverId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Your Total Earnings",
      data: earnings,
    });
  }
);





export const setDriverOnline = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user.userId;
  const user = await UserModel.findById(driverId);

  if (!user) {
    return sendResponse(res, { statusCode: 404, success: false, message: "Driver not found", data: null });
  }
  if (user.role !== "driver") {
    return sendResponse(res, { statusCode: 403, success: false, message: "Only drivers can go online", data: null });
  }
  if (user.isSuspended) {
    return sendResponse(res, { statusCode: 400, success: false, message: "Account suspended. Contact support.", data: null });
  }
  if (user.isBlocked) {
    return sendResponse(res, { statusCode: 400, success: false, message: "Account blocked. Contact support.", data: null });
  }
  if (user.isApproved === false) {
    return sendResponse(res, { statusCode: 400, success: false, message: "Waiting for admin approval.", data: null });
  }

  user.isOnline = true;
  await user.save();

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "You're now online",
    data: { id: user._id, isOnline: user.isOnline },
  });
});

export const setDriverOffline = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user.userId;
  const user = await UserModel.findById(driverId);

  if (!user) {
    return sendResponse(res, { statusCode: 404, success: false, message: "Driver not found", data: null });
  }
  if (user.role !== "driver") {
    return sendResponse(res, { statusCode: 403, success: false, message: "Only drivers can go offline", data: null });
  }

  user.isOnline = false;
  await user.save();

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "You're now offline",
    data: { id: user._id, isOnline: user.isOnline },
  });
});
