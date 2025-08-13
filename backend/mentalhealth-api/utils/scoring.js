// ---------------------------------------------------------------------------
// Compatibility Shim (Deprecated)
// ---------------------------------------------------------------------------
// This file previously contained the full scoring implementation. Logic has
// been modularized under services/scoring/. To avoid breaking existing imports
// we re-export the new functions here. Please update any remaining imports to
// use the service modules directly and then remove this file.

import { calculateScore, getSectionRecommendations, calculateSectionScore, calculateSubjectiveObjectiveBreakdown } from '../services/scoring/aggregator.js';
import { evaluateSubjectiveAnswer } from '../services/scoring/subjectiveEvaluator.js';
import { evaluateObjectiveAnswer } from '../services/scoring/objectiveEvaluator.js';

export { calculateScore, getSectionRecommendations, calculateSectionScore, calculateSubjectiveObjectiveBreakdown, evaluateSubjectiveAnswer, evaluateObjectiveAnswer };
export default calculateScore;

// NOTE: All legacy implementation removed. See git history if needed.