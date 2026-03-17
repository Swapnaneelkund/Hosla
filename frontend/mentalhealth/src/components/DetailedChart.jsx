import React from "react";

const DetailedChart = ({ detailedChartRef }) => {
    return (
        <div className="results-card">
            <div className="chart-container">
                <h3 className="chart-title">
                    Detailed Section Analysis
                </h3>
                <canvas ref={detailedChartRef}></canvas>
            </div>
        </div>
    )
}

export default DetailedChart;