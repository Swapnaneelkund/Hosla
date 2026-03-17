import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/mentalHealthResult.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Chart from "chart.js/auto";
import FloatingShapes from "../components/FloatingShapes";
import WarningBanner from "../components/WarningBanner";
import ResultsHeader from "../components/ResultsHeader";
import SectionBreakdown from "../components/SectionBreakdown";
import DetailedChart from "../components/DetailedChart";
import Recommendations from "../components/Recommendations";
import Resources from "../components/Resources";
import ActionButtons from "../components/ActionButtons";
import EmailModal from "../components/EmailModal";

const BASE_API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8000' : 'https://hosla-api.onrender.com';
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
const MentalHealthResult = () => {

  const navigate = useNavigate();

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [scoreChart, setScoreChart] = useState(null);
  const [detailedChart, setDetailedChart] = useState(null);
  const [activeScoreIndex, setActiveScoreIndex] = useState(0);
  const [warningError, setWarningError] = useState(null);
  const [timestamp, setTimestamp] = useState("");
  const [timeTaken, setTimeTaken] = useState("");
  const [scoreNumber, setScoreNumber] = useState("--");
  const [riskLevel, setRiskLevel] = useState(null);
  const [scoreMessage, setScoreMessage] = useState("");
  const [evaluationSummary, setEvaluationSummary] = useState("");
  const [participantName, setParticipantName] = useState(null);
  const [sections, setSections] = useState({});
  const [openSection, setOpenSection] = useState(null);
  const [recommendationsData, setRecommendationsData] = useState({});
  const [resourcesData, setResourcesData] = useState([]);
  const [scoreLabel, setScoreLabel] = useState("Overall Score");
  const [scoreColor, setScoreColor] = useState("#667eea");
  const [animateBars, setAnimateBars] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  
  const scoreChartRef = React.useRef(null);
  const detailedChartRef = React.useRef(null);

// Initialize results when page loads
  useEffect(() => {
    initializeResults();
  }, []);

  useEffect(() => {
    if (resultsData) {
      displayResults(resultsData);
      createScoreChart();
      createDetailedChart();
    }
  }, [resultsData]);

  // prevent memory leaks
  useEffect(() => {
    return () => {
      if (scoreChart) scoreChart.destroy();
      if (detailedChart) detailedChart.destroy();
    };
  }, []);

  useEffect(() => {
    if (sections && Object.keys(sections).length > 0) {
      const timer = setTimeout(() => {
        setAnimateBars(true);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [sections]);

  // Handle window resize for responsive chart
  useEffect(() => {
    const handleResize = () => {
      if (scoreChart) {
        scoreChart.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [scoreChart]);

  const initializeResults = () => {
    const stored = localStorage.getItem("mh_assessment_result");
    console.log("[MH] Raw localStorage value:", stored);

    let error = null;
    let data = null;

    if (stored) {
      try {
        data = JSON.parse(stored);
        console.log("[MH] Parsed localStorage JSON:", data);

        if (
          !data ||
          !data.assessment ||
          typeof data.assessment.percentage !== "number"
        ) {
          throw new Error("Invalid assessment data structure");
        }

        // clear storage after reading
        localStorage.removeItem("mh_assessment_result");

      } catch (e) {
        error = e;
        data = null;
      }
    }

    // fallback to sample data
    if (!data) {
      data = sampleResults;
      showNoResultsWarning(error);
    }

    // save to React state
    setResultsData(data);
  };
// warning message at the top of the page if no real results are found
  const showNoResultsWarning = (error) => {
    setWarningError(error);
  };

  const displayResults = (data) => {
    const assessment = data.assessment;

    // Validate required fields
    if (!assessment || typeof assessment.percentage !== "number" || !assessment.sectionBreakdown) {
      setScoreNumber("--");
      setScoreMessage("Unable to display results. Please retake the assessment.");
      setRiskLevel({ text: "Invalid data", class: "", icon: "" });
      return;
    }

    // Update timestamp
    setTimestamp(
      `Assessment completed on ${new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );

    // Calculate and display time taken
    if (data.userInfo && data.userInfo.createdAt) {
      const startTime = new Date(data.userInfo.createdAt);
      const endTime = new Date();
      const timeDiff = Math.abs(endTime - startTime);
      const minutes = Math.floor(timeDiff / 60000);
      const seconds = ((timeDiff % 60000) / 1000).toFixed(0);
      setTimeTaken(`Time Taken: ${minutes}m ${seconds}s`);
    }

    // Update overall score
    setScoreNumber(`${assessment.percentage}%`);

    // Update risk level
    const risk = getRiskLevel(assessment.percentage);
    setRiskLevel(risk);

    // Update message
    setScoreMessage(data.message);

    // Evaluation summary
    const meta = assessment.evaluationMeta || {};
    const methodUsage = meta.subjectiveMethodUsage || {};
    const parts = [];

    if (typeof methodUsage.llm === "number" || typeof methodUsage.fallback === "number") {
      parts.push(`Subjective: LLM ${methodUsage.llm || 0}, Fallback ${methodUsage.fallback || 0}`);
    }

    if (meta.timing && typeof meta.timing.averageTimeSec === "number") {
      parts.push(`Avg time/question: ${meta.timing.averageTimeSec}s`);
    }

    if (assessment.modelId) {
      parts.push(`Model: ${assessment.modelId}`);
    }

    setEvaluationSummary(parts.join(" | "));

    // Call existing functions
    displayParticipantInfo(data);
    displaySectionBreakdown(assessment.sectionBreakdown);
    displayRecommendations(assessment.sectionRecommendations);
    displayResources(assessment.percentage);
  };

  const getRiskLevel = (percentage) => {
    if (percentage >= 85) {
      return { text: "Excellent", class: "risk-excellent", icon: "fa-star" };
    } else if (percentage >= 70) {
      return { text: "Good", class: "risk-good", icon: "fa-thumbs-up" };
    } else if (percentage >= 55) {
      return { text: "Moderate", class: "risk-moderate", icon: "fa-balance-scale" };
    } else {
      return { text: "Needs Attention", class: "risk-attention", icon: "fa-exclamation-triangle" };
    }
  };

  const displayParticipantInfo = (data) => {
    const name = data.userName || (data.data && data.data.name) || null;

    if (name) {
      setParticipantName(name);
    } else {
      setParticipantName(null);
    }
  };

  const displaySectionBreakdown = (sectionsData) => {
    setSections(sectionsData || {});
  };

  const renderSectionDetails = (sectionData) => {
    const items = sectionData.questionDetails || [];

    if (!items.length) {
      return (
        <div style={{ color: "#64748b" }}>
          No question-level details available.
        </div>
      );
    }

    return (
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {items.map((q, index) => {
          const matched = Array.isArray(q.matchedCriteria)
            ? q.matchedCriteria.length
            : 0;

          const missing = Array.isArray(q.missingCriteria)
            ? q.missingCriteria.length
            : 0;

          return (
            <li
              key={index}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div style={{ fontWeight: 600, color: "#374151" }}>
                {q.question || ""}
              </div>

              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {q.type} • {q.score}/{q.maxScore}
                {q.percentage ? ` • ${q.percentage}%` : ""}
              </div>

              {q.type === "Objective" ? (
                <>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#374151",
                      marginTop: "4px",
                    }}
                  >
                    Selected: <b>{q.selectedOption || "-"}</b>
                  </div>

                  {q.details && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "2px",
                      }}
                    >
                      {q.details}
                    </div>
                  )}

                  {typeof q.timeTakenSec === "number" && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        marginTop: "2px",
                      }}
                    >
                      Time: {q.timeTakenSec}s
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#374151",
                      marginTop: "4px",
                    }}
                  >
                    Criteria matched: <b>{matched}</b>
                    {missing ? ` (missing ${missing})` : ""}
                  </div>

                  {q.explanation && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "2px",
                      }}
                    >
                      {q.explanation}
                    </div>
                  )}

                  {q.method && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        marginTop: "2px",
                      }}
                    >
                      Method: {q.method}
                    </div>
                  )}

                  {q.confidence && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        marginTop: "2px",
                      }}
                    >
                      Confidence:{" "}
                      {q.confidence === "deterministic"
                        ? "High (deterministic)"
                        : "Variable (LLM-based)"}
                    </div>
                  )}

                  {typeof q.timeTakenSec === "number" && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        marginTop: "2px",
                      }}
                    >
                      Time: {q.timeTakenSec}s
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const escapeHtml = (str) => {
    return String(str).replace(/[&<>"]/g, (s) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    }[s]));
  };

  const displayRecommendations = (recommendations) => {
    setRecommendationsData(recommendations || {});
  };

  const displayResources = (score) => {
    const resources = [
      {
        icon: "fa-phone",
        title: "Hosla emergency Helpline",
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

    setResourcesData(resources);
  };

  const calculateSubjectiveObjectiveScores = (sectionBreakdown) => {
    let totalSubjectiveScore = 0;
    let maxSubjectiveScore = 0;
    let totalObjectiveScore = 0;
    let maxObjectiveScore = 0;

    // Iterate through each section to sum up subjective and objective scores
    Object.entries(sectionBreakdown).forEach(([sectionName, sectionData]) => {
      if (sectionData.questionDetails) {
        sectionData.questionDetails.forEach((question) => {
          if (question.type === "Subjective") {
            totalSubjectiveScore += question.score || 0;
            maxSubjectiveScore += question.maxScore || 0;
          } else if (question.type === "Objective") {
            totalObjectiveScore += question.score || 0;
            maxObjectiveScore += question.maxScore || 0;
          }
        });
      }
    });

    const subjectivePercentage =
      maxSubjectiveScore > 0
        ? Math.round((totalSubjectiveScore / maxSubjectiveScore) * 100)
        : 0;

    const objectivePercentage =
      maxObjectiveScore > 0
        ? Math.round((totalObjectiveScore / maxObjectiveScore) * 100)
        : 0;

    return {
      subjective: {
        score: totalSubjectiveScore,
        maxScore: maxSubjectiveScore,
        percentage: subjectivePercentage,
      },
      objective: {
        score: totalObjectiveScore,
        maxScore: maxObjectiveScore,
        percentage: objectivePercentage,
      },
    };
  };

  const updateScoreDisplay = (index) => {
    if (typeof index !== "number" || index < 0 || index > 2) {
      console.warn("Invalid index for updateScoreDisplay:", index);
      return;
    }

    const overallPercentage = resultsData.assessment.percentage;

    let subjectivePercentage, objectivePercentage;

    if (resultsData.assessment.questionTypeBreakdown) {
      subjectivePercentage =
        resultsData.assessment.questionTypeBreakdown.subjective.percentage;
      objectivePercentage =
        resultsData.assessment.questionTypeBreakdown.objective.percentage;
    } else {
      const scores = calculateSubjectiveObjectiveScores(
        resultsData.assessment.sectionBreakdown
      );
      subjectivePercentage = scores.subjective.percentage;
      objectivePercentage = scores.objective.percentage;
    }

    const labels = ["Overall Score", "Subjective Score", "Objective Score"];
    const values = [overallPercentage, subjectivePercentage, objectivePercentage];
    const colors = ["#667eea", "#ffc107", "#28a745"];

    if (isNaN(values[index])) {
      console.warn("Invalid value for index", index, ":", values[index]);
      return;
    }

    setScoreNumber(`${Math.round(values[index])}%`);
    setScoreLabel(labels[index]);
    setScoreColor(colors[index]);

    if (scoreChart && scoreChart.data && scoreChart.data.datasets[0]) {
      scoreChart.data.datasets[0].offset = [0, 0, 0];
      scoreChart.data.datasets[0].offset[index] = 25;
      scoreChart.update("none");
    }
  };

  const updateLegendActiveState = (activeIndex) => {
    setActiveScoreIndex(activeIndex);
  };

  const createScoreChart = () => {
    try {
      if (!scoreChartRef.current) return;
      const ctx = scoreChartRef.current.getContext("2d");

      const overallPercentage = resultsData.assessment.percentage;

      let subjectivePercentage = 0;
      let objectivePercentage = 0;

      if (resultsData.assessment.questionTypeBreakdown) {
        subjectivePercentage =
          resultsData.assessment.questionTypeBreakdown.subjective.percentage;
        objectivePercentage =
          resultsData.assessment.questionTypeBreakdown.objective.percentage;
      } else {
        const scores = calculateSubjectiveObjectiveScores(
          resultsData.assessment.sectionBreakdown
        );
        subjectivePercentage = scores.subjective.percentage;
        objectivePercentage = scores.objective.percentage;
      }

      if (scoreChart) {
        scoreChart.destroy();
      }

      const colors = {
        overall: {
          background: "rgba(102, 126, 234, 0.85)",
          border: "rgba(102, 126, 234, 1)",
          hover: "rgba(102, 126, 234, 0.95)"
        },
        subjective: {
          background: "rgba(255, 193, 7, 0.85)",
          border: "rgba(255, 193, 7, 1)",
          hover: "rgba(255, 193, 7, 0.95)"
        },
        objective: {
          background: "rgba(40, 167, 69, 0.85)",
          border: "rgba(40, 167, 69, 1)",
          hover: "rgba(40, 167, 69, 0.95)"
        }
      };

      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Overall Score", "Subjective Score", "Objective Score"],
          datasets: [
            {
              data: [overallPercentage, subjectivePercentage, objectivePercentage],
              backgroundColor: [
                colors.overall.background,
                colors.subjective.background,
                colors.objective.background
              ],
              borderColor: [
                colors.overall.border,
                colors.subjective.border,
                colors.objective.border
              ],
              hoverBackgroundColor: [
                colors.overall.hover,
                colors.subjective.hover,
                colors.objective.hover
              ],
              borderWidth: 3,
              cutout: "68%",
              offset: [25, 0, 0],
              borderRadius: 6,
              spacing: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          onHover: (event, activeElements, chart) => {
            if (activeElements.length > 0) {
              const hoveredIndex = activeElements[0].index;

              updateScoreDisplay(hoveredIndex);
              updateLegendActiveState(hoveredIndex);

              chart.data.datasets[0].offset = [0, 0, 0];
              chart.data.datasets[0].offset[hoveredIndex] = 30;
              chart.update();
            }
          },
          onClick: (event, activeElements) => {
            if (activeElements.length > 0) {
              const idx = activeElements[0].index;
              setActiveScoreIndex(idx);
              updateScoreDisplay(idx);
            }
          }
        }
      });

      setScoreChart(chart);

      updateScoreDisplay(activeScoreIndex);

    } catch (error) {
      console.error("Error creating score chart:", error);
      setScoreNumber(resultsData.assessment.percentage + "%");
    }
  };

  const createDetailedChart = () => {
    try {
      if (!resultsData || !detailedChartRef.current) return;

      const ctx = detailedChartRef.current.getContext("2d");
      const sections = resultsData.assessment.sectionBreakdown;

      if (!sections) throw new Error("No section data");

      const labels = Object.keys(sections);
      const data = Object.values(sections).map(
        (section) => section.percentage
      );

      // destroy old chart if exists
      if (detailedChart) {
        detailedChart.destroy();
      }

      const chart = new Chart(ctx, {
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
              borderSkipped: false
            }
          ]
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
                }
              }
            },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 0
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.parsed.y}%`;
                }
              }
            }
          }
        }
      });

      setDetailedChart(chart);

    } catch (e) {
      console.error("Detailed chart error:", e);
    }
  };

  // did not place createCustomLegend

  const downloadPDF = () => {
    if (!resultsData || !resultsData.assessment) return;
    const doc = new jsPDF();
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
    const addColoredRect = (x, y, width, height, color) => {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(x, y, width, height, "F");
    };
    const addSectionDivider = (y, title) => {
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(0.5);
      doc.line(20, y, 190, y);
      doc.setFontSize(14);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFont(undefined, "bold");
      doc.text(title, 20, y + 10);
      return y + 20;
    };
    let currentY = 20;
    addColoredRect(0, 0, 210, 50, [230, 235, 250]);
    doc.setFontSize(24);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont(undefined, "bold");
    doc.text("Mental Health Assessment", 20, 25);
    doc.text("Results Report", 20, 35);
    doc.setFontSize(12);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    doc.text(`Generated on: ${currentDate}`, 20, 45);
    const participantName =
      resultsData.userName ||
      (resultsData.data && resultsData.data.name) ||
      "Anonymous";
    if (participantName !== "Anonymous") {
      doc.text(`Participant: ${participantName}`, 120, 45);
    }
    currentY = 65;
    const score = resultsData.assessment.percentage;
    doc.setFontSize(20);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    const scoreText = `${score}%`;
    const scoreWidth = doc.getTextWidth(scoreText);
    doc.text(scoreText, 50 - scoreWidth / 2, currentY);
    doc.setFontSize(14);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.text(
      `Total Score: ${resultsData.assessment.totalScore}/${resultsData.assessment.maxScore}`,
      80,
      currentY
    );
    currentY += 30;
    currentY = addSectionDivider(currentY, "SECTION BREAKDOWN");
    const sections = resultsData.assessment.sectionBreakdown;
    Object.entries(sections).forEach(([sectionName, data]) => {
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(12);
      doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
      doc.setFont(undefined, "bold");
      doc.text(sectionName, 25, currentY);
      doc.setFont(undefined, "normal");
      doc.text(`${data.score}/${data.maxScore}`, 120, currentY);
      doc.text(`${Math.round(data.percentage)}%`, 170, currentY);
      currentY += 15;
    });
    doc.addPage();
    doc.setFontSize(18);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text("Personalized Recommendations", 20, 20);
    currentY = 40;
    const recommendations = resultsData.assessment.sectionRecommendations;
    if (recommendations) {
      Object.entries(recommendations).forEach(([sectionName, data]) => {
        doc.setFontSize(14);
        doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
        doc.text(sectionName, 20, currentY);
        currentY += 10;
        data.recommendations?.forEach((rec) => {
          const lines = doc.splitTextToSize(rec, 160);
          doc.text("• " + lines, 25, currentY);
          currentY += lines.length * 6;
        });
        currentY += 10;
      });
    }
    const fileName =
      participantName !== "Anonymous"
        ? `${participantName.replace(/\s+/g, "_")}_Mental_Health_Assessment.pdf`
        : "Mental_Health_Assessment_Results.pdf";
    doc.save(fileName);
  };

  // const downloadPDFWithCharts = async () => {
  //   if (!resultsData) return;

  //   const doc = new jsPDF();

  //   // Create the basic report
  //   doc.setFontSize(24);
  //   doc.text("Mental Health Assessment Results", 20, 20);

  //   doc.setFontSize(12);
  //   doc.text(`Score: ${resultsData.assessment.percentage}%`, 20, 40);

  //   // Capture the chart canvas
  //   if (scoreChartRef.current) {
  //     const canvas = scoreChartRef.current;

  //     const imgData = canvas.toDataURL("image/png");

  //     // Add chart image to PDF
  //     doc.addImage(imgData, "PNG", 20, 60, 160, 100);
  //   }

  //   // If you also want the detailed chart
  //   if (detailedChartRef.current) {
  //     const canvas = detailedChartRef.current;
  //     const imgData = canvas.toDataURL("image/png");

  //     doc.addPage();
  //     doc.text("Detailed Section Analysis", 20, 20);

  //     doc.addImage(imgData, "PNG", 20, 40, 160, 100);
  //   }

  //   const participantName =
  //     resultsData.userName ||
  //     (resultsData.data && resultsData.data.name) ||
  //     "Assessment";

  //   const fileName = `${participantName.replace(/\s+/g, "_")}_Assessment.pdf`;

  //   doc.save(fileName);
  // };

  const emailResults = () => {
    setShowEmailModal(true);
  };

  const shareResults = async () => {
    if (!resultsData || !resultsData.assessment) return;

    const shareText = `I completed a mental health assessment and scored ${resultsData.assessment.percentage}%. Check out the detailed results!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mental Health Assessment Results",
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.error("Share cancelled or failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert("Results link has been copied to clipboard!");
      } catch (err) {
        alert("Failed to copy link to clipboard.");
        console.error(err);
      }
    }
  };

  const retakeAssessment = () => {
    const confirmRestart = window.confirm(
      "Are you sure you want to start a new assessment? This will clear your current results."
    );

    if (confirmRestart) {
      localStorage.removeItem("mh_assessment_result");
      navigate("/");
    }
  };

  const closeModal = () => {
    setShowEmailModal(false);
  };

  const sendEmail = async () => {
    if (!emailAddress) {
      alert("Please enter an email address");
      return;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/api/email/send-results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: emailAddress,
          message: emailMessage,
          results: resultsData
        })
      });

      const data = await response.json();

      if (data.success) {
        alert("Results have been sent to " + emailAddress);
        closeModal();
        setEmailAddress("");
        setEmailMessage("");
      } else {
        alert("Failed to send email: " + (data.error || "Unknown error"));
      }

    } catch (err) {
      alert("Error sending email: " + err.message);
    }
  };

  return (
  <div className="mental-health-page">

    {warningError !== null && (
      <WarningBanner warningError={warningError}/>
    )}

    {/* Floating Shapes */}
    <FloatingShapes/>

    <div className="main-container">

      {/* Results Header */}
      <ResultsHeader participantName={participantName}
        timestamp={timestamp}
        timeTaken={timeTaken}
        evaluationSummary={evaluationSummary}
        scoreChartRef={scoreChartRef}
        scoreNumber={scoreNumber}
        scoreLabel={scoreLabel}
        scoreColor={scoreColor}
        activeScoreIndex={activeScoreIndex}
        updateLegendActiveState={updateLegendActiveState}
        updateScoreDisplay={updateScoreDisplay}
        riskLevel={riskLevel}
        scoreMessage={scoreMessage}/>

      {/* Section Breakdown */}
      <SectionBreakdown 
        sections={sections}
        openSection={openSection}
        setOpenSection={setOpenSection}
        animateBars={animateBars}
        renderSectionDetails={renderSectionDetails}
      />

      {/* Detailed Chart */}
      <DetailedChart detailedChartRef={detailedChartRef} />

      {/* Recommendations */}
      <Recommendations recommendationsData={recommendationsData} />

      {/* Resources */}
      <Resources resourcesData={resourcesData} />

      {/* Buttons */}
      <ActionButtons
        downloadPDF={downloadPDF}
        emailResults={emailResults}
        shareResults={shareResults}
        retakeAssessment={retakeAssessment}
      />
    </div>
    {/* Email Modal */}
    <EmailModal
      showEmailModal={showEmailModal}
      closeModal={closeModal}
      emailAddress={emailAddress}
      setEmailAddress={setEmailAddress}
      emailMessage={emailMessage}
      setEmailMessage={setEmailMessage}
      sendEmail={sendEmail}
    />
  </div>
  );
};

export default MentalHealthResult;