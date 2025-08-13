// Sample data structure - replaced with actual data from backend
const sampleResults = {
    userId: "user123",
    userName: "User Name",
    assessment: {
        percentage: 78,
        mentalAgeCategory: "Good",
        totalScore: 156,
        maxScore: 200,
        sectionBreakdown: {
            "Cognitive Function": {
                score: 35,
                maxScore: 40,
                percentage: 87.5,
                questionDetails: [
                    { type: 'Subjective', score: 15, maxScore: 20 },
                    { type: 'Objective', score: 20, maxScore: 20 }
                ]
            },
            "Emotional Well-being": {
                score: 32,
                maxScore: 40,
                percentage: 80,
                questionDetails: [
                    { type: 'Subjective', score: 12, maxScore: 15 },
                    { type: 'Objective', score: 20, maxScore: 25 }
                ]
            },
            "Social Connections": {
                score: 28,
                maxScore: 40,
                percentage: 70,
                questionDetails: [
                    { type: 'Subjective', score: 18, maxScore: 25 },
                    { type: 'Objective', score: 10, maxScore: 15 }
                ]
            },
            "Physical Health": {
                score: 30,
                maxScore: 40,
                percentage: 75,
                questionDetails: [
                    { type: 'Subjective', score: 15, maxScore: 20 },
                    { type: 'Objective', score: 15, maxScore: 20 }
                ]
            },
            "Spiritual Growth": {
                score: 31,
                maxScore: 40,
                percentage: 77.5,
                questionDetails: [
                    { type: 'Subjective', score: 21, maxScore: 25 },
                    { type: 'Objective', score: 10, maxScore: 15 }
                ]
            }
        },
        // Add this new field to sample data
        questionTypeBreakdown: {
            subjective: {
                score: 81,
                maxScore: 105,
                percentage: 77,
                questionCount: 5
            },
            objective: {
                score: 75,
                maxScore: 95,
                percentage: 79,
                questionCount: 5
            }
        },
        sectionRecommendations: {
            "Cognitive Function": {
                priority: "high",
                recommendations: [
                    "Engage in daily brain exercises like puzzles or reading",
                    "Learn a new skill or hobby to stimulate neuroplasticity",
                ]
            },
            "Social Connections": {
                priority: "medium",
                recommendations: [
                    "Join community groups or clubs aligned with your interests",
                    "Schedule regular video calls with family members",
                ]
            }
        }
    },
    message: "Very good! You show strong mental well-being across most areas. Focus on the specific areas highlighted in your section breakdown to achieve even greater balance and fulfillment."
};

let resultsData = null;
let scoreChart = null;
let detailedChart = null;
let activeScoreIndex = 0;

// Initialize results when page loads
function initializeResults() {
    // Try to load real data from localStorage
    const stored = localStorage.getItem("mh_assessment_result");
    console.log("[MH] Raw localStorage value:", stored);
    let error = null;
    if (stored) {
        try {
            resultsData = JSON.parse(stored);
            console.log("[MH] Parsed localStorage JSON:", resultsData);
            // Validate structure
            if (!resultsData || !resultsData.assessment || typeof resultsData.assessment.percentage !== "number") {
                throw new Error("Invalid assessment data structure");
            }
            // Optionally clear after use
            localStorage.removeItem("mh_assessment_result");
        } catch (e) {
            error = e;
            resultsData = null;
        }
    }
    if (!resultsData) {
        // warning if no real data is found
        resultsData = sampleResults;
        showNoResultsWarning(error);
    }
    displayResults(resultsData);
    createCharts();
    animateElements();
}

function showNoResultsWarning(error) {
    // warning message at the top of the page if no real results are found
    let container = document.querySelector(".main-container");
    if (!container) return;
    const warning = document.createElement("div");
    warning.className = "results-warning";
    warning.style = "background: #fff3cd; color: #856404; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffeeba; font-weight: 600;";
    warning.innerHTML = `<i class='fas fa-exclamation-triangle' style='margin-right:8px;'></i>No recent assessment results found. Showing sample data.${error ? "<br><span style='font-size:12px;color:#b8860b;'>Error: " + error.message + "</span>" : ""}`;
    container.insertBefore(warning, container.firstChild);
}

