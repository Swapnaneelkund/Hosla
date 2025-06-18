import express from "express"
import asyncHandler from "../utils/AsyncHandler.js";
const router=express.Router();
router.post("/",asyncHandler(signupController));