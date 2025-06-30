import calculateScore, { getSectionRecommendations } from "../utils/scoring.js";
import mentalAgeQuestionnaire from "../data/question.js";
import { apiResponce } from "../utils/ApiResponseHandler.js";

/**
 * Predict mental health based on user answers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const predictMentalHealth = async (req, res) => {
  try {
    const { userAnswers, userId, userName } = req.body;
    
    // Validate input
    if (!userAnswers || !Array.isArray(userAnswers)) {
      const response = new apiResponce(400, null, "Invalid user answers format");
      return res.status(response.statusCode).json(response);
    }

    if (userAnswers.length === 0) {
      const response = new apiResponce(400, null, "No answers provided");
      return res.status(response.statusCode).json(response);
    }

    // Calculate the mental health score
    const scoringResult = calculateScore(userAnswers, mentalAgeQuestionnaire);
    // Get detailed section recommendations
    const sectionRecommendationsRaw = getSectionRecommendations(scoringResult.sectionBreakdown);

    // Map internal section names to display names
    const sectionNameMap = {
      CognitiveFunction: "Cognitive Function",
      EmotionalFlexibility: "Emotional Well-being",
      CommunityInvolvement: "Social Connections",
      PhysicalHealth: "Physical Health",
      SpiritualAnchoring: "Spiritual Growth",
      ThematicAppreciation: "Thematic Appreciation"
    };

    // Convert sectionBreakdown array to object keyed by display name
    const sectionBreakdownObj = {};
    (scoringResult.sectionBreakdown || []).forEach(section => {
      const displayName = sectionNameMap[section.sectionName] || section.sectionName;
      sectionBreakdownObj[displayName] = {
        score: section.rawScore,
        maxScore: section.maxRawScore,
        percentage: section.percentage
      };
    });

    const sectionRecommendationsObj = {};
    Object.entries(sectionRecommendationsRaw).forEach(([internalName, recs]) => {
      const displayName = sectionNameMap[internalName] || internalName;
      let priority = "low";
      // Set priority based on rec count or percentage (customize as needed)
      const section = (scoringResult.sectionBreakdown || []).find(s => s.sectionName === internalName);
      if (section && section.percentage < 55) priority = "high";
      else if (section && section.percentage < 70) priority = "medium";
      // Always provide a recommendations array, fallback to a default if empty
      sectionRecommendationsObj[displayName] = {
        priority,
        recommendations: (Array.isArray(recs) && recs.length > 0)
          ? recs
          : [
              `Focus on improving this area for better overall well-being.`
            ]
      };
    });

    // response data
    const responseData = {
      userId: userId || null,
      userName: userName || null,
      assessment: {
        ...scoringResult,
        sectionBreakdown: sectionBreakdownObj,
        sectionRecommendations: sectionRecommendationsObj
      },
      message: generatePersonalizedMessage(scoringResult.percentage, scoringResult.mentalAgeCategory)
    };

    console.log(`Mental Health Assessment completed - Score: ${scoringResult.percentage}%, Category: ${scoringResult.mentalAgeCategory}`);
    
    const response = new apiResponce(200, responseData, "Mental health assessment completed successfully");
    return res.status(response.statusCode).json(response);
    
  } catch (error) {
    console.error("Error in mental health prediction:", error);
    const response = new apiResponce(500, null, "Internal server error during assessment");
    return res.status(response.statusCode).json(response);
  }
};

/**
 * Generate personalized message based on score
 * @param {number} percentage - Final percentage score
 * @param {string} category - Mental age category
 * @returns {string} Personalized message
 */
function generatePersonalizedMessage(percentage, category) {
  if (percentage >= 85) {
    return "Excellent! You demonstrate remarkable mental resilience and wisdom. Your spiritual grounding, community connections, and emotional flexibility are inspiring. Continue to share your wisdom with others.";
  } else if (percentage >= 70) {
    return "Very good! You show strong mental well-being across most areas. Focus on the specific areas highlighted in your section breakdown to achieve even greater balance and fulfillment.";
  } else if (percentage >= 55) {
    return "You're on a positive path! There are several areas where small improvements can make a significant difference in your overall well-being. Consider the personalized recommendations provided.";
  } else {
    return "Thank you for taking this assessment. The results suggest focusing on fundamental aspects of mental well-being. Consider professional guidance alongside the recommendations provided.";
  }
}

