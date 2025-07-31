import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import passport from "passport";
import { envVars } from "./app/config/env";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { checkUserBlocked } from "./app/middlewares/checkAuth";
import { router } from "./app/routes";
// Import dotenv and load environment variables
import dotenv from "dotenv";
dotenv.config(); // This loads environment variables from .env file

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// Global middleware to check if user is blocked
app.use("/api/v1", checkUserBlocked);

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Ride Booking System Backend",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
