export function evaluateObjectiveAnswer(selectedOption, question){
	if(!question || !question.weight) return { score:0, maxScore:0, selectedScore:0, maxOptionScore:0, details:'Invalid question' };
	if(!selectedOption || !question.options) return { score:0, maxScore:question.weight, selectedScore:0, maxOptionScore:0, details:'Missing option' };
	if(!question.options[selectedOption]) return { score:0, maxScore:question.weight, selectedScore:0, maxOptionScore:0, details:'Option not found'};
	const optionScore = question.options[selectedOption].score;
	const maxOptionScore = Math.max(...Object.values(question.options).map(o=>o.score));
	const normalized = maxOptionScore>0 ? optionScore / maxOptionScore : 0;
	const score = Math.round(question.weight * normalized * 100)/100;
	return { score, maxScore: question.weight, selectedScore: optionScore, maxOptionScore, details:`Selected ${selectedOption} (${optionScore}/${maxOptionScore})` };
}
