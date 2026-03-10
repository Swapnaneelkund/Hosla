import express from "express"
const router = express.Router();
import { predictMentalHealth, getAllQuestions } from '../controllers/predictController.js';
import { validateAssessment } from '../middileware/validateAssessment.js';
import { saveQuestionResponse } from '../controllers/responseController.js';
import { validateResponse } from '../middileware/validateResponse.js';

router.get('/questions', getAllQuestions);

router.post('/', validateAssessment, predictMentalHealth);
router.post('/response', validateResponse, saveQuestionResponse);
export default router;
