import ProgressBar from "./QuestionBar";
import OptionsContainer from "./OptionsContainer";
import NavigationButtons from "./NavigationButtons";

const QuestionContainer = ({minlen,questions,currentIndex,currentQuestion,progressPercentage,language,selectedAnswers,handleRadioChange,subjectiveAnswer,setSubjectiveAnswer,handlePrev,handleNext,translate,errorMsg}) => {
  
  return (
    <div id="questionContainer" className="question-container">
      {/* Progress bar */}
      <ProgressBar progressPercentage={progressPercentage} />

      <div id="progressText" style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600", color: "#667eea" }}>
        {questions.length > 0 && translate("progress", currentIndex + 1, questions.length)}
      </div>

      <h2 id="sectionHeading" className="section-heading">{currentQuestion?.section?.[language] || currentQuestion?.section}</h2>
      <h3 id="questionTypeTitle" className="question-type"></h3>
      <p id="questionText" className="question-text">{currentQuestion?.question?.[language]}</p>

      {/* Options container */}
      <OptionsContainer minlen={minlen} questions={questions} currentIndex={currentIndex} language={language} selectedAnswers={selectedAnswers} handleRadioChange={handleRadioChange} subjectiveAnswer={subjectiveAnswer} setSubjectiveAnswer={setSubjectiveAnswer} />

      {/* error message */}
      {errorMsg && (
        <p className="error-message">
          {errorMsg}
        </p>
      )}

      {/* navigation buttons */}
      <NavigationButtons currentIndex={currentIndex} handlePrev={handlePrev} handleNext={handleNext} translate={translate} />

    </div>
  );
};

export default QuestionContainer;