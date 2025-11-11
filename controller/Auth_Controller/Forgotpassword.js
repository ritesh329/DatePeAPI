import User from "../../model/Auth/Auth.model.js";
import bcrypt from "bcryptjs";
import OTP from "../../model/otpModel.js";
import twilio from "twilio";

 const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const ForgotPasswordOtpSend = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Check email provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 2️⃣ Check user exists
    const isCheckEmail = await User.findOne({ email });
    if (!isCheckEmail) {
      return res
        .status(400)
        .json({ message: "Registration is required. User not registered." });
    }

    // 3️⃣ Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4️⃣ Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP for password reset is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${isCheckEmail.MobNo}`, // assuming MobNo is like +91XXXXXXXXXX
    });

    // 5️⃣ Save OTP in DB (with expiry 5 min)
    await OTP.findOneAndUpdate(
      { phone: isCheckEmail.MobNo },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // 6️⃣ Success response
    res.json({
      success: true,
      message: "OTP sent successfully to your registered mobile number.",
    });
  } catch (err) {
    console.error("Error while sending OTP:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

 const ForgotPasswordOtpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1️⃣ Validate input
    if (!email || !otp ) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    // 2️⃣ Find user
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(400).json({ message: "User not registered" });
    }

    // 3️⃣ Find OTP record
    const otpRecord = await OTP.findOne({ phone: isUser.MobNo });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not sent. Please request again." });
    }

    // 4️⃣ Check OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 5️⃣ Hash new password
    // const hashedPass = await bcrypt.hash(newPassword, 10);

    // // 6️⃣ Update user password
    // isUser.password = hashedPass;
    // await isUser.save();

    // 7️⃣ Delete OTP record after success
    await OTP.deleteOne({ phone: isUser.MobNo });

    res.status(200).json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
      error: error.message,
    });
  }
};


 const ForgetEnterNewPass = async (req, res) => {
  try {
    const { email, newPass } = req.body;

    if (!email || !newPass) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Hash the new password
    const hashedPass = await bcrypt.hash(newPass, 10);

    // ✅ Update directly (bypass schema validation)
    await User.updateOne({ email }, { $set: { password: hashedPass } });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("ForgetEnterNewPass Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





export {ForgotPasswordOtpSend,ForgotPasswordOtpVerify, ForgetEnterNewPass }