import { z } from 'zod';

const ObjectiveAnswer = z.object({
  section: z.string().min(1),
  type: z.literal('Objective'),
  questionIndex: z.number().int().nonnegative(),
  selectedOption: z.string().min(1)
});

const SubjectiveAnswer = z.object({
  section: z.string().min(1),
  type: z.literal('Subjective'),
  questionId: z.string().min(1),
  answer: z.string().min(3)
});

const AssessmentPayload = z.object({
  userAnswers: z.array(z.union([ObjectiveAnswer, SubjectiveAnswer])).min(1),
  userId: z.string().optional(),
  userName: z.string().optional()
});

export function validateAssessment(req, res, next) {
  const parsed = AssessmentPayload.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }))
    });
  }
  // Attach sanitized data
  req.body = parsed.data;
  next();
}
