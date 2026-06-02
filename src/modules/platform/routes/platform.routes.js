import express from "express";
import { uploadImageController } from "../controller/platform.controller.js";
import { upload } from "../../../middlewares/multer.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadImageController);

export default router;