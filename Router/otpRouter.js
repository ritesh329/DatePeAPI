import {Login,loginwithNumber,verifyotp} from '../controller/Auth_Controller/LoginSignUpAPI/Login.js'
import express from "express";

import { verifyApi } from "../middlewares/authApi.js";
const router = express.Router();

router.post("/register-send-otp", loginwithNumber);
router.post("/register-verify-otp", verifyotp);
router.post('/login',Login);


export default router;