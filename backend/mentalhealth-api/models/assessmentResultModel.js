import mongoose from 'mongoose';

const subjectiveQuestionDetailSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['Subjective'] },
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  matchedCriteria: [{ type: String }],
  missingCriteria: [{ type: String }],
  explanation: { type: String },
});

const objectiveQuestionDetailSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['Objective'] },
  questionIndex: { type: Number, required: true },
  question: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  selectedScore: { type: Number },
  maxOptionScore: { type: Number },
  details: { type: String },
});

const sectionBreakdownSchema = new mongoose.Schema({
  sectionName: { type: String, required: true },
  rawScore: { type: Number, required: true },
  maxRawScore: { type: Number, required: true },
  sectionWeight: { type: Number, required: true },
  weightedScore: { type: Number, required: true },
  maxWeightedScore: { type: Number, required: true },
  percentage: { type: Number, required: true },
  questionDetails: [
    {
      type: mongoose.Schema.Types.Mixed, // Can be either subjective or objective
      required: true,
    },
  ],
});

const assessmentResultSchema = new mongoose.Schema({
  userId: { type: String, required: false }, // Optional, if user is not logged in
  userName: { type: String, required: false }, // Optional
  finalScore: { type: Number, required: true },
  maxPossibleScore: { type: Number, required: true },
  percentage: { type: Number, required: true },
  mentalAgeCategory: { type: String, required: true },
  recommendations: [{ type: String }],
  sectionBreakdown: [sectionBreakdownSchema],
  timestamp: { type: Date, default: Date.now },
  totalQuestions: { type: Number, required: true },
  completionRate: { type: Number, required: true },
});

const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);

export default AssessmentResult;
