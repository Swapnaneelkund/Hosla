import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/questionModel.js";
import mentalAgeQuestionnaire from "./data/question.js";
import logger from "./utils/logger.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.mongodbURI);
    logger.info("MongoDB connected for seeding.");

    // Clear existing questions to prevent duplicates on re-run
    await Question.deleteMany({});
    logger.info("Existing questions cleared.");

    const questionsToInsert = Object.entries(mentalAgeQuestionnaire).map(
      ([sectionName, data]) => ({
        sectionName,
        data,
      })
    );

    await Question.insertMany(questionsToInsert);
    logger.info("Questionnaire data seeded successfully!");
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`, { stack: error.stack });
  } finally {
    mongoose.connection.close();
    logger.info("MongoDB connection closed.");
  }
};

seedDatabase();
