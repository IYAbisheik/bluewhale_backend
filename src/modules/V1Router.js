import express from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js"
import roomRoutes from "../modules/room/routes/room.routes.js"
import userRoutes from "../modules/Users/routes/user.routes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/rooms", roomRoutes);
router.use("/user", userRoutes)

export default router;
