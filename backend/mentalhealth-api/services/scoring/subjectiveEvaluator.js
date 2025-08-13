// Using global fetch (Node 18+). If older Node version is required, install node-fetch.

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
	return { score: Math.round(finalScore*100)/100, maxScore: weight, matchedCriteria, missingCriteria, explanation:`Matched ${matchedCriteria.length}/${criteria.length} criteria (Fallback)` };
}

export async function evaluateSubjectiveAnswer(answerObj, criteria, weight){
	const { question, answer } = answerObj;
	if(!answer || !answer.trim()) return { score:0, maxScore:weight, matchedCriteria:[], missingCriteria:criteria, explanation:'No answer provided'};
	const API_KEY = process.env.OPENROUTER_API_KEY;
	if(!API_KEY){ return fallbackSubjectiveEvaluation(answerObj, criteria, weight); }
	const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1-0528:free';
	const body = { model, messages:[{ role:'user', content:`Evaluate answer JSON only. {"question":${JSON.stringify(question)},"criteria":${JSON.stringify(criteria)},"answer":${JSON.stringify(answer)},"weight":${weight}}` }], response_format:{ type:'json_object'} };
	try {
		const res = await fetch('https://openrouter.ai/api/v1/chat/completions',{ method:'POST', headers:{ Authorization:`Bearer ${API_KEY}`, 'Content-Type':'application/json'}, body: JSON.stringify(body)});
		if(!res.ok) return fallbackSubjectiveEvaluation(answerObj, criteria, weight);
		const data = await res.json();
		const parsed = JSON.parse(data.choices[0].message.content);
		return { score:Number(parsed.score)||0, maxScore:Number(parsed.maxScore)||weight, matchedCriteria: parsed.matchedCriteria||[], missingCriteria: parsed.missingCriteria||[], explanation: parsed.explanation || 'LLM evaluation completed.' };
	} catch(e){
		return fallbackSubjectiveEvaluation(answerObj, criteria, weight);
	}
}
