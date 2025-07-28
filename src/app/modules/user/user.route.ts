import { Router } from "express";
import {checkAuth} from "../../middlewares/checkAuth"; // Correct import

const router = Router();

// Example route using checkAuth middleware
router.get("/some-protected-route", checkAuth("admin"), (req, res) => {
  res.status(200).json({ message: "This is a protected route for admins." });
});

export default router;
