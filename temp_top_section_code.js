
// This file contains the specific JavaScript needed to power the top section of the results page.
// The HTML and CSS you provided are correct and will work with this script.

// Sample data structure used to populate the fields.
const sampleResults = {
    userId: "user123",
    userName: "Sujal Thakkar",
    assessment: {
        percentage: 78,
        totalScore: 156,
        maxScore: 200,
        // This breakdown is needed for the subjective/objective calculation fallback.
        sectionBreakdown: {
            "Cognitive Function": {
                questionDetails: [
                    { type: 'Subjective', score: 15, maxScore: 20 },
                    { type: 'Objective', score: 20, maxScore: 20 }
                ]
            },
            "Emotional Well-being": {
                questionDetails: [
                    { type: 'Subjective', score: 12, maxScore: 15 },
                    { type: 'Objective', score: 20, maxScore: 25 }
                ]
            },
        },
        // This is the primary source for the chart's subjective/objective scores.
        questionTypeBreakdown: {
            subjective: {
                percentage: 77,
            },
            objective: {
                percentage: 79,
            }
        },
    },
    message: "Very good! You show strong mental well-being across most areas."
};

let resultsData = null;
let scoreChart = null;

// Main initialization function called when the page loads.
function initializeResults() {
    // In a real scenario, this would fetch data. We'll use the sample data.
    const stored = localStorage.getItem("mh_assessment_result");
    if (stored) {
        try {
            resultsData = JSON.parse(stored);
        } catch (e) {
            resultsData = sampleResults;
        }
    } else {
        resultsData = sampleResults;
    }
    
    displayResults(resultsData);
    createScoreChart();
}

// Populates the header, participant info, and score message.
function displayResults(data) {
    const assessment = data.assessment;

    // Update timestamp
    document.getElementById("timestamp").textContent = `Assessment completed on ${new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })}`;

    // Update overall score number in the circle
    document.getElementById("scoreNumber").textContent = `${assessment.percentage}%`;

    // Update risk level text and style
    const riskLevel = getRiskLevel(assessment.percentage);
    const riskElement = document.getElementById("riskLevel");
    riskElement.textContent = riskLevel.text;
    riskElement.className = `risk-level ${riskLevel.class}`;

    // Update the descriptive message
    document.getElementById("scoreMessage").textContent = data.message;

    // Display participant name
    displayParticipantInfo(data);
}

// Helper function to determine the risk level text and CSS class.
function getRiskLevel(percentage) {
    if (percentage >= 85) return { text: "Excellent", class: "risk-excellent" };
    if (percentage >= 70) return { text: "Good", class: "risk-good" };
    if (percentage >= 55) return { text: "Moderate", class: "risk-moderate" };
    return { text: "Needs Attention", class: "risk-attention" };
}

// Shows the participant's name in the header.
function displayParticipantInfo(data) {
    const participantName = data.userName;
    const participantInfo = document.getElementById("participantInfo");
    const nameElement = document.getElementById("participantName");

    if (participantInfo && nameElement && participantName) {
        nameElement.textContent = participantName;
        participantInfo.style.display = "flex";
    }
}

// Fallback function to calculate subjective/objective scores if not provided directly.
function calculateSubjectiveObjectiveScores(sectionBreakdown) {
    let totalSubjectiveScore = 0, maxSubjectiveScore = 0;
    let totalObjectiveScore = 0, maxObjectiveScore = 0;
    
    Object.values(sectionBreakdown).forEach(sectionData => {
        sectionData.questionDetails.forEach(q => {
            if (q.type === 'Subjective') {
                totalSubjectiveScore += q.score || 0;
                maxSubjectiveScore += q.maxScore || 0;
            } else if (q.type === 'Objective') {
                totalObjectiveScore += q.score || 0;
                maxObjectiveScore += q.maxScore || 0;
            }
        });
    });
    
    return {
        subjective: { percentage: maxSubjectiveScore > 0 ? Math.round((totalSubjectiveScore / maxSubjectiveScore) * 100) : 0 },
        objective: { percentage: maxObjectiveScore > 0 ? Math.round((totalObjectiveScore / maxObjectiveScore) * 100) : 0 }
    };
}

// Creates the interactive doughnut chart.
function createScoreChart() {
    const ctx = document.getElementById("scoreChart").getContext("2d");
    const overallPercentage = resultsData.assessment.percentage;
    
    let subjectivePercentage, objectivePercentage;
    
    if (resultsData.assessment.questionTypeBreakdown) {
        subjectivePercentage = resultsData.assessment.questionTypeBreakdown.subjective.percentage;
        objectivePercentage = resultsData.assessment.questionTypeBreakdown.objective.percentage;
    } else {
        const scores = calculateSubjectiveObjectiveScores(resultsData.assessment.sectionBreakdown);
        subjectivePercentage = scores.subjective.percentage;
        objectivePercentage = scores.objective.percentage;
    }
    
    if (scoreChart) scoreChart.destroy();
    
    scoreChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Overall Score", "Subjective Score", "Objective Score"],
            datasets: [{
                data: [overallPercentage, subjectivePercentage, objectivePercentage],
                backgroundColor: ["rgba(102, 126, 234, 0.8)", "rgba(255, 193, 7, 0.8)", "rgba(40, 167, 69, 0.8)"],
                borderColor: ["#667eea", "#ffc107", "#28a745"],
                borderWidth: 3,
                cutout: "70%",
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            onHover: (event, activeElements) => {
                const scoreNumEl = document.getElementById("scoreNumber");
                const scoreLabelEl = document.querySelector(".score-label");
                
                if (activeElements.length > 0) {
                    const index = activeElements[0].index;
                    const labels = ["Overall Score", "Subjective Score", "Objective Score"];
                    const values = [overallPercentage, subjectivePercentage, objectivePercentage];
                    const colors = ["#667eea", "#ffc107", "#28a745"];
                    
                    scoreNumEl.textContent = `${values[index]}%`;
                    scoreLabelEl.textContent = labels[index];
                    scoreNumEl.style.color = colors[index];
                    scoreLabelEl.style.color = colors[index];
                } else {
                    scoreNumEl.textContent = `${overallPercentage}%`;
                    scoreLabelEl.textContent = "Overall Score";
                    scoreNumEl.style.color = "#667eea";
                    scoreLabelEl.style.color = "#64748b";
                }
            }
        }
    });
}

// This listener ensures the script runs after the HTML is loaded.
document.addEventListener("DOMContentLoaded", initializeResults);
