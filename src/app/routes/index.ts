import { Router } from "express"
import AuthRoutes from "../modules/auth/auth.route"
import  RideRoutes  from "../modules/ride/ride.route"


export const router = Router()

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/ride", route: RideRoutes },
  { path: "/driver", route: RideRoutes },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