/**
 * Get assessment history for a user (placeholder for future implementation)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAssessmentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // TODO: Implement database retrieval of user's assessment history
    // For now, return a placeholder response
    
    const response = new apiResponce(200, [], "Assessment history retrieved (placeholder - implement database integration)");
    return res.status(response.statusCode).json(response);
    
  } catch (error) {
    console.error("Error retrieving assessment history:", error);
    const response = new apiResponce(500, null, "Internal server error");
    return res.status(response.statusCode).json(response);
  }
};

/**
 * Validate user answers format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const validateAnswers = (req, res) => {
  try {
    const { userAnswers } = req.body;
    
    if (!userAnswers || !Array.isArray(userAnswers)) {
      const response = new apiResponce(400, { valid: false }, "Invalid answers format");
      return res.status(response.statusCode).json(response);
    }

    const validationResults = [];
    let isValid = true;

    userAnswers.forEach((answer, index) => {
      const validation = {
        index,
        valid: true,
        errors: []
      };

      // Check required fields
      if (!answer.section) {
        validation.valid = false;
        validation.errors.push("Missing section");
      }

      if (!answer.type || !['Subjective', 'Objective'].includes(answer.type)) {
        validation.valid = false;
        validation.errors.push("Invalid or missing type");
      }

      if (answer.type === 'Subjective') {
        if (!answer.questionId) {
          validation.valid = false;
          validation.errors.push("Missing questionId for subjective question");
        }
        if (!answer.answer || !answer.answer.trim()) {
          validation.valid = false;
          validation.errors.push("Missing answer text");
        }
      }

      if (answer.type === 'Objective') {
        if (answer.questionIndex === undefined) {
          validation.valid = false;
          validation.errors.push("Missing questionIndex for objective question");
        }
        if (!answer.selectedOption) {
          validation.valid = false;
          validation.errors.push("Missing selectedOption");
        }
      }

      if (!validation.valid) {
        isValid = false;
      }

      validationResults.push(validation);
    });

    const responseData = {
      valid: isValid,
      totalAnswers: userAnswers.length,
      validAnswers: validationResults.filter(v => v.valid).length,
      validationDetails: validationResults.filter(v => !v.valid)
    };

    const response = new apiResponce(200, responseData, isValid ? "All answers are valid" : "Some answers have validation errors");
    return res.status(response.statusCode).json(response);
    
  } catch (error) {
    console.error("Error validating answers:", error);
    const response = new apiResponce(500, null, "Internal server error during validation");
    return res.status(response.statusCode).json(response);
  }
};

/**
 * Get all questions from the questionnaire
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllQuestions = (req, res) => {
  try {
    const response = new apiResponce(200, mentalAgeQuestionnaire, "Fetched all mental age questions");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error fetching questions:", error);
    const response = new apiResponce(500, null, "Internal server error while fetching questions");
    return res.status(response.statusCode).json(response);
  }
};

/**
 * Get questions for a specific section
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSectionQuestions = (req, res) => {
  try {
    const { sectionName } = req.params;
    
    if (!mentalAgeQuestionnaire[sectionName]) {
      const response = new apiResponce(404, null, `Section '${sectionName}' not found`);
      return res.status(response.statusCode).json(response);
    }

    const sectionData = mentalAgeQuestionnaire[sectionName];
    const response = new apiResponce(200, sectionData, `Fetched questions for section: ${sectionName}`);
    return res.status(response.statusCode).json(response);
    
  } catch (error) {
    console.error("Error fetching section questions:", error);
    const response = new apiResponce(500, null, "Internal server error while fetching section questions");
    return res.status(response.statusCode).json(response);
  }
};

/**
 * Get questionnaire metadata (sections, weights, question counts)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getQuestionnaireMetadata = (req, res) => {
  try {
    const metadata = {
      totalSections: Object.keys(mentalAgeQuestionnaire).length,
      sections: {},
      totalQuestions: 0
    };

    Object.keys(mentalAgeQuestionnaire).forEach(sectionName => {
      const section = mentalAgeQuestionnaire[sectionName];
      const subjectiveCount = section.Subjective?.length || 0;
      const objectiveCount = section.Objective?.length || 0;
      const totalCount = subjectiveCount + objectiveCount;

      metadata.sections[sectionName] = {
        weight: section.weight,
        subjectiveQuestions: subjectiveCount,
        objectiveQuestions: objectiveCount,
        totalQuestions: totalCount
      };

      metadata.totalQuestions += totalCount;
    });

    const response = new apiResponce(200, metadata, "Fetched questionnaire metadata");
    return res.status(response.statusCode).json(response);
    
  } catch (error) {
    console.error("Error fetching questionnaire metadata:", error);
    const response = new apiResponce(500, null, "Internal server error while fetching metadata");
    return res.status(response.statusCode).json(response);
  }
};