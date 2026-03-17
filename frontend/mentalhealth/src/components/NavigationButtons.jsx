const NavigationButtons = ({
  currentIndex,
  handlePrev,
  handleNext,
  translate
}) => {
  return (
    <div className="navigation-buttons">
      {currentIndex > 0 && (
        <button id="prevBtn" className="prev-btn" onClick={handlePrev}>
          <i className="fas fa-arrow-left"></i>
          Previous
        </button>
      )}

      <button id="nextBtn" className="next-btn" onClick={handleNext}>
        {translate("next")}
        <i className="fas fa-arrow-right"></i>
      </button>

    </div>
  );
};

export default NavigationButtons;