function displayResults(data) {
    const assessment = data.assessment;

    // Validate required fields
    if (!assessment || typeof assessment.percentage !== "number" || !assessment.sectionBreakdown) {
        document.getElementById("scoreNumber").textContent = "--";
        document.getElementById("riskLevel").textContent = "Invalid data";
        document.getElementById("scoreMessage").textContent = "Unable to display results. Please retake the assessment.";
        return;
    }

    // Update timestamp
    document.getElementById(
        "timestamp"
    ).textContent = `Assessment completed on ${new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    )}`;

    // Calculate and display time taken
    if (data.userInfo && data.userInfo.createdAt) {
        const startTime = new Date(data.userInfo.createdAt);
        const endTime = new Date();
        const timeDiff = Math.abs(endTime - startTime);
        const minutes = Math.floor(timeDiff / 60000);
        const seconds = ((timeDiff % 60000) / 1000).toFixed(0);
        document.getElementById("timeTaken").textContent = `Time Taken: ${minutes}m ${seconds}s`;
    }

    // Update overall score
    document.getElementById(
        "scoreNumber"
    ).textContent = `${assessment.percentage}%`;

    // Update risk level
    const riskLevel = getRiskLevel(assessment.percentage);
    const riskElement = document.getElementById("riskLevel");
    riskElement.className = `risk-level ${riskLevel.class}`;
    riskElement.innerHTML = `<i class="fas ${riskLevel.icon}"></i><span>${riskLevel.text}</span>`;

    // Update message
    document.getElementById("scoreMessage").textContent = data.message;

    // Update participant name if available
    displayParticipantInfo(data);

    // Display section breakdown
    displaySectionBreakdown(assessment.sectionBreakdown);

    // Display recommendations
    displayRecommendations(assessment.sectionRecommendations);

    // Display resources
    displayResources(assessment.percentage);
}

function getRiskLevel(percentage) {
    if (percentage >= 85) {
        return { text: "Excellent", class: "risk-excellent", icon: "fa-star" };
    } else if (percentage >= 70) {
        return { text: "Good", class: "risk-good", icon: "fa-thumbs-up" };
    } else if (percentage >= 55) {
        return { text: "Moderate", class: "risk-moderate", icon: "fa-balance-scale" };
    } else {
        return { text: "Needs Attention", class: "risk-attention", icon: "fa-exclamation-triangle" };
    }
}

function displayParticipantInfo(data) {
    const participantName = data.userName || (data.data && data.data.name) || null;
    const participantInfo = document.getElementById("participantInfo");
    const nameElement = document.getElementById("participantName");

    if (participantInfo && nameElement) {
        if (participantName) {
            nameElement.textContent = participantName;
            participantInfo.style.display = "flex";
        } else {
            participantInfo.style.display = "none";
        }
    }
}

function displaySectionBreakdown(sections) {
    const grid = document.getElementById("sectionGrid");
    grid.innerHTML = "";
    if (!sections || Object.keys(sections).length === 0) {
        grid.innerHTML = '<div style="color:#b91c1c;font-weight:600;">No section data available.</div>';
        return;
    }

    Object.entries(sections).forEach(([sectionName, data]) => {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "section-item";
        sectionDiv.innerHTML = `
            <div class="section-name">${sectionName}</div>
            <div class="section-score">
                <span class="section-percentage">${Math.round(
            data.percentage
        )}%</span>
                <span style="color: #64748b; font-size: 14px;">${data.score}/${data.maxScore
            }</span>
            </div>
            <div class="section-bar">
                <div class="section-fill" style="width: 0%;" data-width="${data.percentage
            }%"></div>
            </div>
        `;
        grid.appendChild(sectionDiv);
    });
}

