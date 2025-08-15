// Using global fetch (Node 18+). If older Node version is required, install node-fetch.

// Simple in-memory cache for LLM subjective evaluations
const LLM_CACHE = new Map(); // key -> result

function hashStr(str){
	let h=5381; for(let i=0;i<str.length;i++){ h=((h<<5)+h) ^ str.charCodeAt(i); } return (h>>>0).toString(16);
}

function buildCacheKey(model, question, criteria, answer, weight){
	const payload = JSON.stringify({q:question, c:criteria, a:answer, w:weight});
	return `${model}|${hashStr(payload)}`;
}

export function getCachedSubjectiveLLM(question, criteria, answer, weight, model){
	const key = buildCacheKey(model, question, criteria, answer, weight);
	return LLM_CACHE.get(key) || null;
}

export function setCachedSubjectiveLLM(question, criteria, answer, weight, model, value){
	const key = buildCacheKey(model, question, criteria, answer, weight);
	LLM_CACHE.set(key, value);
}

// Fallback keyword evaluation reused across modules
function fallbackSubjectiveEvaluation(answerObj, criteria, weight) {
	const { answer = '' } = answerObj;
	const normalizedAnswer = (answer || '').toLowerCase().trim();
	const matchedCriteria = [];
	let criteriaScore = 0;
	const missingCriteria = [...criteria];
	const synonymMap = { peace:['tranquility','calm','serenity','harmony','stillness'], gratitude:['thankful','appreciation','blessed','grateful'] };
	criteria.forEach(criterion=>{
		const parts = criterion.toLowerCase().split(' ');
		const found = parts.some(p=> normalizedAnswer.includes(p) || (synonymMap[p]||[]).some(s=>normalizedAnswer.includes(s)) );
		if(found){ matchedCriteria.push(criterion); const i=missingCriteria.indexOf(criterion); if(i>-1) missingCriteria.splice(i,1); }
	});
	if (matchedCriteria.length === criteria.length) criteriaScore = 1; else if (matchedCriteria.length>0){ const r=matchedCriteria.length/criteria.length; criteriaScore = Math.max(0.3, r*0.9);} 
	let qualityBonus=0; const wc = normalizedAnswer.split(/\s+/).filter(Boolean).length; if(wc>=20) qualityBonus+=0.05; if(/(because|since)/.test(normalizedAnswer)) qualityBonus+=0.03; if(matchedCriteria.length>0 && wc>=30) qualityBonus+=0.02;
	const finalScore = Math.min(weight,(criteriaScore+qualityBonus)*weight);
	return { score: Math.round(finalScore*100)/100, maxScore: weight, matchedCriteria, missingCriteria, explanation:`Matched ${matchedCriteria.length}/${criteria.length} criteria (Fallback)`, method:'fallback', confidence:'deterministic' };
}

export async function evaluateSubjectiveAnswer(answerObj, criteria, weight){
	const { question, answer } = answerObj;
	if(!answer || !answer.trim()) return { score:0, maxScore:weight, matchedCriteria:[], missingCriteria:criteria, explanation:'No answer provided'};
	const API_KEY = process.env.OPENROUTER_API_KEY;
	if(!API_KEY){ return fallbackSubjectiveEvaluation(answerObj, criteria, weight); }
	const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1-0528:free';

	// Cache check
	const cached = getCachedSubjectiveLLM(question, criteria, answer, weight, model);
	if(cached){ return cached; }
	const body = { model, messages:[{ role:'user', content:`Evaluate answer JSON only. {"question":${JSON.stringify(question)},"criteria":${JSON.stringify(criteria)},"answer":${JSON.stringify(answer)},"weight":${weight}}` }], response_format:{ type:'json_object'} };
	try {
		const res = await fetch('https://openrouter.ai/api/v1/chat/completions',{ method:'POST', headers:{ Authorization:`Bearer ${API_KEY}`, 'Content-Type':'application/json'}, body: JSON.stringify(body)});
		if(!res.ok) return fallbackSubjectiveEvaluation(answerObj, criteria, weight);
		const data = await res.json();
	const parsed = JSON.parse(data.choices[0].message.content);
	const result = { score:Number(parsed.score)||0, maxScore:Number(parsed.maxScore)||weight, matchedCriteria: parsed.matchedCriteria||[], missingCriteria: parsed.missingCriteria||[], explanation: parsed.explanation || 'LLM evaluation completed.', method:'llm', confidence:'variable' };
	setCachedSubjectiveLLM(question, criteria, answer, weight, model, result);
	return result;
	} catch(e){
		return fallbackSubjectiveEvaluation(answerObj, criteria, weight);
	}
}
