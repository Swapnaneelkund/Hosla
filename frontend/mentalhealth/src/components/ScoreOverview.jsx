import React from "react";

const ScoreOverview = ({
    scoreChartRef,
    scoreNumber,
    scoreLabel,
    scoreColor,
    activeScoreIndex,
    updateLegendActiveState,
    updateScoreDisplay,
    riskLevel,
    scoreMessage
}) => {

    const labels = ["Overall Score", "Subjective Score", "Objective Score"];
    return (
        <div className="score-overview">
            <div className="score-circle">
                <canvas ref={scoreChartRef}></canvas>
                <div className="score-display">
                    <div className="score-number" id="scoreNumber" style={{ color: scoreColor }}>{scoreNumber}</div>
                    <div className="score-label" style={{ color: scoreColor }}>{scoreLabel}</div>
                </div>
            </div>

            {/* Legend goes here */}
            <div className="chart-legend">
                {["Overall Score", "Subjective Score", "Objective Score"].map((label, index) => (
                    <div
                        key={index}
                        onClick={() => { updateLegendActiveState(index); updateScoreDisplay(index); }}
                        style={{
                            background:
                                index === activeScoreIndex
                                    ? "rgba(102, 126, 234, 0.1)"
                                    : "rgba(255, 255, 255, 0.9)",
                            borderColor:
                                index === activeScoreIndex
                                    ? "rgba(102, 126, 234, 0.3)"
                                    : "rgba(0, 0, 0, 0.08)",
                            transform:
                                index === activeScoreIndex
                                    ? "translateY(-2px) scale(1.05)"
                                    : "translateY(0) scale(1)"
                        }}
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="risk-assessment">
                <div id="riskLevel" className={`risk-level ${riskLevel?.class}`}>
                    {riskLevel && (
                        <>
                            <i className={`fas ${riskLevel.icon}`}></i>
                            <span>{riskLevel.text}</span>
                        </>
                    )}
                </div>

                <p className="score-message" id="scoreMessage">
                    {scoreMessage}
                </p>
            </div>

        </div>
    )
}
export default ScoreOverview;