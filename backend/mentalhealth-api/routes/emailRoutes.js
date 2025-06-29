import express from 'express';
const router = express.Router();
import { sendResultsEmail } from '../controllers/emailController.js';

router.post('/send-results', sendResultsEmail);

export default router;
