export function evaluateObjectiveAnswer(selectedOption, question){
	if(!question || !question.weight) return { score:0, maxScore:0, selectedScore:0, maxOptionScore:0, details:'Invalid question' };
	if(!selectedOption || !question.options) return { score:0, maxScore:question.weight, selectedScore:0, maxOptionScore:0, details:'Missing option' };
	if(!question.options[selectedOption]) return { score:0, maxScore:question.weight, selectedScore:0, maxOptionScore:0, details:'Option not found'};
	const optionScore = Number(question.options[selectedOption].score) || 0;
	const maxOptionScore = Math.max(...Object.values(question.options).map(o=>Number(o.score)||0));
	// In the dataset, higher option scores represent higher severity (worse well-being).
	// Convert severity to well-being by inverting the normalized severity.
	const normalizedSeverity = maxOptionScore>0 ? optionScore / maxOptionScore : 0;
	const wellbeingNormalized = 1 - normalizedSeverity; // 1 = best, 0 = worst
	const score = Math.round(question.weight * wellbeingNormalized * 100)/100;
	return { score, maxScore: question.weight, selectedScore: optionScore, maxOptionScore, details:`Selected ${selectedOption} (severity ${optionScore}/${maxOptionScore} -> wellbeing ${(Math.round(wellbeingNormalized*100))}%)` };
}
