import express from "express"
import asyncHandler from "../../../utils/AsyncHandler.js";
import signupController from "../controller/signupController.js";
const router=express.Router();
router.post("/",asyncHandler(signupController));
export default router;