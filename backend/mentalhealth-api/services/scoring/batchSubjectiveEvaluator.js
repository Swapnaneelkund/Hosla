import { evaluateSubjectiveAnswer } from './subjectiveEvaluator.js';

// Batch subjective evaluation utility
function localFallback(answerObj, criteria, weight){
  return evaluateSubjectiveAnswer(answerObj, criteria, weight);
}

/**
 * Batch evaluate subjective answers using a single LLM call when possible.
 * Falls back to per-question evaluation if API key missing or request fails.
 * @param {Array<{id:string, question:string, answer:string, criteria:string[], weight:number}>} items
 * @returns {Promise<Array>} results in same order
 */
export async function batchEvaluateSubjectiveAnswers(items){
  if(!Array.isArray(items) || items.length===0) return [];
  const API_KEY = process.env.OPENROUTER_API_KEY;
  if(!API_KEY || items.length===1){
    return Promise.all(items.map(it=>localFallback({ question: it.question, answer: it.answer }, it.criteria, it.weight)));
  }
  const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1-0528:free';
  const compact = items.map(i=>({ question:i.question, criteria:i.criteria, answer:i.answer, weight:i.weight }));
  const payload = { model, messages:[{ role:'user', content:`Evaluate these subjective answers. Return JSON array only. Schema element: {score,maxScore,matchedCriteria,missingCriteria,explanation}. Input:${JSON.stringify(compact)}` }], response_format:{ type:'json_object'} };
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions',{ method:'POST', headers:{ Authorization:`Bearer ${API_KEY}`, 'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    if(!res.ok) throw new Error('Bad status '+res.status);
    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed : parsed.results;
    if(!Array.isArray(arr) || arr.length !== items.length) throw new Error('Length mismatch');
    return arr.map((r,idx)=>({
      score: Number(r.score)||0,
      maxScore: Number(r.maxScore)||items[idx].weight,
      matchedCriteria: r.matchedCriteria||[],
      missingCriteria: r.missingCriteria||[],
      explanation: r.explanation || 'LLM batch evaluation.'
    }));
  } catch(e){
    return Promise.all(items.map(it=>localFallback({ question: it.question, answer: it.answer }, it.criteria, it.weight)));
  }
}
