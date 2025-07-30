"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerValidationError = void 0;
const handlerValidationError = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    return {
        statusCode: 400,
        message: errors.join(". "),
    };
};
exports.handlerValidationError = handlerValidationError;
