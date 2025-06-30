/**
 * Mental Health Assessment Scoring System
 * Calculates scores for subjective and objective questions with weighted sections
 */

/**
 * subjective answer evaluation with improved NLP
 * @param {string} answer - User's text response
 * @param {Array} criteria - Array of criteria keywords/phrases
 * @param {number} weight - Question weight
 * @returns {Object} Scoring details
 */
function evaluateSubjectiveAnswer(answer, criteria, weight) {
  if (!answer || !answer.trim()) {
    return {
      score: 0,
      maxScore: weight,
      matchedCriteria: [],
      qualityBonus: 0,
      details: "No answer provided"
    };
  }

  const normalizedAnswer = answer.toLowerCase().trim();
  const matchedCriteria = [];
  let criteriaScore = 0;

  // keyword matching with synonyms and context
  const synonymMap = {
    'peace': ['tranquility', 'calm', 'serenity', 'harmony', 'stillness'],
    'gratitude': ['thankful', 'appreciation', 'blessed', 'grateful'],
    'wisdom': ['knowledge', 'understanding', 'insight', 'experience'],
    'growth': ['development', 'progress', 'evolution', 'improvement'],
    'love': ['affection', 'care', 'compassion', 'kindness'],
    'strength': ['power', 'resilience', 'fortitude', 'courage'],
    'reflection': ['contemplation', 'meditation', 'thinking', 'pondering']
  };

  // Check each criterion
  criteria.forEach(criterion => {
    const normalizedCriterion = criterion.toLowerCase();
    let found = false;

    // Direct match
    if (normalizedAnswer.includes(normalizedCriterion)) {
      found = true;
    } else {
      // Check synonyms
      const synonyms = synonymMap[normalizedCriterion] || [];
      found = synonyms.some(synonym => normalizedAnswer.includes(synonym));
    }

    if (found) {
      matchedCriteria.push(criterion);
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
    criteriaMatchRatio: matchedCriteria.length / criteria.length,
    qualityBonus: Math.round(qualityBonus * weight * 100) / 100,
    wordCount,
    details: `Matched ${matchedCriteria.length}/${criteria.length} criteria`
  };
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
      details: "No valid option selected"
    };
  }

  const optionScore = question.options[selectedOption].score;
  const questionScore = question.weight * optionScore;
  
  // Find maximum possible score for this question
  const maxOptionScore = Math.max(...Object.values(question.options).map(opt => opt.score));
  const maxScore = question.weight * maxOptionScore;

  return {
    score: questionScore,
    maxScore,
    selectedScore: optionScore,
    maxOptionScore,
    details: `Selected option ${selectedOption} (${optionScore}/${maxOptionScore})`
  };
}

/**
 * Calculate section score
 * @param {Array} userAnswers - User answers for this section
 * @param {Object} sectionData - Section data from questionnaire
 * @param {string} sectionName - Name of the section
 * @returns {Object} Section scoring details
 */
function calculateSectionScore(userAnswers, sectionData, sectionName) {
  const sectionAnswers = userAnswers.filter(answer => answer.section === sectionName);
  const sectionWeight = parseFloat(sectionData.weight.replace('%', '')) / 100;
  
  let totalScore = 0;
  let maxPossibleScore = 0;
  const questionDetails = [];

  // Process subjective questions
  sectionData.Subjective?.forEach((question, index) => {
    const userAnswer = sectionAnswers.find(
      ans => ans.type === 'Subjective' && ans.questionId === question.id
    );
    
    const evaluation = evaluateSubjectiveAnswer(
      userAnswer?.answer || '',
      question.criteria || [],
      question.weight
    );
    
    totalScore += evaluation.score;
    maxPossibleScore += evaluation.maxScore;
    
    questionDetails.push({
      type: 'Subjective',
      questionId: question.id,
      question: question.question.en,
      ...evaluation
    });
  });

  // Process objective questions
  sectionData.Objective?.forEach((question, index) => {
    const userAnswer = sectionAnswers.find(
      ans => ans.type === 'Objective' && ans.questionIndex === index
    );
    
    const evaluation = evaluateObjectiveAnswer(
      userAnswer?.selectedOption,
      question
    );
    
    totalScore += evaluation.score;
    maxPossibleScore += evaluation.maxScore;
    
    questionDetails.push({
      type: 'Objective',
      questionIndex: index,
      question: question.question.en,
      ...evaluation
    });
  });

  const weightedScore = totalScore * sectionWeight;
  const maxWeightedScore = maxPossibleScore * sectionWeight;

  return {
    sectionName,
    rawScore: Math.round(totalScore * 100) / 100,
    maxRawScore: maxPossibleScore,
    sectionWeight: sectionWeight,
    weightedScore: Math.round(weightedScore * 100) / 100,
    maxWeightedScore: Math.round(maxWeightedScore * 100) / 100,
    percentage: maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0,
    questionDetails
  };
}

