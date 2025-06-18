import express from "express";
const router =express.Router();
import asyncHandler from '../../../utils/AsyncHandler.js';
import { sendOtp, verifyOtp, resetPassword } from '../controller/forgetPasswordController.js';
router.post('/send-otp',asyncHandler(sendOtp));
router.post('verify-otp',asyncHandler(verifyOtp));
router.post('/reset-password',asyncHandler(resetPassword));
export default router;