const OptionsContainer = ({minlen,
  questions,
  currentIndex,
  language,
  selectedAnswers,
  handleRadioChange,
  subjectiveAnswer,
  setSubjectiveAnswer
}) => {
  console.log("OptionsContainer props:", {
  questions,
  currentIndex,
  language,
  selectedAnswers
});

  const question = questions[currentIndex];

  return (
    <div id="optionsContainer" className="options-container">
      {/* Objective Questions */}
      {questions[currentIndex]?.type === "objective" &&
        questions[currentIndex]?.options?.map((opt) => (
          <label key={opt.key} className="radio-option">
            <input type="radio" name={`q-${currentIndex}`} value={opt.text?.[language]} checked={selectedAnswers[`q-${currentIndex}`] === opt.text?.[language]} onChange={handleRadioChange} />
            <span>{opt.text?.[language]}</span>
          </label>
        ))}
      {/* SUBJECTIVE QUESTIONS */}
      {questions[currentIndex]?.type === "subjective" && (
        <textarea
          className="form-input"
          placeholder="Write your answer..."
          minLength={minlen}
          value={subjectiveAnswer}
          onChange={(e) => setSubjectiveAnswer(e.target.value)}
        />
      )}
    </div>
  );
};

export default OptionsContainer;