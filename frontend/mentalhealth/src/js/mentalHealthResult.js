// Sample data structure - replace with actual data from your backend
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
    console.log("[MH] Raw localStorage value:", stored); // Log the raw JSON string
    let error = null;
    if (stored) {
        try {
            resultsData = JSON.parse(stored);
            console.log("[MH] Parsed localStorage JSON:", resultsData); // Log the parsed object
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
        // Show a warning if no real data is found
        resultsData = sampleResults;
        showNoResultsWarning(error);
    }
    displayResults(resultsData);
    createCharts();
    animateElements();
}

function showNoResultsWarning(error) {
    // Show a warning message at the top of the page if no real results are found
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
    const participantName = (data.userName || (data.data && data.data.name) || null);
    const nameElement = document.getElementById("participantName");
    if (nameElement) {
        if (participantName) {
            nameElement.textContent = `Participant: ${participantName}`;
            nameElement.style.display = "block";
        } else {
            nameElement.style.display = "none";
        }
    }

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

    // Add event listeners for click
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
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    doc.text("Mental Health Assessment Results", 20, 30);

    // Add date
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);

    // Add overall score
    doc.setFontSize(16);
    doc.setTextColor(55, 65, 81);
    doc.text(
        `Overall Score: ${resultsData.assessment.percentage}%`,
        20,
        65
    );

    const riskLevel = getRiskLevel(resultsData.assessment.percentage);
    doc.text(`Risk Level: ${riskLevel.text}`, 20, 80);

    // Add section breakdown
    doc.setFontSize(14);
    doc.text("Section Breakdown:", 20, 100);

    let yPosition = 115;
    Object.entries(resultsData.assessment.sectionBreakdown).forEach(
        ([section, data]) => {
            doc.setFontSize(12);
            doc.text(
                `${section}: ${Math.round(data.percentage)}% (${data.score}/${data.maxScore
                })`,
                25,
                yPosition
            );
            yPosition += 15;
        }
    );

    // Add recommendations
    doc.setFontSize(14);
    doc.text("Recommendations:", 20, yPosition + 10);
    yPosition += 25;

    Object.entries(resultsData.assessment.sectionRecommendations).forEach(
        ([section, data]) => {
            doc.setFontSize(12);
            doc.setTextColor(55, 65, 81);
            doc.text(`${section}:`, 25, yPosition);
            yPosition += 15;

            data.recommendations.forEach((rec) => {
                const lines = doc.splitTextToSize(`• ${rec}`, 160);
                doc.text(lines, 30, yPosition);
                yPosition += lines.length * 10;
            });
            yPosition += 5;
        }
    );

    // Save the PDF
    doc.save("mental-health-assessment-results.pdf");
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
        // In production, you would navigate back to the assessment form
        window.location.href = "mentalHealth.html"; // or wherever your assessment form is
    }
}

// Expose action functions to global scope for HTML onclick handlers
window.downloadPDF = downloadPDF;
window.emailResults = emailResults;
window.shareResults = shareResults;
window.retakeAssessment = retakeAssessment;
window.closeModal = closeModal;
window.sendEmail = sendEmail;

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
    initializeResults();

    // Close modal when clicking outside of it
    window.addEventListener("click", function (event) {
        const modal = document.getElementById("emailModal");
        if (event.target === modal) {
            closeModal();
        }
    });
});