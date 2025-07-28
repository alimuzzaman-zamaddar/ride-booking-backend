/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handlerValidationError = (err: any): TGenericErrorResponse => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  return {
    statusCode: 400,
    message: errors.join(". "),
  };
};
