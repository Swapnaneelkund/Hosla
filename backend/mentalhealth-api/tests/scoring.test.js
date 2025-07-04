import calculateScore, { getSectionRecommendations } from "../utils/scoring.js";
import mentalAgeQuestionnaire from "../data/question.js";

describe('calculateScore', () => {
  test('should correctly calculate overall score and mental age category', () => {
    const userAnswers = [
      // Depression - Objective (Q1: Not at all, Q2: Not at all)
      { section: 'Depression', type: 'Objective', questionIndex: 0, selectedOption: 'A' },
      { section: 'Depression', type: 'Objective', questionIndex: 1, selectedOption: 'A' },
      // Anxiety - Objective (Q1: Several days, Q2: Several days)
      { section: 'Anxiety', type: 'Objective', questionIndex: 0, selectedOption: 'B' },
      { section: 'Anxiety', type: 'Objective', questionIndex: 1, selectedOption: 'B' },
      // Cognitive - Subjective (Q1: good, Q2: no difficulties)
      { section: 'Cognitive', type: 'Subjective', questionId: 'Q1', answer: 'My memory is good and I can concentrate well.' },
      { section: 'Cognitive', type: 'Subjective', questionId: 'Q2', answer: 'I have no difficulties with daily tasks or decision-making.' },
      // Social - Objective (Q1: Never, Q2: Very often)
      { section: 'Social', type: 'Objective', questionIndex: 0, selectedOption: 'A' },
      { section: 'Social', type: 'Objective', questionIndex: 1, selectedOption: 'A' },
      // PhysicalWellbeing - Objective (Q1: Never, Q2: High energy)
      { section: 'PhysicalWellbeing', type: 'Objective', questionIndex: 0, selectedOption: 'A' },
      { section: 'PhysicalWellbeing', type: 'Objective', questionIndex: 1, selectedOption: 'A' },
      // PurposeAndMeaning - Objective (Q1: Always, Q2: Very satisfied)
      { section: 'PurposeAndMeaning', type: 'Objective', questionIndex: 0, selectedOption: 'A' },
      { section: 'PurposeAndMeaning', type: 'Objective', questionIndex: 1, selectedOption: 'A' },
    ];

    const result = calculateScore(userAnswers, mentalAgeQuestionnaire);

    expect(result).toBeDefined();
    expect(result.percentage).toBeGreaterThanOrEqual(0);
    expect(result.percentage).toBeLessThanOrEqual(100);
    expect(result.mentalAgeCategory).toBeDefined();
    expect(result.sectionBreakdown).toBeInstanceOf(Array);
    expect(result.recommendations).toBeInstanceOf(Array);
  });

  test('should return 0% for empty answers', () => {
    const userAnswers = [];
    const result = calculateScore(userAnswers, mentalAgeQuestionnaire);
    expect(result.percentage).toBe(0);
    expect(result.mentalAgeCategory).toBe('Needs Attention');
  });

  test('should handle partial answers gracefully', () => {
    const userAnswers = [
      { section: 'Depression', type: 'Objective', questionIndex: 0, selectedOption: 'D' },
    ];
    const result = calculateScore(userAnswers, mentalAgeQuestionnaire);
    expect(result.percentage).toBeGreaterThanOrEqual(0);
  });

  test('should correctly calculate scores for subjective answers', () => {
    const userAnswers = [
      { section: 'Cognitive', type: 'Subjective', questionId: 'Q1', answer: 'My memory is excellent and I can concentrate very well. I feel very sharp.' },
    ];
    const result = calculateScore(userAnswers, mentalAgeQuestionnaire);
    const cognitiveSection = result.sectionBreakdown.find(s => s.sectionName === 'Cognitive');
    expect(cognitiveSection.rawScore).toBeGreaterThan(0);
  });

  test('should correctly calculate scores for objective answers', () => {
    const userAnswers = [
      { section: 'Depression', type: 'Objective', questionIndex: 0, selectedOption: 'A' },
    ];
    const result = calculateScore(userAnswers, mentalAgeQuestionnaire);
    const depressionSection = result.sectionBreakdown.find(s => s.sectionName === 'Depression');
    expect(depressionSection.rawScore).toBe(0);
  });
});

describe('getSectionRecommendations', () => {
  test('should return recommendations for all sections', () => {
    const sectionScores = [
      { sectionName: 'Depression', percentage: 40 },
      { sectionName: 'Anxiety', percentage: 60 },
      { sectionName: 'Cognitive', percentage: 80 },
      { sectionName: 'Social', percentage: 30 },
      { sectionName: 'PhysicalWellbeing', percentage: 75 },
      { sectionName: 'PurposeAndMeaning', percentage: 90 },
    ];
    const recommendations = getSectionRecommendations(sectionScores);
    expect(Object.keys(recommendations).length).toBe(6);
    expect(recommendations.Depression).toBeInstanceOf(Array);
    expect(recommendations.Anxiety).toBeInstanceOf(Array);
  });

  test('should return empty array for unknown section', () => {
    const sectionScores = [
      { sectionName: 'UnknownSection', percentage: 50 },
    ];
    const recommendations = getSectionRecommendations(sectionScores);
    expect(recommendations.UnknownSection).toBeInstanceOf(Array);
    expect(recommendations.UnknownSection.length).toBe(0);
  });
});
