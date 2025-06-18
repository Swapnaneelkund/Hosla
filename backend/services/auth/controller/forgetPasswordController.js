import UserMentalHealth from '../../../models/userMentalHealthModel.js';
import UserOTP from '../../../models/userOtpModel.js';
import { apiResponce } from '../../../utils/ApiResponseHandler.js';
import { ApiError } from '../../../utils/ApiError.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json(apiResponce(400, null, "Email is required"));
    }

    try {
        const user = await UserMentalHealth.findOne({ email });
        if (!user) {
            return res.status(400).json(apiResponce(400, null, "Email does not exist"));
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        await UserOTP.deleteMany({ email });

        // Save new OTP (expires after 10 mins via TTL index)
        await UserOTP.create({ email, otp });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Password Reset',
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json(apiResponce(200, null, "OTP sent successfully"));
    } catch (error) {
        console.error("Error in sendOtp:", error);
        throw new ApiError(500, "Internal server error while sending OTP");
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json(apiResponce(400, null, "Email and OTP are required"));
    }

    try {
        const existingOtp = await UserOTP.findOne({ email, otp });
        if (!existingOtp) {
            return res.status(400).json(apiResponce(400, null, "Invalid or expired OTP"));
        }

        await UserOTP.deleteOne({ _id: existingOtp._id });

        return res.status(200).json(apiResponce(200, null, "OTP verified successfully"));
    } catch (error) {
        console.error("Error in verifyOtp:", error);
        throw new ApiError(500, "Internal server error while verifying OTP");
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json(apiResponce(400, null, "Email and new password are required"));
    }

    try {
        const user = await UserMentalHealth.findOne({ email });
        if (!user) {
            return res.status(400).json(apiResponce(400, null, "Email does not exist"));
        }

        user.password = newPassword; 
        await user.save();

        return res.status(200).json(apiResponce(200, null, "Password reset successfully"));
    } catch (error) {
        console.error("Error in resetPassword:", error);
        throw new ApiError(500, "Internal server error while resetting password");
    }
};

export { sendOtp, verifyOtp, resetPassword };
