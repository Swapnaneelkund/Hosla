/**
 * Mental Health Assessment Scoring System
 * Calculates scores for subjective and objective questions with weighted sections
 */



/**
 * subjective answer evaluation with improved NLP
 * @param {Object} answerObj - Object containing user's answer and question text
 * @param {Array} criteria - Array of criteria keywords/phrases
 * @param {number} weight - Question weight
 * @returns {Object} Scoring details
 */
async function evaluateSubjectiveAnswer(answerObj, criteria, weight) {
  const { question, answer } = answerObj;

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // .env
  const OPENROUTER_MODEL = "deepseek/deepseek-r1-0528:free"; // Or another chosen model
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";

  // Handle no answer provided at the beginning
  if (!answer || !answer.trim()) {
    return {
      score: 0,
      maxScore: weight,
      matchedCriteria: [],
      missingCriteria: criteria,
      explanation: "No answer provided",
    };
  }

  const prompt = `
You are an AI assistant specialized in evaluating subjective answers for a mental health prediction application. Your task is to assess a user's response to a question against a list of criteria, considering tone, emotional depth, and contextual relevance, and provide a score out of a specified weight. The output must be in a structured JSON format.

Input format:
{
  "question": "string",
  "criteria": ["string", ...],
  "answer": "string",
  "weight": number
}

Instructions:
1. Understand the question's intent and evaluate how well the answer aligns with each criterion. Criteria may be expressed indirectly (e.g., "calm" for "peace").
2. Assess tone (e.g., positive, reflective) and emotional depth (e.g., detailed vs. vague). Assign a quality bonus (0–0.2) based on expressiveness, sincerity, and detail.
3. Score calculation:
   - Base score (0–1) based on proportion of matched criteria (e.g., 3/4 = 0.75).
   - Add quality bonus, then scale by weight.
   - Cap score at weight, round to two decimal places.
4. List matched and missing criteria.
5. Provide a concise explanation addressing criteria, tone, and depth.

Output format:
{
  "score": number,
  "maxScore": number,
  "matchedCriteria": ["string", ...],
  "missingCriteria": ["string", ...],
  "explanation": "string"
}

Input:
{
  "question": "${question}",
  "criteria": ${JSON.stringify(criteria)},
  "answer": "${answer}",
  "weight": ${weight}
}

Output the evaluation in JSON format.
  `;

  console.log("OpenRouter API Prompt:", prompt);
  const requestBody = JSON.stringify({
    model: OPENROUTER_MODEL,
    messages: [
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" } // Request JSON output
  });
  console.log("OpenRouter API Request Body:", requestBody);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost", // app’s URL
        "X-Title": "Mental Health App",
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API Error Response: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const llmEvaluation = JSON.parse(data.choices[0].message.content);

    // Map LLM output to expected format, including missingCriteria
    return {
      score: llmEvaluation.score,
      maxScore: llmEvaluation.maxScore,
      matchedCriteria: llmEvaluation.matchedCriteria || [],
      missingCriteria: llmEvaluation.missingCriteria || [],
      explanation: llmEvaluation.explanation || "LLM evaluation completed."
    };

  } catch (error) {
    console.error("Error calling OpenRouter API, falling back to keyword matching:", error);

    const normalizedAnswer = answer.toLowerCase().trim();
    const matchedCriteria = [];
    let criteriaScore = 0;
    const missingCriteria = [...criteria]; // Initialize missing criteria

    // keyword matching with synonyms and context
    const synonymMap = {
      'peace': ['tranquility', 'calm', 'serenity', 'harmony', 'stillness'],
      'gratitude': ['thankful', 'appreciation', 'blessed', 'grateful'],
      'wisdom': ['knowledge', 'understanding', 'insight', 'experience'],
      'growth': ['development', 'progress', 'evolution', 'improvement'],
      'love': ['affection', 'care', 'compassion', 'kindness'],
      'strength': ['power', 'resilience', 'fortitude', 'courage'],
      'reflection': ['contemplation', 'meditation', 'thinking', 'pondering'],
      'cognitive': ['intellectual', 'mental', 'thinking', 'mind'],
      'memory': ['recall', 'remembrance', 'recollection'],
      'attention': ['focus', 'concentration', 'mindfulness'],
      'awareness': ['understanding', 'insight', 'consciousness'],
      'assessment': ['evaluation', 'check', 'review']
    };

    criteria.forEach(criterion => {
      const normalizedCriterion = criterion.toLowerCase();
      let found = false;

      // Split criterion into words for more flexible matching
      const criterionWords = normalizedCriterion.split(' ');

      // Check if any word from the criterion (or its synonyms) is present in the answer
      found = criterionWords.some(word => {
        if (normalizedAnswer.includes(word)) {
          return true;
        }
        const synonyms = synonymMap[word] || [];
        return synonyms.some(synonym => normalizedAnswer.includes(synonym));
      });

      if (found) {
        matchedCriteria.push(criterion);
        const index = missingCriteria.indexOf(criterion);
        if (index > -1) {
          missingCriteria.splice(index, 1); // Remove from missing
        }
      }
    });

    // Calculate base criteria score
    if (matchedCriteria.length === criteria.length) {
      criteriaScore = 1.0; // Full score for all criteria
    } else if (matchedCriteria.length > 0) {
      // More generous partial scoring with minimum threshold
      const matchRatio = matchedCriteria.length / criteria.length;
      criteriaScore = Math.max(0.3, matchRatio * 0.9); // Minimum 30%, max 90% for partial
    }

    // Quality assessment bonus (up to 10% additional)
    let qualityBonus = 0;
    const wordCount = normalizedAnswer.split(/\s+/).length;

    if (wordCount >= 20) qualityBonus += 0.05; // Detailed response
    if (normalizedAnswer.includes('because') || normalizedAnswer.includes('since')) qualityBonus += 0.03; // Reasoning
    if (matchedCriteria.length > 0 && wordCount >= 30) qualityBonus += 0.02; // Comprehensive response

    const finalScore = Math.min(weight, (criteriaScore + qualityBonus) * weight);

    return {
      score: Math.round(finalScore * 100) / 100,
      maxScore: weight,
      matchedCriteria,
      missingCriteria, // Include missing criteria in fallback
      explanation: `Matched ${matchedCriteria.length}/${criteria.length} criteria (Fallback)`
    };
  }
}

