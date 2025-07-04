import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { apiResponce } from '../utils/ApiResponseHandler.js';

dotenv.config();

export const sendResultsEmail = async (req, res) => {
    const { email, message, results } = req.body;
    if (!email || !results) {
        const response = new apiResponce(400, null, 'Missing email or results');
        return res.status(response.statusCode).json(response);
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // from .env
            pass: process.env.EMAIL_PASS  // from .env
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Mental Health Assessment Results',
        text: `${message}\n\nResults: ${JSON.stringify(results, null, 2)}`
    };

    try {
        await transporter.sendMail(mailOptions);
        const response = new apiResponce(200, { success: true }, 'Email sent successfully');
        res.json(response);
    } catch (err) {
        const response = new apiResponce(500, null, 'Failed to send email');
        res.status(response.statusCode).json(response);
    }
};