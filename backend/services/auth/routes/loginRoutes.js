import express from "express"
import asyncHandler from "../../../utils/AsyncHandler.js";
import loginController from "../controller/loginController.js";
const router=express.Router();
router.post("/",asyncHandler(loginController));
export default router;
