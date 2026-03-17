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
                        <div style={{ color: "#b91c1c", fontWeight: 600 }}>
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

                                    <span style={{ color: "#64748b", fontSize: "14px" }}>
                                        {data.score}/{data.maxScore}
                                    </span>
                                </div>

                                <div className="section-bar">
                                    <div
                                        className="section-fill"
                                        style={{ width: animateBars ? `${data.percentage}%` : "0%" }}
                                    ></div>
                                </div>

                                <button
                                    className="section-details-toggle"
                                    style={{
                                        marginTop: "8px",
                                        background: "#eef2ff",
                                        color: "#4338ca",
                                        border: "none",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        fontWeight: 600,
                                        cursor: "pointer"
                                    }}
                                    onClick={() =>
                                        setOpenSection(isOpen ? null : detailsId)
                                    }
                                >
                                    {isOpen ? "Hide details" : "View details"}
                                </button>

                                {isOpen && (
                                    <div
                                        className="section-details"
                                        style={{
                                            marginTop: "10px",
                                            borderTop: "1px dashed #e5e7eb",
                                            paddingTop: "10px"
                                        }}
                                    >
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