import { PutObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, s3 } from "./s3.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Upload image to S3
 * @param {Object} file - multer file object
 * @returns {String} file URL
 */
export const uploadImage = async (file) => {
  try {
    // 🛑 Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    console.log("LINE23", file);
    
    // 📌 Create unique file name
    const fileName = `uploads/${Date.now()}-${file.originalname}`;

    // 📦 S3 params
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // 🚀 Upload to S3 (:contentReference[oaicite:0]{index=0})
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // 🔗 Generate file URL
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return fileUrl;

  } catch (error) {
    console.error("S3 Upload Error:", error.message);
    throw error;
  }
};