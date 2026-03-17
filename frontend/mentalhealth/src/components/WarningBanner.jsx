const WarningBanner = ({ warningError }) => {
    if (warningError === null) return null;

    return (
        <div className="results-warning">
            <i className="fas fa-exclamation-triangle"></i>
            No recent assessment results found. Showing sample data.
            {warningError && (
                <>
                    <br />
                    <span id="warning-error">
                        Error: {warningError.message}
                    </span>
                </>
            )}
        </div>
    );
};

export default WarningBanner;