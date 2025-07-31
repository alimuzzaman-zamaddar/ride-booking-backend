import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.route";
import RideRoutes from "../modules/ride/ride.route";

export const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/ride", route: RideRoutes },
  { path: "/driver", route: RideRoutes },
  { path: "/admin", route: AuthRoutes },
  { path: "/users", route: AuthRoutes },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});
