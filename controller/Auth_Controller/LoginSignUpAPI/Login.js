import User from "../../../model/Auth/Auth.model.js";
import bcrypt from "bcryptjs";
import twilio from "twilio";
import dotenv from "dotenv";



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
       
    req.user = {
  id: CheckUserExist._id
};

 console.log(req.user.id);



  res.status(201).json({success: true, message: "Login Successfull",userData:CheckUserExist});

  }catch(error)
  {
    
    res.status(500).json({ success: false, error: error.message || "Internal Server Error" });

     
  }



}








// const loginwithNumber = async (req, res) => {
//   try {
//     const { phone } = req.body;
//     if (!phone) return res.status(400).json({ message: "Phone number is required" });

//     console.log("ENV CHECK:", {
//       SID: process.env.TWILIO_ACCOUNT_SID,
//       TOKEN: process.env.TWILIO_AUTH_TOKEN,
//       VERIFY: process.env.VERIFY_SERVICE_SID,
//     });

//     const verification = await client.verify.v2
//       .services(process.env.VERIFY_SERVICE_SID)
//       .verifications.create({
//         to: phone,
//         channel: "sms",
//       });

//     res.json({ success: true, message: "OTP sent successfully!", sid: verification.sid });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ success: false, message: "Failed to send OTP" });
//   }
// };



//    const verifyotp=async (req,res)=>{

//         try {
//     const { phone, otp } = req.body;
//     if (!phone || !otp)
//       return res.status(400).json({ message: "Phone and OTP are required" });

//     const verificationCheck = await client.verify.v2
//       .services(process.env.VERIFY_SERVICE_SID)
//       .verificationChecks.create({
//         to: phone,
//         code: otp,
//       });

//     if (verificationCheck.status === "approved") {
//       return res.status(200).json({ success: true, message: "OTP verified successfully!" });
//     } else {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     res.status(500).json({ success: false, message: "Failed to verify OTP" });
//   }



//    }


const loginwithNumber = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res.status(400).json({ message: "Phone number is required" });

    // ✅ Check if user exists in DB
    const isUser = await User.findOne({MobNo:phone });
    if (!isUser) {
      return res.status(404).json({
        success: false,
        message: "User not registered. Please sign up first.",
      });
    }

    // ✅ Debug (optional)
    console.log("ENV CHECK:", {
      SID: process.env.TWILIO_ACCOUNT_SID,
      TOKEN: process.env.TWILIO_AUTH_TOKEN,
      VERIFY: process.env.VERIFY_SERVICE_SID,
    });

    // ✅ Send OTP via Twilio
    const verification = await client.verify.v2
      .services(process.env.VERIFY_SERVICE_SID)
      .verifications.create({
        to: `+91${phone}`,
        channel: "sms",
      });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
      sid: verification.sid,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// 🔹 Verify OTP
const verifyotp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ message: "Phone and OTP are required" });

    // ✅ Verify OTP via Twilio
    const verificationCheck = await client.verify.v2
      .services(process.env.VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      });

    if (verificationCheck.status === "approved") {
      // ✅ Check user again before login
      const user = await User.findOne({MobNo:phone });
      if (!user)
        return res.status(404).json({ message: "User not found in database" });

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully!",
        user,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP. Please try again." });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};









export { Login,loginwithNumber,verifyotp}

