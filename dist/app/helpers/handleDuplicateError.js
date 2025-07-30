"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err) => {
    return {
        statusCode: 400,
        message: `Duplicate value entered for field ${err.keyValue}, please use another value.`,
    };
};
exports.handleDuplicateError = handleDuplicateError;
