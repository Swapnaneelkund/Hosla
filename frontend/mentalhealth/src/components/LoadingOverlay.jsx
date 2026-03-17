const LoadingOverlay = ({ loading }) => {

    if (!loading) return null;

    return (
        <div id="loadingOverlay" className="loading-overlay loading-overlay--hidden">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export default LoadingOverlay;