export const createSessionId = () => crypto.randomUUID();

export const createUserInfo = () => ({
  createdAt: new Date().toISOString(),
  data: {},
  responses: []
});

// extracting all questions
export function extractAllQuestions(data) {
  const all = [];

  for (const section in data) {
    ["Subjective", "Objective"].forEach((type) => {

      const questions = data[section]?.[type];

      if (Array.isArray(questions)) {
        questions.forEach((q, idx) => {

          const newQ = {
            ...q,
            section,
            type: type.toLowerCase(),
          };

          if (type.toLowerCase() === "subjective") {
            newQ.questionId = q.id || `Q${idx + 1}`;
          }

          if (type.toLowerCase() === "objective") {
            newQ.options = Object.entries(q.options || {}).map(
              ([key, val]) => ({
                key,
                text: val.text,
                score: val.score,
              })
            );

            newQ.questionIndex = idx;
          }

          all.push(newQ);
        });
      }

    });
  }

  return all;
}