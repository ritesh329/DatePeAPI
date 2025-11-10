import { v2 as cloudinary } from "cloudinary";

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload function (Direct Cloud Upload)
export const uploadOnCloudinary = async (fileBuffer, folderName = "DateApiProfileImage") => {
  try {
    if (!fileBuffer) return null;

    // Convert file buffer to base64
    const base64String = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;

    // Upload directly to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folderName, // Automatically creates folder if not exists
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);
    throw error;
  }
};

// ✅ Delete function
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary delete error:", error.message);
    throw error;
  }
};
