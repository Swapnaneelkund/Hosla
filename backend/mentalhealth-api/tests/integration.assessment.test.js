import request from 'supertest';
import { app } from '../app.js';
import questionnaire from '../data/question.js';
import { disconnectDb } from '../config/Database-Connection.js';
import logger from '../utils/logger.js';

process.env.OPENROUTER_API_KEY = '';
process.env.SKIP_DB = 'true';
// Silence logger info during tests
const origInfo = logger.info; logger.info = ()=>{};
afterAll(async ()=>{ logger.info = origInfo; await disconnectDb(); });

describe('POST /api/mentalhealth', () => {
  test('returns 400 for missing answers', async () => {
    const res = await request(app).post('/api/mentalhealth').send({ userAnswers: [] });
    expect(res.status).toBe(400);
  });

  test('computes score for minimal valid payload', async () => {
    const subj = questionnaire.Depression.Subjective[0];
    const userAnswers = [
      { section: 'Depression', type: 'Subjective', questionId: subj.id, answer: 'I feel good energy and reflect daily.' },
      { section: 'Depression', type: 'Objective', questionIndex: 0, selectedOption: 'A' }
    ];
    const res = await request(app).post('/api/mentalhealth').send({ userAnswers, userId: 'u1', userName: 'Test' });
    expect(res.status).toBe(200);
    expect(res.body?.data?.assessment?.percentage).toBeGreaterThanOrEqual(0);
    expect(res.body?.data?.assessment?.sectionBreakdown).toBeDefined();
  });
});
