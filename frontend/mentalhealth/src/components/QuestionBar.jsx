const ProgressBar = ({ progressPercentage }) => {
  return (
    <div className="progress-bar">
      <div id="progressFill" className="progress-fill w-[var(--progress-percentage)]"></div>
    </div>
  );
};

export default ProgressBar;