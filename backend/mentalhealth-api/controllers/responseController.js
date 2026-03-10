import { appendResponseRow } from '../services/googleSheetsService.js';
import { apiResponce } from '../utils/ApiResponseHandler.js';
import logger from '../utils/logger.js';

/**
 * Accepts a single question response and appends it to Google Sheets.
 * Returns 202 immediately; the sheet write happens after the response is sent.
 */
export const saveQuestionResponse = async (req, res) => {
  const response = new apiResponce(202, { received: true }, 'Response received');
  res.status(response.statusCode).json(response);

  try {
    const data = req.body;
    const rowData = {
      sessionId: data.sessionId,
      timestamp: new Date().toISOString(),
      userAgeSlab: data.userAgeSlab,
      userGender: data.userGender,
      section: data.section,
      questionType: data.questionType,
      questionId: data.questionId,
      questionTextEn: data.questionTextEn,
      criteria: data.criteria,
      userAnswer: data.userAnswer,
      selectedOptionText: data.selectedOptionText,
      timeTakenSec: data.timeTakenSec,
      language: data.language,
      questionWeight: data.questionWeight,
    };

    const success = await appendResponseRow(rowData);
    if (success) {
      logger.info(`Sheet row appended: session=${data.sessionId} q=${data.questionId}`);
    } else {
      logger.warn(`Sheet row NOT appended (service disabled or error): session=${data.sessionId}`);
    }
  } catch (err) {
    logger.error(`Unexpected error in saveQuestionResponse post-send: ${err.message}`);
  }
};
