import { evaluateSubjectiveAnswer } from './subjectiveEvaluator.js';
import { batchEvaluateSubjectiveAnswers } from './batchSubjectiveEvaluator.js';
import { evaluateObjectiveAnswer } from './objectiveEvaluator.js';

export async function calculateSectionScore(userAnswers, sectionData, sectionName) {
	const sectionAnswers = userAnswers.filter(a=>a.section===sectionName);
	const sectionWeight = parseFloat(sectionData.weight.replace('%',''))/100;
	let totalScore=0, maxPossible=0; const questionDetails=[];
	if(sectionData.Subjective){
		const subjectiveQuestions = sectionData.Subjective.map(q=>({
			id: q.id,
			question: q.question.en,
			criteria: q.criteria||[],
			weight: q.weight,
			answer: (sectionAnswers.find(a=>a.type==='Subjective' && a.questionId===q.id)?.answer)||'',
			timeTakenSec: Number(sectionAnswers.find(a=>a.type==='Subjective' && a.questionId===q.id)?.timeTakenSec)||undefined
		}));
		let evaluations;
		try {
			if(subjectiveQuestions.length>1){
				evaluations = await batchEvaluateSubjectiveAnswers(subjectiveQuestions);
			} else {
				evaluations = await Promise.all(subjectiveQuestions.map(q=>evaluateSubjectiveAnswer({ question: q.question, answer: q.answer }, q.criteria, q.weight)));
			}
		} catch(_e){
			// Fallback to individual evaluation on any batch failure
			evaluations = await Promise.all(subjectiveQuestions.map(q=>evaluateSubjectiveAnswer({ question: q.question, answer: q.answer }, q.criteria, q.weight)));
		}
		subjectiveQuestions.forEach((q,i)=>{
			const evalRes = evaluations[i];
			totalScore += evalRes.score; maxPossible += evalRes.maxScore;
			questionDetails.push({ type:'Subjective', questionId: q.id, question: q.question, answer: q.answer, timeTakenSec: q.timeTakenSec, ...evalRes });
		});
	}
	if(sectionData.Objective){
		sectionData.Objective.forEach((q, idx)=>{
			const ans = sectionAnswers.find(a=>a.type==='Objective' && a.questionIndex===idx);
			const evalRes = evaluateObjectiveAnswer(ans?.selectedOption, q);
			totalScore += evalRes.score; maxPossible += evalRes.maxScore;
			questionDetails.push({ type:'Objective', questionIndex: idx, sectionName, question: q.question.en, selectedOption: ans?.selectedOption, timeTakenSec: Number(ans?.timeTakenSec)||undefined, ...evalRes });
		});
	}
	const weighted = totalScore * sectionWeight;
	const maxWeighted = maxPossible * sectionWeight;
	return {
		sectionName,
		rawScore: Math.round(totalScore*100)/100,
		maxRawScore: maxPossible,
		sectionWeight,
		weightedScore: Math.round(weighted*100)/100,
		maxWeightedScore: Math.round(maxWeighted*100)/100,
		percentage: maxPossible>0 ? Math.round((totalScore/maxPossible)*100):0,
		questionDetails
	};
}

export function calculateSubjectiveObjectiveBreakdown(sectionScores){
	let subj=0,maxSubj=0,obj=0,maxObj=0; sectionScores.forEach(s=>{
		s.questionDetails?.forEach(q=>{ if(q.type==='Subjective'){subj+=q.score||0; maxSubj+=q.maxScore||0;} else if(q.type==='Objective'){obj+=q.score||0; maxObj+=q.maxScore||0;} });
	});
	return {
		subjective:{ score:Math.round(subj*100)/100, maxScore:Math.round(maxSubj*100)/100, percentage: maxSubj>0? Math.round((subj/maxSubj)*100):0, questionCount: sectionScores.reduce((c,s)=>c+(s.questionDetails?.filter(q=>q.type==='Subjective').length||0),0)},
		objective:{ score:Math.round(obj*100)/100, maxScore:Math.round(maxObj*100)/100, percentage: maxObj>0? Math.round((obj/maxObj)*100):0, questionCount: sectionScores.reduce((c,s)=>c+(s.questionDetails?.filter(q=>q.type==='Objective').length||0),0)}
	};
}

