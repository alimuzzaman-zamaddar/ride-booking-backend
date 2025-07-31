import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.route";
import RideRoutes from "../modules/ride/ride.route";
import UserRoutes from "../modules/user/user.route";
import DriverRoutes from "../modules/driver/driver.route";

export const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/ride", route: RideRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/drivers", route: DriverRoutes },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});