function displayRecommendations(recommendations) {
    const grid = document.getElementById("recommendationsGrid");
    grid.innerHTML = "";
    if (!recommendations || Object.keys(recommendations).length === 0) {
        grid.innerHTML = '<div style="color:#64748b;font-weight:500;">No personalized recommendations available.</div>';
        return;
    }

    Object.entries(recommendations).forEach(([sectionName, data]) => {
        const card = document.createElement("div");
        card.className = "recommendation-card";

        const priorityIcon =
            data.priority === "high"
                ? "fa-exclamation-circle"
                : data.priority === "medium"
                    ? "fa-info-circle"
                    : "fa-check-circle";

        const actionsHtml = data.recommendations
            .map((rec) => `<span class="action-tag">${rec}</span>`)
            .join("");

        card.innerHTML = `
            <div class="recommendation-title">
                <i class="fas ${priorityIcon}"></i>
                ${sectionName}
            </div>
            <div class="recommendation-text">
                Focus on improving this area for better overall well-being.
            </div>
            <div class="recommendation-actions">
                ${actionsHtml}
            </div>
        `;
        grid.appendChild(card);
    });
}

function displayResources(score) {
    const resourcesList = document.getElementById("resourcesList");

    const resources = [
        {
            icon: "fa-phone",
            title: '<img src="./assets/logo.png" alt="Hosla" style="height:30px;vertical-align:middle;margin-right:4px;"> emergency Helpline',
            description: "24/7 support available - Call +91 7811-009-309",
            url: "tel:+91-7811-009-309",
        },
        {
            icon: "fa-book",
            title: "Mental Health Resources",
            description: "Articles and guides for seniors",
            url: "https://www.medicalnewstoday.com/articles/154543",
        },
        {
            icon: "fa-users",
            title: "Support Groups",
            description: "Find local support groups in your area",
            url: "https://www.meetup.com/topics/mental-health-support/in/",
        },
        {
            icon: "fa-user-md",
            title: "Find a Therapist",
            description: "Locate mental health professionals nearby",
            url: "https://www.thelivelovelaughfoundation.org/find-help/therapist",
        },
    ];

    resourcesList.innerHTML = resources
        .map(
            (resource, idx) => `
        <div class="resource-item" data-resource-idx="${idx}" style="cursor:pointer;">
            <div class="resource-icon">
                <i class="fas ${resource.icon}"></i>
            </div>
            <div class="resource-content">
                <div class="resource-title">${resource.title}</div>
                <div class="resource-description">${resource.description}</div>
            </div>
            <i class="fas fa-chevron-right" style="color: #64748b;"></i>
        </div>
    `
        )
        .join("");

    document.querySelectorAll(".resource-item").forEach((item) => {
        const idx = item.getAttribute("data-resource-idx");
        const url = resources[idx].url;
        item.addEventListener("click", function (e) {
            if (url.startsWith("tel:")) {
                window.location.href = url;
            } else {
                window.open(url, "_blank");
            }
        });
    });
}

// First, let's modify the data structure to calculate subjective and objective scores
function calculateSubjectiveObjectiveScores(sectionBreakdown) {
    let totalSubjectiveScore = 0;
    let maxSubjectiveScore = 0;
    let totalObjectiveScore = 0;
    let maxObjectiveScore = 0;
    
    // Iterate through each section to sum up subjective and objective scores
    Object.entries(sectionBreakdown).forEach(([sectionName, sectionData]) => {
        if (sectionData.questionDetails) {
            sectionData.questionDetails.forEach(question => {
                if (question.type === 'Subjective') {
                    totalSubjectiveScore += question.score || 0;
                    maxSubjectiveScore += question.maxScore || 0;
                } else if (question.type === 'Objective') {
                    totalObjectiveScore += question.score || 0;
                    maxObjectiveScore += question.maxScore || 0;
                }
            });
        }
    });
    
    const subjectivePercentage = maxSubjectiveScore > 0 ? Math.round((totalSubjectiveScore / maxSubjectiveScore) * 100) : 0;
    const objectivePercentage = maxObjectiveScore > 0 ? Math.round((totalObjectiveScore / maxObjectiveScore) * 100) : 0;
    
    return {
        subjective: {
            score: totalSubjectiveScore,
            maxScore: maxSubjectiveScore,
            percentage: subjectivePercentage
        },
        objective: {
            score: totalObjectiveScore,
            maxScore: maxObjectiveScore,
            percentage: objectivePercentage
        }
    };
}

