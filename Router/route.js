import express from "express";
import getData from "../controller/getDataController.js";
import { likeUser                                                                                                                                                                                                                                                                                                                                                                                                               } from "../controller/LikeUsers.js";
const router = express.Router();


router.get('/getData',getData);
router.post('/like',likeUser);
router.post('/Accept-like',likeUser);
export default router;
                                                                                                                                                                                                                                                                                                                                               
