import React from "react";

const SectionBreakdown = ({
    sections,
    openSection,
    setOpenSection,
    animateBars,
    renderSectionDetails
}) => {

    return (
        <div className="results-card">
            <div className="section-breakdown">

                <h2 className="section-title">
                    <i className="fas fa-chart-bar"></i>
                    Section Breakdown
                </h2>

                <div className="section-grid">

                    {(!sections || Object.keys(sections).length === 0) && (
                        <div id="section-data">
                            No section data available.
                        </div>
                    )}

                    {Object.entries(sections).map(([sectionName, data]) => {

                        const detailsId = `details_${sectionName.replace(/\s+/g, "_")}`;
                        const isOpen = openSection === detailsId;

                        return (
                            <div key={sectionName} className="section-item">

                                <div className="section-name">{sectionName}</div>

                                <div className="section-score">
                                    <span className="section-percentage">
                                        {Math.round(data.percentage)}%
                                    </span>

                                    <span id="data-score">
                                        {data.score}/{data.maxScore}
                                    </span>
                                </div>

                                <div className="section-bar">
                                    <div
                                    className="bg-blue-500 h-2 rounded transition-all duration-500"
                                    style={{ width: animateBars ? `${data.percentage}%` : "0%" }}
                                    ></div>
                                </div>

                                <button
                                    className="section-details-toggle"
                                    onClick={() =>
                                        setOpenSection(isOpen ? null : detailsId)
                                    }
                                >
                                    {isOpen ? "Hide details" : "View details"}
                                </button>

                                {isOpen && (
                                    <div className="section-details">
                                        {renderSectionDetails(data)}
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

export default SectionBreakdown;