import  mentalAgeQuestionnaire  from "../data/question.js";
import {apiResponce} from "../../../utils/ApiResponseHandler.js"
export const getAllQuestions = (req, res) => {
  const response = new apiResponce(200, mentalAgeQuestionnaire, "Fetched all mental age questions");
  return res.status(response.statusCode).json(response);
};