function updateScoreDisplay(index) {
    const overallPercentage = resultsData.assessment.percentage;
    const subjectivePercentage = resultsData.assessment.questionTypeBreakdown.subjective.percentage;
    const objectivePercentage = resultsData.assessment.questionTypeBreakdown.objective.percentage;
    
    const labels = ["Overall Score", "Subjective Score", "Objective Score"];
    const values = [overallPercentage, subjectivePercentage, objectivePercentage];
    const colors = ["#667eea", "#ffc107", "#28a745"];

    const scoreNumberElement = document.getElementById("scoreNumber");
    const scoreLabelElement = document.querySelector(".score-label");

    scoreNumberElement.textContent = `${values[index]}%`;
    scoreLabelElement.textContent = labels[index];
    scoreNumberElement.style.color = colors[index];
    scoreLabelElement.style.color = colors[index];

    // Update the chart to pop out the selected segment
    if (scoreChart) {
        scoreChart.data.datasets[0].offset = [0, 0, 0];
        scoreChart.data.datasets[0].offset[index] = 20; // Increased offset for better visibility
        scoreChart.update();
    }
}

// Enhanced chart creation function
function createScoreChart() {
    try {
        const ctx = document.getElementById("scoreChart").getContext("2d");
        const overallPercentage = resultsData.assessment.percentage;
        
        // Calculate subjective and objective scores
        let subjectivePercentage = 0;
        let objectivePercentage = 0;
        
        // Check if we have the breakdown data from backend
        if (resultsData.assessment.questionTypeBreakdown) {
            subjectivePercentage = resultsData.assessment.questionTypeBreakdown.subjective.percentage;
            objectivePercentage = resultsData.assessment.questionTypeBreakdown.objective.percentage;
        } else {
            // Fallback calculation from section breakdown
            const scores = calculateSubjectiveObjectiveScores(resultsData.assessment.sectionBreakdown);
            subjectivePercentage = scores.subjective.percentage;
            objectivePercentage = scores.objective.percentage;
        }
        
        // Destroy existing chart if it exists
        if (scoreChart) {
            scoreChart.destroy();
        }
        
        // Chart configuration
        scoreChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Overall Score", "Subjective Score", "Objective Score"],
                datasets: [{
                    data: [overallPercentage, subjectivePercentage, objectivePercentage],
                    backgroundColor: [
                        "rgba(102, 126, 234, 0.8)",  // Blue for overall
                        "rgba(255, 193, 7, 0.8)",    // Yellow for subjective
                        "rgba(40, 167, 69, 0.8)"     // Green for objective
                    ],
                    borderColor: [
                        "rgba(102, 126, 234, 1)",
                        "rgba(255, 193, 7, 1)",
                        "rgba(40, 167, 69, 1)"
                    ],
                    borderWidth: 4, // Increased border width
                    cutout: "65%", // Slightly reduced cutout for better visibility
                    offset: [20, 0, 0], // Increased initial offset
                    hoverBorderWidth: 6, // Increased hover border width
                    hoverOffset: 15 // Increased hover offset
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
        
        // Add custom legend
        createCustomLegend(overallPercentage, subjectivePercentage, objectivePercentage);
        updateScoreDisplay(activeScoreIndex);
        
    } catch (error) {
        console.error("Error creating enhanced score chart:", error);
        document.getElementById("scoreNumber").textContent = resultsData.assessment.percentage + "%";
    }
}

// Add this new function to create custom legend
function createCustomLegend(overallPercentage, subjectivePercentage, objectivePercentage) {
    const legendContainer = document.createElement("div");
    legendContainer.className = "chart-legend";
    legendContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 20px;
        flex-wrap: wrap;
    `;
    
    const legendItems = [
        { label: "Overall", percentage: overallPercentage, color: "#667eea" },
        { label: "Subjective", percentage: subjectivePercentage, color: "#ffc107" },
        { label: "Objective", percentage: objectivePercentage, color: "#28a745" }
    ];
    
    legendItems.forEach((item, index) => {
        const legendItem = document.createElement("div");
        legendItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        
        legendItem.innerHTML = `
            <div style="
                width: 12px;
                height: 12px;
                background: ${item.color};
                border-radius: 50%;
            "></div>
            <span style="
                font-size: 12px;
                font-weight: 600;
                color: #374151;
            ">${item.label}: ${item.percentage}%</span>
        `;
        
        // Add hover effect
        legendItem.addEventListener('mouseenter', () => {
            legendItem.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            legendItem.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
        
        legendItem.addEventListener('mouseleave', () => {
            legendItem.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            legendItem.style.boxShadow = 'none';
        });

        // Add click listener to update the active score
        legendItem.addEventListener('click', () => {
            activeScoreIndex = index;
            updateScoreDisplay(activeScoreIndex);
        });
        
        legendContainer.appendChild(legendItem);
    });
    
    // Insert legend after the chart container
    const chartContainer = document.querySelector(".score-circle");
    if (chartContainer) {
        // Remove existing legend if it exists
        const existingLegend = chartContainer.parentNode.querySelector(".chart-legend");
        if (existingLegend) {
            existingLegend.remove();
        }
        
        chartContainer.parentNode.insertBefore(legendContainer, chartContainer.nextSibling);
    }
}

// Update the main initialization function
function initializeResults() {
    const stored = localStorage.getItem("mh_assessment_result");
    console.log("[MH] Raw localStorage value:", stored);
    
    let error = null;
    if (stored) {
        try {
            resultsData = JSON.parse(stored);
            console.log("[MH] Parsed localStorage JSON:", resultsData);
            
            if (!resultsData || !resultsData.assessment || typeof resultsData.assessment.percentage !== "number") {
                throw new Error("Invalid assessment data structure");
            }
            
            localStorage.removeItem("mh_assessment_result");
        } catch (e) {
            error = e;
            resultsData = null;
        }
    }
    
    if (!resultsData) {
        resultsData = sampleResults;
        showNoResultsWarning(error);
    }
    
    displayResults(resultsData);
    createCharts();
    animateElements();
}

// Update the createCharts function to use the new enhanced chart
function createCharts() {
    createScoreChart(); // Use the enhanced version
    createDetailedChart();
}

// Export functions for use in the main file
window.createEnhancedScoreChart = createScoreChart;
window.calculateSubjectiveObjectiveScores = calculateSubjectiveObjectiveScores;

function createDetailedChart() {
    try {
        const ctx = document.getElementById("detailedChart").getContext("2d");
        const sections = resultsData.assessment.sectionBreakdown;
        if (!sections) throw new Error("No section data");
        const labels = Object.keys(sections);
        const data = Object.values(sections).map(
            (section) => section.percentage
        );
        detailedChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Section Scores (%)",
                        data: data,
                        backgroundColor: "rgba(102, 126, 234, 0.6)",
                        borderColor: "rgba(102, 126, 234, 1)",
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + "%";
                            },
                        },
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.parsed.y}%`;
                            },
                        },
                    },
                },
            },
        });
    } catch (e) {
        // Optionally show a message or leave chart blank
    }
}

