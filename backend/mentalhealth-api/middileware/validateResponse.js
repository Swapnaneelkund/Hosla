import { z } from 'zod';

const ResponsePayload = z.object({
  sessionId: z.string().uuid(),
  section: z.string().min(1),
  questionType: z.enum(['Subjective', 'Objective']),
  questionId: z.string().min(1),
  questionTextEn: z.string().min(1),
  criteria: z.string().optional().default(''),
  userAnswer: z.string().min(1),
  selectedOptionText: z.string().optional().default(''),
  timeTakenSec: z.number().int().nonnegative(),
  language: z.enum(['en', 'hi', 'bn']),
  questionWeight: z.number().nonnegative(),
  userAgeSlab: z.string().optional().default(''),
  userGender: z.string().optional().default(''),
});

export function validateResponse(req, res, next) {
  const parsed = ResponsePayload.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.issues.map(i => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
  }
  req.body = parsed.data;
  next();
}
