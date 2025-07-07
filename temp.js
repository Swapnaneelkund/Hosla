
const chartHtml = `
        <div class="score-overview">
          <div class="score-circle">
            <canvas id="scoreChart"></canvas>
            <div class="score-display">
              <div class="score-number" id="scoreNumber">--</div>
              <div class="score-label">Overall Score</div>
            </div>
          </div>
          <div class="risk-assessment">
            <div id="riskLevel">
                <!-- JS will populate this -->
            </div>
            <p class="score-message" id="scoreMessage">
              Loading your personalized assessment results...
            </p>
          </div>
        </div>
`;

const chartCss = `
.score-overview {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-bottom: 40px;
  align-items: center;
}

.score-circle {
  position: relative;
  width: 300px; /* Further increased size for desktop */
  height: 300px; /* Further increased size for desktop */
  margin: 0 auto;
}

.score-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
  max-width: 80%; /* Added max-width to prevent text overflow */
}

.score-number {
  font-size: 45px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.score-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.risk-assessment {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  padding: 25px;
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.score-message {
  font-size: 1rem; /* Slightly reduced font size for smaller screens */
  line-height: 1.8; /* Increased line-height for better readability */
  word-break: break-word; /* Ensures long words break and wrap */
}

/* Chart Legend Styles */
.chart-legend {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
}

.chart-legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chart-legend-text {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

/* Responsive design */
@media (max-width: 768px) {
  .score-overview {
    flex-direction: column; /* Stack elements vertically */
    align-items: center; /* Center items horizontally */
    gap: 20px;
  }

  .score-circle {
    width: 190px; /* Slightly reduced for better fit on small screens */
    height: 190px;
  }

  .score-number {
    font-size: 28px; /* Further reduced for better fit */
  }

  .chart-legend {
    gap: 10px;
  }

  .chart-legend-item {
    padding: 6px 10px;
  }

  .chart-legend-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .score-circle {
    width: 160px; /* Even smaller for very small screens */
    height: 160px;
  }
  .score-number {
    font-size: 20px; /* Even smaller font for very small screens */
  }
  .score-label {
    font-size: 10px; /* Even smaller font for very small screens */
  }
}

/* Animation for chart appearance */
@keyframes chartFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.score-circle {
  animation: chartFadeIn 0.6s ease-out;
}
`;

