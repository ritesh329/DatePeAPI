import SignUp from "../controller/Auth_Controller/LoginSignUpAPI/SignUp.js";
import express from "express";
import { verifyApi } from "../middlewares/authApi.js";
const router = express.Router();

router.post("/register", verifyApi,SignUp);

export default router;
