// Sample data structure - replaced with actual data from backend
const sampleResults = {
    userId: "user123",
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
            },
            "Emotional Well-being": {
                score: 32,
                maxScore: 40,
                percentage: 80,
            },
            "Social Connections": {
                score: 28,
                maxScore: 40,
                percentage: 70,
            },
            "Physical Health": {
                score: 30,
                maxScore: 40,
                percentage: 75,
            },
            "Spiritual Growth": {
                score: 31,
                maxScore: 40,
                percentage: 77.5,
            },
        },
        sectionRecommendations: {
            "Cognitive Function": {
                priority: "high",
                recommendations: [
                    "Engage in daily brain exercises like puzzles or reading",
                    "Learn a new skill or hobby to stimulate neuroplasticity",
                ],
            },
            "Social Connections": {
                priority: "medium",
                recommendations: [
                    "Join community groups or clubs aligned with your interests",
                    "Schedule regular video calls with family members",
                ],
            },
        },
    },
    message:
        "Very good! You show strong mental well-being across most areas. Focus on the specific areas highlighted in your section breakdown to achieve even greater balance and fulfillment.",
};

let resultsData = null;
let scoreChart = null;
let detailedChart = null;

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

    // Update overall score
    document.getElementById(
        "scoreNumber"
    ).textContent = `${assessment.percentage}%`;

    // Update risk level
    const riskLevel = getRiskLevel(assessment.percentage);
    const riskElement = document.getElementById("riskLevel");
    riskElement.textContent = riskLevel.text;
    riskElement.className = `risk-level ${riskLevel.class}`;

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
        return { text: "Excellent", class: "risk-excellent" };
    } else if (percentage >= 70) {
        return { text: "Good", class: "risk-good" };
    } else if (percentage >= 55) {
        return { text: "Moderate", class: "risk-moderate" };
    } else {
        return { text: "Needs Attention", class: "risk-attention" };
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

function createCharts() {
    createScoreChart();
    createDetailedChart();
}

function createScoreChart() {
    try {
        const ctx = document.getElementById("scoreChart").getContext("2d");
        const percentage = resultsData.assessment.percentage;
        scoreChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [percentage, 100 - percentage],
                        backgroundColor: [
                            "rgba(102, 126, 234, 0.8)",
                            "rgba(226, 232, 240, 0.3)",
                        ],
                        borderColor: [
                            "rgba(102, 126, 234, 1)",
                            "rgba(226, 232, 240, 0.5)",
                        ],
                        borderWidth: 2,
                        cutout: "75%",
                    },
                ],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false,
                    },
                },
            },
        });
    } catch (e) {
        document.getElementById("scoreNumber").textContent = "--";
    }
}

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
