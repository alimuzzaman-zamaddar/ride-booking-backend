import { Request, Response } from "express";
import UserModel from "../auth/auth.model";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserModel.find();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users fetched successfully",
    data: users,
  });
});

export const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isBlocked } = req.body;
  const user = await UserModel.findById(id);
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }
  if (user.role === "admin") {
    return sendResponse(res, {
      statusCode: 403,
      success: false,
      message: "Cannot block admin users",
      data: null,
    });
  }
  user.isBlocked = isBlocked;
  await user.save();
  sendResponse(res, {
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
});
export const UnblockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isBlocked } = req.body;
  const user = await UserModel.findById(id);
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }
  if (user.role === "admin") {
    return sendResponse(res, {
      statusCode: 403,
      success: false,
      message: "Cannot block admin users",
      data: null,
    });
  }
  user.isBlocked = isBlocked;
  await user.save();
  sendResponse(res, {
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
});
