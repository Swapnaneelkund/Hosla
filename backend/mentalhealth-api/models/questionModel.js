import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    bn: { type: String, required: true },
  },
  score: { type: Number, required: true },
});

const subjectiveQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  question: {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    bn: { type: String, required: true },
  },
  weight: { type: Number, required: true },
  criteria: [{ type: String }],
});

const objectiveQuestionSchema = new mongoose.Schema({
  question: {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    bn: { type: String, required: true },
  },
  weight: { type: Number, required: true },
  options: { type: Map, of: optionSchema },
});

const sectionSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  Subjective: [subjectiveQuestionSchema],
  Objective: [objectiveQuestionSchema],
});

const questionSchema = new mongoose.Schema({
  sectionName: { type: String, required: true, unique: true },
  data: sectionSchema,
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
