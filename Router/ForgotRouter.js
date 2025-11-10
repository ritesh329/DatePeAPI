import { ForgotPasswordOtpSend,ForgotPasswordOtpVerify,ForgetEnterNewPass} from "../controller/Auth_Controller/Forgotpassword.js";
import express from "express";


import { verifyApi } from "../middlewares/authApi.js";
const router = express.Router();
router.post('/forgot-password',ForgotPasswordOtpSend);
router.post('/otp-verify',ForgotPasswordOtpVerify);
router.post('/new-password',ForgetEnterNewPass);

export default router;