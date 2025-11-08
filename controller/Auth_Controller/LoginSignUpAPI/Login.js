import User from "../../../model/Auth/Auth.model.js";
import bcrypt from "bcryptjs";
import twilio from "twilio";
import dotenv from "dotenv";
import OTP from "../../../model/otpModel.js";


dotenv.config();


 const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const Login=async (req,res)=>{

  try{

      
     const {email, password}=req.body

     if(!email || !password)
     {
        return res.status(400).json({message:"required All field"});
     }

     const CheckUserExist=await User.findOne({email});
     
     if(!CheckUserExist)
     {
        return res.status(400).json({message:"User Not Found"});
     }
  
   const isMatchPassword=await bcrypt.compare(password,CheckUserExist.password);

   
   if(!isMatchPassword) return res.status(401).json({ message: "Invalid credentials" });
       

  res.status(201).json({success: true, message: "Login Successfull",userData:CheckUserExist});

  }catch(error)
  {
    
    res.status(500).json({success: true,Error: error || "Internal Server Error During the Login" });
     
  }



}


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
    const { email, otp, newPassword } = req.body;

    // 1️⃣ Validate input
    if (!email || !otp || !newPassword) {
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
    const hashedPass = await bcrypt.hash(newPassword, 10);

    // 6️⃣ Update user password
    isUser.password = hashedPass;
    await isUser.save();

    // 7️⃣ Delete OTP record after success
    await OTP.deleteOne({ phone: isUser.MobNo });

    res.json({
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





const loginwithNumber = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    console.log("ENV CHECK:", {
      SID: process.env.TWILIO_ACCOUNT_SID,
      TOKEN: process.env.TWILIO_AUTH_TOKEN,
      VERIFY: process.env.VERIFY_SERVICE_SID,
    });

    const verification = await client.verify.v2
      .services(process.env.VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    res.json({ success: true, message: "OTP sent successfully!", sid: verification.sid });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};



   const verifyotp=async (req,res)=>{

        try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: "Phone and OTP are required" });

    const verificationCheck = await client.verify.v2
      .services(process.env.VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    if (verificationCheck.status === "approved") {
      return res.json({ success: true, message: "OTP verified successfully!" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }



   }











export { Login,loginwithNumber,verifyotp,ForgotPasswordOtpSend,ForgotPasswordOtpVerify}

