import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/output.css";
import "../css/mentalhealth.css";
import logo from "../assets/logo.png";
import translations from "../utils/translation";
import { extractAllQuestions } from "../utils/Helper";

import FloatingShapes from "../components/FloatingShapes";
import Header from "../components/Header";
import LanguageSelector from "../components/LanguageSelector";
import UserForm from "../components/UserForm";
import LoadingOverlay from "../components/LoadingOverlay";
import QuestionContainer from "../components/QuestionContainer";


const BASE_API_URL = "https://hosla-api.onrender.com";
const SUBJECTIVE_MIN_CHARS = 3;

const MentalHealth = ({ showLoading, hideLoading }) => {

  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [responses, setResponses] = useState([]);
  const [hideForm, setHideForm] = useState(false);
  const [language, setLanguage] = useState("en");
  const [errorMsg, setErrorMsg] = useState("");
  const [subjectiveAnswer, setSubjectiveAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentSessionId] = useState(crypto.randomUUID());
  const totalQuestions = questions.length;
  const progressPercentage = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const currentQuestion = questions[currentIndex];

  const [userInfo, setUserInfo] = useState({
    createdAt: new Date().toISOString(),
    data: {},
    responses: []
  });

  // const [assessmentSessionId] = useState(crypto.randomUUID());
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // to load the previous answer from responses 
  useEffect(() => {
    const prevResponse = responses[currentIndex];

    if (prevResponse && currentQuestion?.type === "subjective") {
      setSubjectiveAnswer(prevResponse.answer);
    } else {
      setSubjectiveAnswer("");
    }
  }, [currentIndex, responses, currentQuestion]);
  
  // Handling radio buttons
  const handleRadioChange = (e) => {
    const { name, value } = e.target;

    setSelectedAnswers((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // form submition handling
  const submitForm = async (e) => {
    console.log("Form submit event triggered.");
    e.preventDefault();
    console.log("Default form submission prevented.");
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log("Form data:", data);

    // store user info
    setUserInfo((prev) => ({
      ...prev,
      data
    }));

    try {
      await getData();

    } catch (error) {
      console.error("API error:", error);
    }
  };

  // translation of language
  function translate(key, ...args) {
    const dict = translations[language] || translations.en;
    const val = dict[key];
    return typeof val === "function" ? val(...args) : val || key;
  }

  // question handling
  const getQuestions = async () => {
    const response = await fetch(`${BASE_API_URL}/api/mentalhealth/questions`);

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || `HTTP ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        "Failed to fetch questions: " + (result.message || "Unknown error")
      );
    }

    return result.data;
  };

  // getting question from api
  const getData = async () => {
    console.log("Fetching questions...");
    showLoading();
    try {
      const data = await getQuestions();
      console.log("Questions received:", data);
      const extractedQuestions = extractAllQuestions(data);
      console.log("Extracted Questions:", extractedQuestions);
      setHideForm(true);
      setQuestions(extractedQuestions);
      setCurrentIndex(0);
      setStartTime(Date.now());
    } catch (error) {
      console.error("Failed to load questions:", error);
      setErrorMsg("Failed to load questions. Please try again.");
    } finally {
      hideLoading();
    }
  };

  // handle next question
  const handleNext = () => {

    if (isSubmitting) return;

    const q = questions[currentIndex];
    if (!q) return;

    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);

    let selectedAnswer = null;

    // OBJECTIVE QUESTION
    if (q.type === "objective") {

      const selected = selectedAnswers[`q-${currentIndex}`];

      if (!selected) {
        setErrorMsg(translate("selectOption"));
        return;
      }

      selectedAnswer = selected;
    }

    // SUBJECTIVE QUESTION
    else {

      const val = subjectiveAnswer.trim();

      if (val === "") {
        setErrorMsg(translate("typeAnswer"));
        return;
      }

      if (val.length < SUBJECTIVE_MIN_CHARS) {
        setErrorMsg(translate("minChars", SUBJECTIVE_MIN_CHARS));
        return;
      }

      selectedAnswer = val;
    }

    setErrorMsg("");

    // Save to Google Sheet API
    saveResponseToSheet(q, selectedAnswer, timeTaken);

    // SAVE ANSWER
     const answerObj = {
      section: q.section,
      type: q.type === "objective" ? "Objective" : "Subjective",
      timeTakenSec: timeTaken
    };

    if (q.type === "subjective") {
      answerObj.questionId = q.questionId || `Q${currentIndex + 1}`;
      answerObj.answer = selectedAnswer;
    } else {
      answerObj.questionIndex =
        typeof q.questionIndex === "number"
          ? q.questionIndex
          : currentIndex;

      answerObj.selectedOption =
        q.options?.find(opt =>
          opt.text?.[language] === selectedAnswer ||
          opt.text?.en === selectedAnswer
        )?.key || selectedAnswer;
    }

    const updatedResponses = [...responses];
    updatedResponses[currentIndex] = answerObj;

    setResponses(updatedResponses);

    setStartTime(Date.now());

    // reset textarea for next question
    setSubjectiveAnswer("");

    // GO TO NEXT QUESTION
    if (currentIndex === questions.length - 1) {
      const finalResponses = {
        ...userInfo,
        responses: updatedResponses
      };
      console.log("Final responses:", finalResponses);
      console.log("Full responses:", JSON.stringify(updatedResponses, null, 2));
      submitAssessment(finalResponses);
    }
    // GO TO NEXT QUESTION
    else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // handle previous question
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // handle submit
  const handleSubmit = async (data) => {
    setTimeout(() => showLoading(), 0);
    const formData = data.data || {};
    const userId = formData.email || formData.name || `user_${Date.now()}`;

    const payload = {
      userAnswers: data.responses,
      userId,
      userName: formData.name || ""
    };
    
    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    console.log("Submitting payload:", payload);
    
    try {

      const response = await fetch(`${BASE_API_URL}/api/mentalhealth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log("API response:", result);
      if (!response.ok || result.statusCode !== 200) {
        throw new Error(result.message || "Submission failed");
      }
      return result;
    } catch (error) {
      console.error("Submission failed: ", error);
      alert("Submission failed. Please try again.");
    } finally {
      hideLoading();
    }
  };

  // assessment submission
  const submitAssessment = async (finalResponses) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await handleSubmit(finalResponses);
      if (!result) return;
      // Save result
      localStorage.setItem(
        "mh_assessment_result",
        JSON.stringify({
          ...result.data,
          userInfo: finalResponses.data
        })
      );
      // Redirect
      navigate("/result");
    } catch (error) {
      console.error("Final submission failed:", error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  // reset assessment
  const resetAssessment = () => {
    // Clear saved progress
    localStorage.removeItem("savedUserInfo");
    localStorage.removeItem("savedIndex");

    // Reset states
    setQuestions([]);
    setCurrentIndex(0);
    setStartTime(null);
    setResponses([]);
    setHideForm(false);
    setErrorMsg("");
    setSubjectiveAnswer("");
    setIsSubmitting(false);
    setSelectedAnswers({});

    setUserInfo({
      createdAt: new Date().toISOString(),
      data: {},
      responses: []
    });
  };

  // saving response
  const saveResponseToSheet = (questionData, answerValue, timeTakenSec) => {
    try {
      const q = questionData;
      const demographics = userInfo.data || {};

      const questionTextEn =
        typeof q.question === "object"
          ? q.question.en || ""
          : q.question || "";

      const payload = {
        sessionId: assessmentSessionId,
        section: q.section,
        questionType: q.type === "objective" ? "Objective" : "Subjective",
        questionId:
          q.type === "subjective"
            ? q.questionId || `Q${currentIndex + 1}`
            : String(q.questionIndex ?? currentIndex),

        questionTextEn: questionTextEn,

        criteria: Array.isArray(q.criteria)
          ? q.criteria.join(", ")
          : q.criteria || "",

        userAnswer: answerValue,
        selectedOptionText: "",
        timeTakenSec: timeTakenSec,
        language: language,
        questionWeight: q.weight || 0,

        userAgeSlab: demographics.ageSlab || "",
        userGender: demographics.gender || ""
      };

      // If objective question → get option text
      if (q.type === "objective" && q.options) {
        const matchedOpt = q.options.find((opt) => opt.key === answerValue);

        if (matchedOpt) {
          payload.selectedOptionText =
            typeof matchedOpt.text === "object"
              ? matchedOpt.text.en || ""
              : matchedOpt.text || "";
        }
      }
      console.log("Response prepared:", payload);
    } catch (err) {
      console.warn(
        "Error preparing sheet save payload (non-blocking):",
        err.message
      );
    }
  };


  return (
    <>
      {/* Floating Shapes */}
      <FloatingShapes />

      <div className="main-container">
        <div className={`form-card transition-all duration-300 ${hideForm ? "-translate-x-full opacity-0" : ""}`} id="container">

          {/* Header */}
          <Header logo={logo} translate={translate} />

          {/* Language Selector */}
          <LanguageSelector language={language} setLanguage={setLanguage} translate={translate} />

          {/* User Form */}
          {!hideForm && (
            <UserForm submitForm={submitForm} handleRadioChange={handleRadioChange} selectedAnswers={selectedAnswers} translate={translate} />
          )}

          {/* Question Container */}
          {questions.length > 0 && (
            <QuestionContainer minlen={SUBJECTIVE_MIN_CHARS} questions={questions} currentIndex={currentIndex} currentQuestion={currentQuestion} progressPercentage={progressPercentage} language={language} selectedAnswers={selectedAnswers} handleRadioChange={handleRadioChange} subjectiveAnswer={subjectiveAnswer} setSubjectiveAnswer={setSubjectiveAnswer} handlePrev={handlePrev} handleNext={handleNext} translate={translate} errorMsg={errorMsg} />
          )}

        </div>
      </div>

      {/* error messages */}
      {errorMsg && (
        <div className="error-message">
          {errorMsg}
        </div>
      )}

      {/* Loading */}
      <LoadingOverlay loading={isSubmitting} />
    </>
  );
};

export default MentalHealth;