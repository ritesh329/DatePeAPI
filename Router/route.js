import express from "express";
import getData from "../controller/getDataController.js";
const router = express.Router();


router.get('/getData',getData);

export default router;

