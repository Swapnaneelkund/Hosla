const WarningBanner = ({ warningError }) => {
    if (warningError === null) return null;

    return (
        <div
            className="results-warning"
            style={{
                background: "#fff3cd",
                color: "#856404",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #ffeeba",
                fontWeight: 600
            }}
        >
            <i className="fas fa-exclamation-triangle" style={{ marginRight: "8px" }}></i>
            No recent assessment results found. Showing sample data.
            {warningError && (
                <>
                    <br />
                    <span style={{ fontSize: "12px", color: "#b8860b" }}>
                        Error: {warningError.message}
                    </span>
                </>
            )}
        </div>
    );
};

export default WarningBanner;