/**
 * Calculate score for objective questions
 * @param {string} selectedOption - Selected option key (A, B, C, D)
 * @param {Object} question - Question object with options
 * @returns {Object} Scoring details
 */
function evaluateObjectiveAnswer(selectedOption, question) {
  if (!selectedOption || !question.options[selectedOption]) {
    return {
      score: 0,
      maxScore: question.weight,
      selectedScore: 0,
      details: "No valid option selected",
    };
  }

  const optionScore = question.options[selectedOption].score;
  const questionScore = question.weight * optionScore;
  const maxOptionScore = Math.max(...Object.values(question.options).map(opt => opt.score));
  const maxScore = question.weight * maxOptionScore;
  return {
    score: questionScore,
    maxScore,
    selectedScore: optionScore,
    maxOptionScore,
    details: `Selected option ${selectedOption} (${optionScore}/${maxOptionScore})`,
  };
}

/**
 * Calculate section score
 * @param {Array} userAnswers - User answers for this section
 * @param {Object} sectionData - Section data from questionnaire
 * @param {string} sectionName - Name of the section
 * @returns {Object} Section scoring details
 */
async function calculateSectionScore(userAnswers, sectionData, sectionName) {
  const sectionAnswers = userAnswers.filter(answer => answer.section === sectionName);
  const sectionWeight = parseFloat(sectionData.weight.replace('%', '')) / 100;
  let totalScore = 0;
  let maxPossibleScore = 0;
  const questionDetails = [];

  await Promise.all(sectionData.Subjective?.map(async (question, index) => {
    const userAnswer = sectionAnswers.find(ans => ans.type === 'Subjective' && ans.questionId === question.id);
    const evaluation = await evaluateSubjectiveAnswer(
      {
        question: question.question.en,
        answer: userAnswer?.answer || ''
      },
      question.criteria || [],
      question.weight
    );
    totalScore += evaluation.score;
    maxPossibleScore += evaluation.maxScore;
    questionDetails.push({
      type: 'Subjective',
      questionId: question.id,
      question: question.question.en,
      ...evaluation,
    });
  }));

  sectionData.Objective?.forEach((question, index) => {
    const userAnswer = sectionAnswers.find(ans => ans.type === 'Objective' && ans.questionIndex === index);
    const evaluation = evaluateObjectiveAnswer(userAnswer?.selectedOption, question);
    totalScore += evaluation.score;
    maxPossibleScore += evaluation.maxScore;
    questionDetails.push({
      type: 'Objective',
      questionIndex: index,
      question: question.question.en,
      ...evaluation,
    });
  });

  const weightedScore = totalScore * sectionWeight;
  const maxWeightedScore = maxPossibleScore * sectionWeight;
  return {
    sectionName,
    rawScore: Math.round(totalScore * 100) / 100,
    maxRawScore: maxPossibleScore,
    sectionWeight,
    weightedScore: Math.round(weightedScore * 100) / 100,
    maxWeightedScore: Math.round(maxWeightedScore * 100) / 100,
    percentage: maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0,
    questionDetails,
  };
}