/**
 * Main scoring function
 * @param {Array} userAnswers - Array of user answers
 * @param {Object} questionnaireData - Complete questionnaire data
 * @returns {Object} Complete scoring breakdown
 */
export function calculateScore(userAnswers, questionnaireData) {
  const sectionScores = [];
  let totalWeightedScore = 0;
  let maxTotalWeightedScore = 0;

  // Calculate scores for each section
  Object.keys(questionnaireData).forEach(sectionName => {
    const sectionData = questionnaireData[sectionName];
    const sectionScore = calculateSectionScore(userAnswers, sectionData, sectionName);
    
    sectionScores.push(sectionScore);
    totalWeightedScore += sectionScore.weightedScore;
    maxTotalWeightedScore += sectionScore.maxWeightedScore;
  });

  // Calculate final percentage
  const finalPercentage = maxTotalWeightedScore > 0 
    ? Math.round((totalWeightedScore / maxTotalWeightedScore) * 100)
    : 0;

  // Mental age interpretation (basic)
  let mentalAgeCategory = '';
  let recommendations = [];

  if (finalPercentage >= 85) {
    mentalAgeCategory = 'Excellent Mental Resilience';
    recommendations = [
      'Continue your excellent practices',
      'Consider mentoring others',
      'Maintain your spiritual and community connections'
    ];
  } else if (finalPercentage >= 70) {
    mentalAgeCategory = 'Good Mental Well-being';
    recommendations = [
      'Focus on areas with lower scores',
      'Increase community involvement',
      'Practice more reflection and mindfulness'
    ];
  } else if (finalPercentage >= 55) {
    mentalAgeCategory = 'Moderate Mental Health';
    recommendations = [
      'Work on emotional flexibility',
      'Engage more with community',
      'Develop spiritual practices',
      'Consider cognitive exercises'
    ];
  } else {
    mentalAgeCategory = 'Needs Attention';
    recommendations = [
      'Consider professional counseling',
      'Start with small spiritual practices',
      'Build social connections gradually',
      'Focus on basic cognitive health'
    ];
  }

  return {
    finalScore: Math.round(totalWeightedScore * 100) / 100,
    maxPossibleScore: Math.round(maxTotalWeightedScore * 100) / 100,
    percentage: finalPercentage,
    mentalAgeCategory,
    recommendations,
    sectionBreakdown: sectionScores,
    timestamp: new Date().toISOString(),
    totalQuestions: userAnswers.length,
    completionRate: calculateCompletionRate(userAnswers, questionnaireData)
  };
}

/**
 * Calculate completion rate
 * @param {Array} userAnswers - User answers
 * @param {Object} questionnaireData - Questionnaire data
 * @returns {number} Completion percentage
 */
function calculateCompletionRate(userAnswers, questionnaireData) {
  let totalQuestions = 0;
  let answeredQuestions = 0;

  Object.values(questionnaireData).forEach(section => {
    totalQuestions += (section.Subjective?.length || 0) + (section.Objective?.length || 0);
  });

  userAnswers.forEach(answer => {
    if ((answer.type === 'Subjective' && answer.answer?.trim()) ||
        (answer.type === 'Objective' && answer.selectedOption)) {
      answeredQuestions++;
    }
  });

  return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
}

/**
 * Helper function to get section-wise recommendations
 * @param {Array} sectionScores - Section scores array
 * @returns {Object} Section-wise recommendations
 */
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
          'Consider mindfulness or meditation exercises'
        ];
        break;
      case 'Anxiety':
        sectionRecs = [
          'Try deep breathing or relaxation techniques',
          'Limit caffeine and sugar intake',
          'Establish a regular sleep routine',
          'Talk to a counselor or therapist if needed'
        ];
        break;
      case 'Cognitive':
        sectionRecs = [
          'Engage in daily brain exercises like puzzles or reading',
          'Learn a new skill or hobby to stimulate neuroplasticity',
          'Practice memory games',
          'Stay socially active'
        ];
        break;
      case 'Social':
        sectionRecs = [
          'Join community groups or clubs aligned with your interests',
          'Schedule regular video calls with family members',
          'Volunteer for local causes',
          'Attend social events'
        ];
        break;
      case 'PhysicalWellbeing':
        sectionRecs = [
          'Incorporate regular physical activity into your routine',
          'Focus on balanced nutrition',
          'Prioritize sleep and rest',
          'Schedule regular health checkups'
        ];
        break;
      case 'PurposeAndMeaning':
        sectionRecs = [
          'Reflect on your personal values and goals',
          'Engage in activities that give you a sense of purpose',
          'Volunteer or mentor others',
          'Explore new hobbies or interests'
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