function animateElements() {
    // Animate progress bars
    setTimeout(() => {
        document.querySelectorAll(".section-fill").forEach((fill) => {
            const width = fill.getAttribute("data-width");
            fill.style.width = width;
        });
    }, 500);

    // Animate cards entrance
    const cards = document.querySelectorAll(
        ".section-item, .recommendation-card"
    );
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            card.style.transition = "all 0.6s ease";

            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, 100);
        }, index * 100);
    });
}

// Action button functions
// PDF generation function with styling
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Color scheme
    const colors = {
        primary: [102, 126, 234],
        secondary: [100, 116, 139],
        accent: [59, 130, 246],
        success: [34, 197, 94],
        warning: [251, 191, 36],
        danger: [239, 68, 68],
        light: [248, 250, 252],
        dark: [15, 23, 42]
    };
    
    // Helper function to add colored rectangle
    function addColoredRect(x, y, width, height, color, opacity = 1) {
        if (opacity < 1) {
            const lightColor = color.map(c => Math.min(255, c + (255 - c) * (1 - opacity)));
            doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
        } else {
            doc.setFillColor(color[0], color[1], color[2]);
        }
        doc.rect(x, y, width, height, 'F');
    }
    
    // Helper function to add section divider
    function addSectionDivider(y, title) {
        // Draw a line instead of rectangle for better compatibility
        doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        
        doc.setFontSize(14);
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setFont(undefined, 'bold');
        doc.text(title, 20, y + 10);
        return y + 20;
    }
    
    // PAGE 1: Header and Overview
    let currentY = 20;
    
    addColoredRect(0, 0, 210, 50, [230, 235, 250], 1);
    
    // Logo/Title section
    doc.setFontSize(24);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont(undefined, 'bold');
    doc.text('Mental Health Assessment', 20, 25);
    doc.text('Results Report', 20, 35);
    
    // Date and participant info
    doc.setFontSize(12);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.setFont(undefined, 'normal');
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Generated on: ${currentDate}`, 20, 45);
    
    // Participant name if available
    const participantName = resultsData.userName || (resultsData.data && resultsData.data.name) || 'Anonymous';
    if (participantName !== 'Anonymous') {
        doc.text(`Participant: ${participantName}`, 120, 45);
    }
    
    currentY = 65;
    
    // Overall Score Section with background
    addColoredRect(20, currentY, 170, 40, [252, 252, 253], 1); // Very light gray
    
    // Score circle using lines
    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setLineWidth(3);
    doc.circle(50, currentY + 20, 15, 'S'); // 'S' for stroke only
    
    // Score percentage
    doc.setFontSize(20);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont(undefined, 'bold');
    const scoreText = `${resultsData.assessment.percentage}%`;
    const scoreWidth = doc.getTextWidth(scoreText);
    doc.text(scoreText, 50 - scoreWidth/2, currentY + 25);
    
    // Risk level and description
    const riskLevel = getRiskLevel(resultsData.assessment.percentage);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    
    // Set color based on risk level
    let riskColor = colors.success;
    if (riskLevel.text === 'Good') riskColor = colors.accent;
    else if (riskLevel.text === 'Moderate') riskColor = colors.warning;
    else if (riskLevel.text === 'Needs Attention') riskColor = colors.danger;
    
    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.text(`Status: ${riskLevel.text}`, 80, currentY + 15);
    
    doc.setFontSize(12);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Score: ${resultsData.assessment.totalScore}/${resultsData.assessment.maxScore}`, 80, currentY + 25);
    
    // Message
    const messageLines = doc.splitTextToSize(resultsData.message, 100);
    doc.text(messageLines, 80, currentY + 35);
    
    currentY += 60;
    
    // Section Breakdown
    currentY = addSectionDivider(currentY, 'SECTION BREAKDOWN');
    
    const sections = resultsData.assessment.sectionBreakdown;
    const sectionEntries = Object.entries(sections);
    
    sectionEntries.forEach(([sectionName, data], index) => {
        // Section item background (alternating colors)
        const bgColor = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
        addColoredRect(20, currentY - 5, 170, 25, bgColor, 1);
        
        // Section name
        doc.setFontSize(12);
        doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
        doc.setFont(undefined, 'bold');
        doc.text(sectionName, 25, currentY + 5);
        
        // Score
        doc.setFont(undefined, 'normal');
        doc.text(`${data.score}/${data.maxScore}`, 25, currentY + 15);
        
        // Percentage
        doc.setFontSize(14);
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setFont(undefined, 'bold');
        doc.text(`${Math.round(data.percentage)}%`, 160, currentY + 10);
        
        // Progress bar
        const barWidth = 80;
        const barHeight = 4;
        const barX = 70;
        const barY = currentY + 8;
        
        // Background bar (light gray)
        addColoredRect(barX, barY, barWidth, barHeight, [226, 232, 240], 1);
        
        // Progress bar
        const progressWidth = (data.percentage / 100) * barWidth;
        let progressColor = colors.success;
        if (data.percentage < 70) progressColor = colors.warning;
        if (data.percentage < 50) progressColor = colors.danger;
        
        addColoredRect(barX, barY, progressWidth, barHeight, progressColor, 1);
        
        currentY += 30;
    });
    
    // Add new page for recommendations
    doc.addPage();
    currentY = 20;
    
    // Header on second page
    addColoredRect(0, 0, 210, 30, [230, 235, 250], 1);
    doc.setFontSize(18);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont(undefined, 'bold');
    doc.text('Personalized Recommendations', 20, 20);
    
    currentY = 45;
    
    // Recommendations section
    const recommendations = resultsData.assessment.sectionRecommendations;
    
    if (recommendations && Object.keys(recommendations).length > 0) {
        Object.entries(recommendations).forEach(([sectionName, data]) => {
            // Check if we need a new page
            if (currentY > 250) {
                doc.addPage();
                currentY = 20;
            }
            
            // Section header with priority indicator
            let priorityColor = colors.success;
            let priorityText = '●';
            if (data.priority === 'high') {
                priorityColor = colors.danger;
                priorityText = '!';
            } else if (data.priority === 'medium') {
                priorityColor = colors.warning;
                priorityText = '◐';
            }
            
            // Priority indicator
            doc.setFontSize(16);
            doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
            doc.text(priorityText, 20, currentY);
            
            // Section name
            doc.setFontSize(14);
            doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
            doc.setFont(undefined, 'bold');
            doc.text(sectionName, 30, currentY);
            
            // Priority label
            doc.setFontSize(10);
            doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
            doc.setFont(undefined, 'normal');
            doc.text(`(${data.priority.toUpperCase()} PRIORITY)`, 150, currentY);
            
            currentY += 15;
            
            // Recommendations
            data.recommendations.forEach((recommendation, index) => {
                doc.setFontSize(11);
                doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
                doc.setFont(undefined, 'normal');
                
                // Bullet point
                doc.text('•', 25, currentY);
                
                // Recommendation text
                const recLines = doc.splitTextToSize(recommendation, 155);
                doc.text(recLines, 35, currentY);
                
                currentY += recLines.length * 5 + 5;
            });
            
            currentY += 10;
        });
    }
    
    // Footer with resources
    if (currentY > 220) {
        doc.addPage();
        currentY = 20;
    }
    
    currentY = addSectionDivider(currentY, 'HELPFUL RESOURCES');
    
    // Emergency contact
    addColoredRect(20, currentY, 170, 20, [254, 242, 242], 1); // Light red background
    doc.setFontSize(12);
    doc.setTextColor(colors.danger[0], colors.danger[1], colors.danger[2]);
    doc.setFont(undefined, 'bold');
    doc.text('Emergency Helpline: +91 7811-009-309', 25, currentY + 10);
    doc.setFont(undefined, 'normal');
    doc.text('Available 24/7 for immediate support', 25, currentY + 15);
    
    currentY += 35;
    
    // Additional resources
    const resources = [
        'Mental Health Resources: medicalnewstoday.com/articles/154543',
        'Support Groups: meetup.com/topics/mental-health-support',
        'Find a Therapist: thelivelovelaughfoundation.org/find-help/therapist'
    ];
    
    resources.forEach(resource => {
        doc.setFontSize(10);
        doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        doc.text('• ' + resource, 25, currentY);
        currentY += 12;
    });
    
    // Disclaimer
    currentY += 20;
    addColoredRect(20, currentY, 170, 25, [252, 252, 253], 1); // Light gray
    doc.setFontSize(9);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.setFont(undefined, 'italic');
    const disclaimer = 'Disclaimer: This assessment is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.';
    const disclaimerLines = doc.splitTextToSize(disclaimer, 165);
    doc.text(disclaimerLines, 22, currentY + 5);
    
    // Save the PDF
    const fileName = participantName !== 'Anonymous' 
        ? `${participantName.replace(/\s+/g, '_')}_Mental_Health_Assessment.pdf`
        : 'Mental_Health_Assessment_Results.pdf';
    
    doc.save(fileName);
}