const chartJs = `
// Sample data structure - simplified for this context
const sampleResults = {
    assessment: {
        percentage: 78,
        questionTypeBreakdown: {
            subjective: { percentage: 77 },
            objective: { percentage: 79 }
        }
    },
    message: "Very good! You show strong mental well-being across most areas. Focus on the specific areas highlighted in your section breakdown to achieve even greater balance and fulfillment."
};

let resultsData = sampleResults; // Using sample data directly for this debug file
let scoreChart = null;
let activeScoreIndex = 0;

function updateScoreDisplay(index) {
    const overallPercentage = resultsData.assessment.percentage;
    const subjectivePercentage = resultsData.assessment.questionTypeBreakdown.subjective.percentage;
    const objectivePercentage = resultsData.assessment.questionTypeBreakdown.objective.percentage;
    
    const labels = ["Overall Score", "Subjective Score", "Objective Score"];
    const values = [overallPercentage, subjectivePercentage, objectivePercentage];
    const colors = ["#667eea", "#ffc107", "#28a745"];

    const scoreNumberElement = document.getElementById("scoreNumber");
    const scoreLabelElement = document.querySelector(".score-label");

    if (scoreNumberElement && scoreLabelElement) {
        scoreNumberElement.textContent = \`\${values[index]}%\`;
        scoreLabelElement.textContent = labels[index];
        scoreNumberElement.style.color = colors[index];
        scoreLabelElement.style.color = colors[index];
    }

    if (scoreChart) {
        scoreChart.data.datasets[0].offset = [0, 0, 0];
        scoreChart.data.datasets[0].offset[index] = 15;
        scoreChart.update();
    }
}

function calculateSubjectiveObjectiveScores(sectionBreakdown) {
    // Simplified for this context, assuming data is pre-calculated in sampleResults
    return {
        subjective: { score: 0, maxScore: 0, percentage: 0 },
        objective: { score: 0, maxScore: 0, percentage: 0 }
    };
}

function createScoreChart() {
    try {
        const ctx = document.getElementById("scoreChart").getContext("2d");
        const overallPercentage = resultsData.assessment.percentage;
        
        let subjectivePercentage = 0;
        let objectivePercentage = 0;
        
        if (resultsData.assessment.questionTypeBreakdown) {
            subjectivePercentage = resultsData.assessment.questionTypeBreakdown.subjective.percentage;
            objectivePercentage = resultsData.assessment.questionTypeBreakdown.objective.percentage;
        } else {
            const scores = calculateSubjectiveObjectiveScores(resultsData.assessment.sectionBreakdown);
            subjectivePercentage = scores.subjective.percentage;
            objectivePercentage = scores.objective.percentage;
        }
        
        if (scoreChart) {
            scoreChart.destroy();
        }
        
        scoreChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Overall Score", "Subjective Score", "Objective Score"],
                datasets: [{
                    data: [overallPercentage, subjectivePercentage, objectivePercentage],
                    backgroundColor: [
                        "rgba(102, 126, 234, 0.8)",
                        "rgba(255, 193, 7, 0.8)",
                        "rgba(40, 167, 69, 0.8)"
                    ],
                    borderColor: [
                        "rgba(102, 126, 234, 1)",
                        "rgba(255, 193, 7, 1)",
                        "rgba(40, 167, 69, 1)"
                    ],
                    borderWidth: 3,
                    cutout: "70%",
                    offset: [15, 0, 0],
                    hoverBorderWidth: 4,
                    hoverOffset: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                onHover: (event, activeElements) => {
                    if (activeElements.length > 0) {
                        updateScoreDisplay(activeElements[0].index);
                    } else {
                        updateScoreDisplay(activeScoreIndex);
                    }
                }
            }
        });
        
        createCustomLegend(overallPercentage, subjectivePercentage, objectivePercentage);
        updateScoreDisplay(activeScoreIndex);
        
    } catch (error) {
        console.error("Error creating enhanced score chart:", error);
        const scoreNumberElement = document.getElementById("scoreNumber");
        if (scoreNumberElement) {
            scoreNumberElement.textContent = resultsData.assessment.percentage + "%";
        }
    }
}

function createCustomLegend(overallPercentage, subjectivePercentage, objectivePercentage) {
    const legendContainer = document.createElement("div");
    legendContainer.className = "chart-legend";
    legendContainer.style.cssText = \`
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 20px;
        flex-wrap: wrap;
    \`;
    
    const legendItems = [
        { label: "Overall", percentage: overallPercentage, color: "#667eea" },
        { label: "Subjective", percentage: subjectivePercentage, color: "#ffc107" },
        { label: "Objective", percentage: objectivePercentage, color: "#28a745" }
    ];
    
    legendItems.forEach((item, index) => {
        const legendItem = document.createElement("div");
        legendItem.style.cssText = \`
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: all 0.2s ease;
        \`;
        
        legendItem.innerHTML = \`
            <div style="
                width: 12px;
                height: 12px;
                background: \${item.color};
                border-radius: 50%;
            "></div>
            <span style="
                font-size: 12px;
                font-weight: 600;
                color: #374151;
            ">\${item.label}: \${item.percentage}%</span>
        \`;
        
        legendItem.addEventListener('mouseenter', () => {
            legendItem.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            legendItem.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
        
        legendItem.addEventListener('mouseleave', () => {
            legendItem.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            legendItem.style.boxShadow = 'none';
        });

        legendItem.addEventListener('click', () => {
            activeScoreIndex = index;
            updateScoreDisplay(activeScoreIndex);
        });
        
        legendContainer.appendChild(legendItem);
    });
    
    const chartContainer = document.querySelector(".score-circle");
    if (chartContainer) {
        const existingLegend = chartContainer.parentNode.querySelector(".chart-legend");
        if (existingLegend) {
            existingLegend.remove();
        }
        
        chartContainer.parentNode.insertBefore(legendContainer, chartContainer.nextSibling);
    }
}

function initializeResults() {
    // Simplified for temp.js - in actual app, this loads from localStorage
    // displayResults(resultsData); // Assuming displayResults is defined elsewhere or not needed for this snippet
    createScoreChart(); 
}

// Call initializeResults to set up the chart when this script runs
initializeResults();
`;

const fullContent = `
// HTML for the chart section
${chartHtml}

// CSS for the chart section
${chartCss}

// JavaScript for the chart section
${chartJs}
`;

write_file(file_path="/mnt/d/WEB-DEV/Hosla/hosla-mentalHealth-project/temp.js", content=fullContent)
