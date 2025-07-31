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
      data: null,
    });
  }
  if (user.role !== "driver") {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "User is not a driver",
      data: null,
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

export const suspendDriver = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isSuspended } = req.body;
  const user = await UserModel.findById(id);
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Driver not found",
      data: null,
    });
  }
  if (user.role !== "driver") {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "User is not a driver",
      data: null,
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
