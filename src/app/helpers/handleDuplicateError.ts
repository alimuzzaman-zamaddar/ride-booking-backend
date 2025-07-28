import { TGenericErrorResponse } from "../interfaces/error.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: `Duplicate value entered for field ${err.keyValue}, please use another value.`,
  };
};
