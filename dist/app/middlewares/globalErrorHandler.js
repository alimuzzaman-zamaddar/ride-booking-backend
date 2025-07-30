"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const handleCastError_1 = require("../helpers/handleCastError");
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handlerValidationError_1 = require("../helpers/handlerValidationError");
const globalErrorHandler = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    let error = Object.assign({}, err);
    if (err.name === "CastError")
        error = (0, handleCastError_1.handleCastError)(err);
    if (err.code === 11000)
        error = (0, handleDuplicateError_1.handleDuplicateError)(err);
    if (err.name === "ValidationError")
        error = (0, handlerValidationError_1.handlerValidationError)(err);
    res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message || "Something went wrong!",
    });
};
exports.globalErrorHandler = globalErrorHandler;
