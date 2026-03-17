import React from "react";

const ActionButtons = ({
    downloadPDF,
    emailResults,
    shareResults,
    retakeAssessment
}) => {

    return (
        <div className="results-card">
            <div className="actions-section">
                <button id="downloadPdfBtn" className="action-btn btn-primary" onClick={downloadPDF}>
                    <i className="fas fa-download"></i>
                    Download PDF Report
                </button>
                <button id="emailResultsBtn" className="action-btn btn-secondary" onClick={emailResults}>
                    <i className="fas fa-envelope"></i>
                    Email Results
                </button>
                <button id="shareResultsBtn" className="action-btn btn-tertiary" onClick={shareResults}>
                    <i className="fas fa-share-alt"></i>
                    Share with Provider
                </button>
                <button id="retakeAssessmentBtn" className="action-btn btn-primary" onClick={retakeAssessment}>
                    <i className="fas fa-redo"></i>
                    Retake Assessment
                </button>
            </div>
        </div>
    )
}

export default ActionButtons;