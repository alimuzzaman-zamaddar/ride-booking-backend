import { NextFunction, Request, Response } from "express";
import { handleCastError } from "../helpers/handleCastError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handlerValidationError } from "../helpers/handlerValidationError";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let error = { ...err };
  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateError(err);
  if (err.name === "ValidationError") error = handlerValidationError(err);

  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message || "Something went wrong!",
  });
};
