import express from "express"
const router = express.Router();
import { predictMentalHealth, getAllQuestions } from '../controllers/predictController.js';
import { validateAssessment } from '../middileware/validateAssessment.js';

router.get('/questions', getAllQuestions);

router.post('/', validateAssessment, predictMentalHealth);
export default router;
