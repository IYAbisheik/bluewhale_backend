import { uploadImage } from "../../../helpers/aws.helper.js";

/**
 * @desc Upload image controller
 * @route POST /api/upload
 * @access Public / Private (based on your auth)
 */
export const uploadImageController = async (req, res) => {
  try {
    // 📌 Step 1: Get file from request
    const file = req.file;

    // 🛑 Step 2: Validate file
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // 🚀 Step 3: Call service/util function
    const imageUrl = await uploadImage(file);

    // ✅ Step 4: Send response
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: imageUrl,
      },
    });

  } catch (error) {
    console.error("Upload Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};