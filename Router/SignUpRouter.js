import SignUp from "../controller/Auth_Controller/LoginSignUpAPI/SignUp.js";
import express from "express";
import {upload}  from "../middlewares/multer.js";
import { verifyApi } from "../middlewares/authApi.js";
const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  SignUp
);

export default router;
