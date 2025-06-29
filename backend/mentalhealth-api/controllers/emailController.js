import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendResultsEmail = async (req, res) => {
    const { email, message, results } = req.body;
    if (!email || !results) {
        return res.status(400).json({ error: 'Missing email or results' });
    }

    // Configure your transporter using environment variables
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
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send email' });
    }
};
