const ProgressBar = ({ progressPercentage }) => {
  return (
    <div className="progress-bar">
      <div className="progress-fill" id="progressFill" style={{ width: `${progressPercentage}%` }}>
      </div>
    </div>
  );
};

export default ProgressBar;