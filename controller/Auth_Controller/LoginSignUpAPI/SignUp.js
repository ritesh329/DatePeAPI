import User from "../../../model/Auth/Auth.model.js";
import bcrypt from "bcryptjs";
import { uploadOnCloudinary, deleteFromCloudinary } from "../../../utils/cloudinary.js";

const SignUp = async (req, res) => {
  let uploadedProfile = null;
  let galleryImages = [];

  try {
    const {
      firstName,
      lastName,
      dob,
      gender,
      interests,
      MobNo,
      email,
      password,
    } = req.body;

    // ✅ Validate all required fields
    if (
      !MobNo ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !dob ||
      !gender ||
      !interests
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Get uploaded profile image
    const profileFile = req.files?.profileImage?.[0];
    if (!profileFile) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    // ✅ Upload to Cloudinary
    uploadedProfile = await uploadOnCloudinary(profileFile.buffer);
    if (!uploadedProfile || !uploadedProfile.url) {
      return res.status(400).json({ message: "Profile image upload failed" });
    }

    // ✅ Upload gallery images (optional)
    if (req.files?.gallery?.length > 0) {
      const uploadPromises = req.files.gallery.map((file) =>
        uploadOnCloudinary(file.buffer)
      );
      galleryImages = await Promise.all(uploadPromises);
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user in DB
    const newUser = await User.create({
      MobNo,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      dob,
      gender,
      interests: Array.isArray(interests) ? interests : [interests],
      profileImage: {
        url: uploadedProfile.url,
        public_id: uploadedProfile.public_id,
      },
      gallery: galleryImages.map((img) => ({
        url: img.url,
        public_id: img.public_id,
      })),
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    // ❌ Delete uploaded image if something fails
    if (uploadedProfile?.public_id) {
      await deleteFromCloudinary(uploadedProfile.public_id);
    }

    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error during registration",
    });
  }
};

export default SignUp;
