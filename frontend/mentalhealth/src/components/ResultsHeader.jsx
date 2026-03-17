import React from "react";
import ScoreOverview from "./ScoreOverview";
const ResultsHeader = ({ participantName, timestamp, timeTaken, evaluationSummary, scoreChartRef,
  scoreNumber,
  scoreLabel,
  scoreColor,
  activeScoreIndex,
  updateLegendActiveState,
  updateScoreDisplay,
  riskLevel,
  scoreMessage }) => {
    return (
        <div className="results-card">
            <div className="results-header">

                <h1 className="results-title">
                    Your Mental Health Assessment Results
                </h1>

                {/* Username */}
                {participantName && (
                    <div
                        className="participant-info"
                        id="participantInfo"
                    >
                        <div className="participant-avatar">
                            <i className="fas fa-user"></i>
                        </div>

                        <div className="participant-details">
                            <div className="participant-label">Assessment for</div>
                            <div className="participant-name" id="participantName">{participantName}</div>
                        </div>

                        <div className="participant-badge">
                            <i className="fas fa-check-circle"></i>
                            <span>Completed</span>
                        </div>
                    </div>
                )}

                <p className="results-timestamp" id="timestamp">{timestamp}</p>
                <p className="results-timestamp" id="timeTaken">{timeTaken}</p>

                <p
                    className="results-timestamp"
                    id="evaluationSummary"
                    style={{ display: "none", color: "#64748b", fontWeight: 600 }}
                >{evaluationSummary}</p>

            </div>

            {/* Score Overview */}
            <ScoreOverview
                scoreChartRef={scoreChartRef}
                scoreNumber={scoreNumber}
                scoreLabel={scoreLabel}
                scoreColor={scoreColor}
                activeScoreIndex={activeScoreIndex}
                updateLegendActiveState={updateLegendActiveState}
                updateScoreDisplay={updateScoreDisplay}
                riskLevel={riskLevel}
                scoreMessage={scoreMessage}
            />
        </div>
    )
}

export default ResultsHeader