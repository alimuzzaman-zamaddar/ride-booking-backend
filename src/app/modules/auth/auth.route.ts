import { Router } from "express";
import { register, login } from "./auth.controller";


const router = Router();

// Route for registering a user
router.post("/register", register);

// Route for logging in a user
router.post("/login", login);



export default router;