// Alternative: PDF with Chart.js integration (if you want to include charts)
function downloadPDFWithCharts() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // First create the basic PDF structure as above
    downloadPDF();

    // Then, if you want to add charts, you can capture the canvas elements
    // and add them to the PDF (this requires html2canvas library)
    /*
    html2canvas(document.getElementById('scoreChart')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 20, 120, 80, 60);
        doc.save('assessment-results-with-charts.pdf');
    });
    */
}

function emailResults() {
    document.getElementById("emailModal").style.display = "block";
}

function closeModal() {
    document.getElementById("emailModal").style.display = "none";
}

function sendEmail() {
    const email = document.getElementById("emailAddress").value;
    const message = document.getElementById("emailMessage").value;

    if (!email) {
        alert("Please enter an email address");
        return;
    }

    fetch('http://localhost:8000/api/email/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            message: message,
            results: resultsData
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Results have been sent to " + email);
                closeModal();
            } else {
                alert("Failed to send email: " + (data.error || "Unknown error"));
            }
        })
        .catch(err => {
            alert("Error sending email: " + err.message);
        });
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: "Mental Health Assessment Results",
            text: `I completed a mental health assessment and scored ${resultsData.assessment.percentage}%. Check out the detailed results!`,
            url: window.location.href,
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `I completed a mental health assessment and scored ${resultsData.assessment.percentage}%.`;
        navigator.clipboard.writeText(shareText + " " + window.location.href);
        alert("Results link has been copied to clipboard!");
    }
}