export function calculateSubjectiveObjectiveBreakdown(sectionScores) {
    let totalSubjectiveScore = 0;
    let maxSubjectiveScore = 0;
    let totalObjectiveScore = 0;
    let maxObjectiveScore = 0;
    
    sectionScores.forEach(section => {
        if (section.questionDetails) {
            section.questionDetails.forEach(question => {
                if (question.type === 'Subjective') {
                    totalSubjectiveScore += question.score || 0;
                    maxSubjectiveScore += question.maxScore || 0;
                } else if (question.type === 'Objective') {
                    totalObjectiveScore += question.score || 0;
                    maxObjectiveScore += question.maxScore || 0;
                }
            });
        }
    });
    
    const subjectivePercentage = maxSubjectiveScore > 0 ? Math.round((totalSubjectiveScore / maxSubjectiveScore) * 100) : 0;
    const objectivePercentage = maxObjectiveScore > 0 ? Math.round((totalObjectiveScore / maxObjectiveScore) * 100) : 0;
    
    return {
        subjective: {
            score: Math.round(totalSubjectiveScore * 100) / 100,
            maxScore: Math.round(maxSubjectiveScore * 100) / 100,
            percentage: subjectivePercentage,
            questionCount: sectionScores.reduce((count, section) => 
                count + (section.questionDetails?.filter(q => q.type === 'Subjective').length || 0), 0)
        },
        objective: {
            score: Math.round(totalObjectiveScore * 100) / 100,
            maxScore: Math.round(maxObjectiveScore * 100) / 100,
            percentage: objectivePercentage,
            questionCount: sectionScores.reduce((count, section) => 
                count + (section.questionDetails?.filter(q => q.type === 'Objective').length || 0), 0)
        }
    };
}

/**
 * Main scoring function
 * @param {Array} userAnswers - Array of user answers
 * @param {Object} questionnaireData - Complete questionnaire data
 * @returns {Object} Complete scoring breakdown
 */
