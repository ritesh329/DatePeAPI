import {Login,loginwithNumber,verifyotp} from '../controller/Auth_Controller/LoginSignUpAPI/Login.js'
import express from "express";

import { verifyApi } from "../middlewares/authApi.js";
const router = express.Router();

// router.post("/send-otp", loginwithNumber);
// router.post("/verify-otp", verifyotp);
router.post('/login',Login);
router.post('/sendOtp_with_No',loginwithNumber)
router.post('/verify-otp',verifyotp);



export default router;