function retakeAssessment() {
    if (
        confirm(
            "Are you sure you want to start a new assessment? This will clear your current results."
        )
    ) {
        window.location.href = "mentalHealth.html";
    }
}

// Expose action functions to global scope for HTML onclick handlers
window.downloadPDF = downloadPDF;
window.emailResults = emailResults;
window.shareResults = shareResults;
window.retakeAssessment = retakeAssessment;
window.closeModal = closeModal;
window.sendEmail = sendEmail;


document.addEventListener("DOMContentLoaded", function () {
    initializeResults();

    // Attach event listeners to buttons
    document.getElementById("downloadPdfBtn").addEventListener("click", downloadPDF);
    document.getElementById("emailResultsBtn").addEventListener("click", emailResults);
    document.getElementById("shareResultsBtn").addEventListener("click", shareResults);
    document.getElementById("retakeAssessmentBtn").addEventListener("click", retakeAssessment);
    document.getElementById("closeModalSpanBtn").addEventListener("click", closeModal);
    document.getElementById("cancelEmailBtn").addEventListener("click", closeModal);
    document.getElementById("sendEmailBtn").addEventListener("click", sendEmail);

    // Close modal when clicking outside of it
    window.addEventListener("click", function (event) {
        const modal = document.getElementById("emailModal");
        if (event.target === modal) {
            closeModal();
        }
    });
});
