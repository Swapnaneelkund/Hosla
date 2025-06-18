import express from "express"
const router = express.Router();
import { predictMentalHealth } from '../controllers/predictController.js';

router.post('/', predictMentalHealth);
export default router;
