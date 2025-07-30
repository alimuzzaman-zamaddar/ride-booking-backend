"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const ride_route_1 = __importDefault(require("../modules/ride/ride.route"));
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    { path: "/auth", route: auth_route_1.default },
    { path: "/ride", route: ride_route_1.default },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