export async function calculateScore(userAnswers, questionnaireData) {
  const sectionScores = [];
  let totalWeightedScore = 0;
  let maxTotalWeightedScore = 0;

  const sectionPromises = Object.keys(questionnaireData).map(async (sectionName) => {
    const sectionData = questionnaireData[sectionName];
    return await calculateSectionScore(userAnswers, sectionData, sectionName);
  });

  const resolvedSectionScores = await Promise.all(sectionPromises);
  resolvedSectionScores.forEach(sectionScore => {
    sectionScores.push(sectionScore);
    totalWeightedScore += sectionScore.weightedScore;
    maxTotalWeightedScore += sectionScore.maxWeightedScore;
  });

  const finalPercentage = maxTotalWeightedScore > 0 ? Math.round((totalWeightedScore / maxTotalWeightedScore) * 100) : 0;
  
  // Calculate subjective/objective breakdown
  const questionTypeBreakdown = calculateSubjectiveObjectiveBreakdown(sectionScores);

  let mentalAgeCategory = '';
  let recommendations = [];
  
  if (finalPercentage >= 85) {
    mentalAgeCategory = 'Excellent Mental Resilience';
    recommendations = [
      'Continue your excellent practices',
      'Consider mentoring others',
      'Maintain your spiritual and community connections',
    ];
  } else if (finalPercentage >= 70) {
    mentalAgeCategory = 'Good Mental Well-being';
    recommendations = [
      'Focus on areas with lower scores',
      'Increase community involvement',
      'Practice more reflection and mindfulness',
    ];
  } else if (finalPercentage >= 55) {
    mentalAgeCategory = 'Moderate Mental Health';
    recommendations = [
      'Work on emotional flexibility',
      'Engage more with community',
      'Develop spiritual practices',
      'Consider cognitive exercises',
    ];
  } else {
    mentalAgeCategory = 'Needs Attention';
    recommendations = [
      'Consider professional counseling',
      'Start with small spiritual practices',
      'Build social connections gradually',
      'Focus on basic cognitive health',
    ];
  }

  return {
    finalScore: Math.round(totalWeightedScore * 100) / 100,
    maxPossibleScore: Math.round(maxTotalWeightedScore * 100) / 100,
    percentage: finalPercentage,
    mentalAgeCategory,
    recommendations,
    sectionBreakdown: sectionScores,
    questionTypeBreakdown, // Add this new field
    timestamp: new Date().toISOString(),
    totalQuestions: userAnswers.length,
    completionRate: calculateCompletionRate(userAnswers, questionnaireData),
  };
}

function calculateCompletionRate(userAnswers, questionnaireData) {
  let totalQuestions = 0;
  let answeredQuestions = 0;
  Object.values(questionnaireData).forEach(section => {
    totalQuestions += (section.Subjective?.length || 0) + (section.Objective?.length || 0);
  });
  userAnswers.forEach(answer => {
    if ((answer.type === 'Subjective' && answer.answer?.trim()) || (answer.type === 'Objective' && answer.selectedOption)) {
      answeredQuestions++;
    }
  });
  return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
}

export function getSectionRecommendations(sectionScores) {
  const recommendations = {};
  sectionScores.forEach(section => {
    const percentage = section.percentage;
    let sectionRecs = [];
    switch (section.sectionName) {
      case 'Depression':
        sectionRecs = [
          'Practice daily gratitude journaling',
          'Engage in regular physical activity',
          'Reach out to friends or family for support',
          'Consider mindfulness or meditation exercises',
        ];
        break;
      case 'Anxiety':
        sectionRecs = [
          'Try deep breathing or relaxation techniques',
          'Limit caffeine and sugar intake',
          'Establish a regular sleep routine',
          'Talk to a counselor or therapist if needed',
        ];
        break;
      case 'Cognitive':
        sectionRecs = [
          'Engage in daily brain exercises like puzzles or reading',
          'Learn a new skill or hobby to stimulate neuroplasticity',
          'Practice memory games',
          'Stay socially active',
        ];
        break;
      case 'Social':
        sectionRecs = [
          'Join community groups or clubs aligned with your interests',
          'Schedule regular video calls with family members',
          'Volunteer for local causes',
          'Attend social events',
        ];
        break;
      case 'PhysicalWellbeing':
        sectionRecs = [
          'Incorporate regular physical activity into your routine',
          'Focus on balanced nutrition',
          'Prioritize sleep and rest',
          'Schedule regular health checkups',
        ];
        break;
      case 'PurposeAndMeaning':
        sectionRecs = [
          'Reflect on your personal values and goals',
          'Engage in activities that give you a sense of purpose',
          'Volunteer or mentor others',
          'Explore new hobbies or interests',
        ];
        break;
      default:
        sectionRecs = [];
    }
    recommendations[section.sectionName] = sectionRecs;
  });
  return recommendations;
}

export default calculateScore;