export function getSectionRecommendations(sectionScores){
	const map={ Depression:['Practice daily gratitude journaling','Engage in regular physical activity','Reach out to support network','Use mindfulness exercises'], Anxiety:['Try deep breathing','Reduce stimulants','Improve sleep hygiene','Consider professional support'], Cognitive:['Puzzles or reading','Learn new skill','Memory games','Stay socially active'], Social:['Join community groups','Schedule regular calls','Volunteer','Attend events'], PhysicalWellbeing:['Regular physical activity','Balanced nutrition','Prioritize sleep','Routine health checkups'], PurposeAndMeaning:['Clarify values','Engage purposeful activities','Mentor others','Explore new hobbies'] };
	const recs={};
	sectionScores.forEach(s=>{ recs[s.sectionName] = map[s.sectionName] || []; });
	return recs;
}

export async function calculateScore(userAnswers, questionnaireData){
	const sectionPromises = Object.keys(questionnaireData).map(name=>calculateSectionScore(userAnswers, questionnaireData[name], name));
	const sectionScores = await Promise.all(sectionPromises);
	let totalWeighted=0, maxTotalWeighted=0; sectionScores.forEach(s=>{ totalWeighted+=s.weightedScore; maxTotalWeighted+=s.maxWeightedScore; });
	const percentage = maxTotalWeighted>0? Math.round((totalWeighted/maxTotalWeighted)*100):0;
	const questionTypeBreakdown = calculateSubjectiveObjectiveBreakdown(sectionScores);

	// Evaluation metadata: count LLM vs fallback on subjective and average time
	let llmCount=0, fallbackCount=0, timeSum=0, timeN=0;
	sectionScores.forEach(s=>{
		s.questionDetails?.forEach(q=>{
			if(q.type==='Subjective'){
				if(q.method==='llm') llmCount++; else if(q.method==='fallback') fallbackCount++;
			}
			if(typeof q.timeTakenSec==='number') { timeSum+=q.timeTakenSec; timeN++; }
		});
	});
	const evaluationMeta = {
		subjectiveMethodUsage: { llm: llmCount, fallback: fallbackCount },
		timing: { averageTimeSec: timeN? Math.round((timeSum/timeN)*10)/10 : null }
	};
	let category='', recommendations=[];
	if(percentage>=85){ category='Excellent Mental Resilience'; recommendations=['Continue excellent practices','Mentor others','Maintain connections']; }
	else if(percentage>=70){ category='Good Mental Well-being'; recommendations=['Focus on lower areas','Increase community involvement','Practice mindfulness']; }
	else if(percentage>=55){ category='Moderate Mental Health'; recommendations=['Work on emotional flexibility','Engage community','Develop spiritual practices','Cognitive exercises']; }
	else { category='Needs Attention'; recommendations=['Seek professional counseling','Start small practices','Build social connections','Focus on basics']; }
	const modelId = process.env.OPENROUTER_MODEL || null;
	return { finalScore: Math.round(totalWeighted*100)/100, maxPossibleScore: Math.round(maxTotalWeighted*100)/100, percentage, mentalAgeCategory: category, recommendations, sectionBreakdown: sectionScores, questionTypeBreakdown, evaluationMeta, timestamp: new Date().toISOString(), totalQuestions: userAnswers.length, completionRate: calculateCompletionRate(userAnswers, questionnaireData), scoringVersion: '2025-08-15-obj-inverted-v1', modelId };
}

function calculateCompletionRate(userAnswers, questionnaireData){
	let total=0; Object.values(questionnaireData).forEach(s=>{ total += (s.Subjective?.length||0)+(s.Objective?.length||0); });
	let answered=0; userAnswers.forEach(a=>{ if((a.type==='Subjective' && a.answer?.trim()) || (a.type==='Objective' && a.selectedOption)) answered++; });
	return total>0? Math.round((answered/total)*100):0;
}

// Analyze section subjective question details to extract top missing criteria as drivers
export function computeSectionDrivers(sectionScores){
	const out={};
	sectionScores.forEach(s=>{
		const counts=new Map();
		s.questionDetails?.forEach(q=>{
			if(q.type==='Subjective' && Array.isArray(q.missingCriteria)){
				q.missingCriteria.forEach(c=>{ counts.set(c,(counts.get(c)||0)+1); });
			}
		});
		const sorted=[...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([c,_])=>c);
		out[s.sectionName]=sorted;
	});
	return out;
}
