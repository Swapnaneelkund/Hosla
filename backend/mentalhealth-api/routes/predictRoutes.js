import express from "express"
const router = express.Router();
import { predictMentalHealth, getAllQuestions } from '../controllers/predictController.js';

router.get('/questions', getAllQuestions);

router.post('/', predictMentalHealth);
export default router;
