import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  selected: String,
  timeTaken: Number
});

const mentalHealthSchema = new mongoose.Schema({
  username: { type: String, required: true },
  answers: {
    type: Map,
    of: [answerSchema]
  },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const MentalHealth = mongoose.model("MentalHealth", mentalHealthSchema);
export default MentalHealth;
