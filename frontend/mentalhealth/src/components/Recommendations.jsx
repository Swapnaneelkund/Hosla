import React from "react";

const Recommendations = ({ recommendationsData }) => {

    return (
        <div className="results-card">
            <div className="recommendations-section">
                <h2 className="section-title">
                    <i className="fas fa-lightbulb"></i>
                    Personalized Recommendations
                </h2>
                <div className="recommendations-grid">

                    {(!recommendationsData || Object.keys(recommendationsData).length === 0) && (
                        <div id="pers-recommend">
                            No personalized recommendations available.
                        </div>
                    )}

                    {Object.entries(recommendationsData).map(([sectionName, data]) => {

                        const priorityIcon =
                            data.priority === "high"
                                ? "fa-exclamation-circle"
                                : data.priority === "medium"
                                    ? "fa-info-circle"
                                    : "fa-check-circle";

                        return (
                            <div key={sectionName} className="recommendation-card">

                                <div className="recommendation-title">
                                    <i className={`fas ${priorityIcon}`}></i>
                                    {sectionName}
                                </div>

                                <div className="recommendation-text">
                                    Focus on improving this area for better overall well-being.
                                </div>

                                <div className="recommendation-actions">
                                    {data.recommendations?.map((rec, i) => (
                                        <span key={i} className="action-tag">
                                            {rec}
                                        </span>
                                    ))}
                                </div>

                                {data.why && data.why.length > 0 && (
                                    <div id="why">
                                        Why: {data.why.join(", ")}
                                    </div>
                                )}

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Recommendations;