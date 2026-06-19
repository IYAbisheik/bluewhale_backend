import express from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js"
import roomRoutes from "../modules/room/routes/room.routes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/rooms", roomRoutes)

export default router;
