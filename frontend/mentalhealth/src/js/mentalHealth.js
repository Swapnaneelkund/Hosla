const BASE_API_URL = "http://localhost:8000";

const form = document.getElementById("userForm");
const container = document.getElementById("form-container");
const questionContainer = document.getElementById("questionContainer");
const questionText = document.getElementById("questionText");
const sectionHeading = document.getElementById("sectionHeading");
const nextBtn = document.getElementById("nextBtn");
const optionsContainer = document.getElementById("optionsContainer");
const errorMsg = document.getElementById("errorMsg");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
const languageSelect = document.getElementById("languageSelect");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const loadingOverlay = document.getElementById("loadingOverlay");

let questions = [];
let currentIndex = 0;
let startTime = null;
let selectedLanguage = "en";
let userInfo = { createdAt: new Date().toISOString(), data: {}, responses: [] };
document.addEventListener("change", function (e) {
  if (e.target.type === "radio") {
    const groupName = e.target.name;
    document.querySelectorAll(`input[name="${groupName}"]`).forEach((radio) => {
      radio.closest(".radio-option").classList.remove("selected");
    });
    e.target.closest(".radio-option").classList.add("selected");
  }
});
const translations = {
  en: {
    formTitle: "Mental Health Prediction",
    formHelper: "For seniors (50+). Please fill the form below.",
    name: "Full Name",
    email: "Email",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    address: "Address",
    phone: "Phone Number",
    ageRange: "Age Range",
    selectAge: "Select age range",
    submit: "Start Assessment",
    language: "Language:",
    next: "Next",
    thankYou: "Thank you! Submitting your answers...",
    selectOption: "Please select an option before proceeding.",
    typeAnswer: "Please type your answer before proceeding.",
    progress: (current, total) => `Question ${current} of ${total}`,
  },
  hi: {
    formTitle: "मानसिक स्वास्थ्य मूल्यांकन",
    formHelper: "वरिष्ठ नागरिकों (50+) के लिए। कृपया नीचे फॉर्म भरें।",
    name: "पूरा नाम",
    email: "ईमेल",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    address: "पता",
    phone: "फ़ोन नंबर",
    ageRange: "आयु सीमा",
    selectAge: "आयु सीमा चुनें",
    submit: "मूल्यांकन शुरू करें",
    language: "भाषा:",
    next: "आगे",
    thankYou: "धन्यवाद! आपके उत्तर सबमिट किए जा रहे हैं... ",
    selectOption: "कृपया आगे बढ़ने से पहले एक विकल्प चुनें।",
    typeAnswer: "कृपया आगे बढ़ने से पहले उत्तर लिखें।",
    progress: (current, total) => `प्रश्न ${current} / ${total}`,
  },
  bn: {
    formTitle: "মানসিক স্বাস্থ্য মূল্যায়ন",
    formHelper: "বয়স্কদের (৫০+) জন্য। নিচের ফর্মটি পূরণ করুন।",
    name: "পূর্ণ নাম",
    email: "ইমেইল",
    gender: "লিঙ্গ",
    male: "পুরুষ",
    female: "মহিলা",
    other: "অন্যান্য",
    address: "ঠিকানা",
    phone: "ফোন নম্বর",
    ageRange: "বয়সের পরিসর",
    selectAge: "বয়সের পরিসর নির্বাচন করুন",
    submit: "মূল্যায়ন শুরু করুন",
    language: "ভাষা:",
    next: "পরবর্তী",
    thankYou: "ধন্যবাদ! আপনার উত্তর জমা দেওয়া হচ্ছে... ",
    selectOption: "অনুগ্রহ করে একটি অপশন নির্বাচন করুন।",
    typeAnswer: "অনুগ্রহ করে উত্তর লিখুন।",
    progress: (current, total) => `প্রশ্ন ${current} / ${total}`,
  },
};
function t(key, ...args) {
  const dict = translations[selectedLanguage] || translations.en;
  const val = dict[key];
  return typeof val === "function" ? val(...args) : val || key;
}
function updateStaticText() {
  document.title = t("formTitle");
  document.querySelector(".main-title").textContent = t("formTitle");
  document.querySelector(".subtitle").textContent = t("formHelper");
  document.querySelector('label[for="name"]').textContent = t("name");
  document.querySelector('label[for="email"]').textContent = t("email");
  document.querySelector('label[for="address"]').textContent = t("address");
  document.querySelector('label[for="number"]').textContent = t("phone");
  document.querySelector('label[for="ageSlab"]').textContent = t("ageRange");
  const genderLabel = document.querySelector(".form-label");
  if (genderLabel && genderLabel.textContent.includes("Gender")) {
    genderLabel.textContent = t("gender");
  }
  document.querySelectorAll(".radio-option span").forEach((span, index) => {
    if (index === 0) span.textContent = t("male");
    if (index === 1) span.textContent = t("female");
  });
  document.querySelector(".submit-btn").innerHTML = `
  ${t("submit")}
  <i class="fas fa-arrow-right"></i>
  `;
  document.querySelector('label[for="languageSelect"]').innerHTML = `
  <i class="fas fa-globe"></i> ${t("language")}
            `;
}
if (languageSelect) {
  languageSelect.addEventListener("change", (e) => {
    selectedLanguage = e.target.value;
    updateStaticText();
    if (questions.length > 0) {
      displayQuestions(questions, currentIndex);
    }
  });
  updateStaticText();
}
if (form) {
  form.addEventListener("submit", function (e) {
    console.log("Form submit event triggered.");
    e.preventDefault();
    console.log("Default form submission prevented.");
    const formData = new FormData(form);
    userInfo.data = Object.fromEntries(formData);
    container.style.transform = "translateX(-100%)";
    container.style.opacity = "0";
    setTimeout(() => {
      getData();
    }, 300);
  });
}

function showLoading() {
  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  loadingOverlay.classList.add("hidden");
}

// Replace getData to fetch questions from backend
function getData() {
  console.log("getData: Initiating fetch for questions...");
  showLoading();
  fetch(`${BASE_API_URL}/api/mentalhealth/questions`)
    .then((res) => {
      console.log("getData: Received response from backend.");
      hideLoading();
      if (!res.ok) {
        return res.text().then((msg) => {
          throw new Error(msg || `HTTP ${res.status}`);
        });
      }
      return res.json();
    })
    .then((result) => {
      console.log("getData: Successfully parsed JSON result.", result);
      if (!result.success || !result.data) {
        console.error("getData: Backend response indicates failure or missing data.", result);
        throw new Error("Failed to fetch questions from backend: " + (result.message || "Unknown error"));
      }
      // Use backend questions
      questions = extractAllQuestions(result.data);
      console.log("getData: Questions extracted.", questions);
      displayQuestions(questions, 0);
    })
    .catch((err) => {
      console.error("getData: Fetch or processing error.", err);
      hideLoading();
      questionContainer.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 30px;">
          <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ef4444; margin-bottom: 20px;"></i>
          <h3 style="color: #ef4444; margin-bottom: 15px;">Failed to Load Questions</h3>
          <p style="color: #6b7280; margin-bottom: 20px;">${err.message}</p>
          <button onclick="resetAssessment()" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">Try Again</button>
        </div>
      `;
    });
}

function displayQuestions(data, index = 0) {
  console.log("displayQuestions: Function called.");
  container.style.display = "none";
  questionContainer.classList.remove("hidden");
  questions = data;
  startTime = Date.now();
  showQuestion(index);
  updateProgress(index);
}

function updateProgress(index) {
  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  if (!progressBar && !progressFill && !progressText) return;

  const total = questions.length;
  const percentage = ((index + 1) / total) * 100;

  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }

  if (progressText) {
    progressText.textContent = t("progress", index + 1, total);
  }

  if (progressBar) {
    progressBar.textContent = t("progress", index + 1, total);
  }
}

// In extractAllQuestions, use backend's question id for subjective
function extractAllQuestions(data) {
  const all = [];
  for (const section in data) {
    ["Subjective", "Objective"].forEach((type) => {
      if (Array.isArray(data[section][type])) {
        data[section][type].forEach((q, idx) => {
          const newQ = {
            ...q,
            section,
            type: type.toLowerCase(),
          };
          if (type.toLowerCase() === "subjective") {
            newQ.questionId = q.id || `Q${idx + 1}`;
          }
          if (type.toLowerCase() === "objective") {
            newQ.options = Object.entries(q.options || {}).map(
              ([key, val]) => ({
                key,
                text: val.text,
                score: val.score,
              })
            );
            newQ.questionIndex = idx;
          }
          all.push(newQ);
        });
      }
    });
  }
  return all;
}

function showQuestion(index) {
  const q = questions[index];

  if (!q) {
    questionText.textContent = "Question not found.";
    optionsContainer.innerHTML = "";
    return;
  }

  if (typeof q.question === "object") {
    questionText.textContent = q.question[selectedLanguage] || q.question.en;
  } else {
    questionText.textContent = q.question;
  }

  sectionHeading.textContent = `${q.section}`;
  document.getElementById("questionTypeTitle").textContent =
    q.type.charAt(0).toUpperCase() + q.type.slice(1) + ` Question`;

  optionsContainer.innerHTML = "";
  errorMsg.classList.add("hidden");

  if (q.type === "objective" && q.options?.length > 0) {
    nextBtn.classList.remove("hidden");
    q.options.forEach((opt, idx) => {
      const optionId = `option_${idx}`;
      const optionText =
        typeof opt.text === "object"
          ? opt.text[selectedLanguage] || opt.text.en
          : opt.text;

      const optionDiv = document.createElement("div");
      optionDiv.className = "option-item";
      optionDiv.innerHTML = `
                <input type="radio" name="questionOption" id="${optionId}" value="${optionText}" style="margin-right: 12px;">
                <label for="${optionId}" style="cursor: pointer; flex: 1;">${opt.key}) ${optionText}</label>
            `;

      optionDiv.addEventListener("click", function () {
        const radio = optionDiv.querySelector('input[type="radio"]');
        radio.checked = true;
        document
          .querySelectorAll(".option-item")
          .forEach((item) => item.classList.remove("selected"));
        optionDiv.classList.add("selected");
      });

      optionsContainer.appendChild(optionDiv);
    });
  } else {
    nextBtn.classList.remove("hidden");
    optionsContainer.innerHTML = `
            <textarea id="subjectiveAnswer" class="textarea-input" rows="6" placeholder="Type your answer here..."></textarea>
        `;
  }

  questionContainer.classList.remove("hidden");
  updateProgress(index);
  startTime = Date.now();
  localStorage.setItem("savedIndex", currentIndex.toString());
}

nextBtn.addEventListener("click", () => {
  const q = questions[currentIndex];
  if (!q) return;

  const endTime = Date.now();
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  let selectedAnswer = null;

  if (q.type === "objective") {
    const selected = document.querySelector(
      "input[name='questionOption']:checked"
    );
    if (!selected) {
      errorMsg.textContent = t("selectOption");
      errorMsg.classList.remove("hidden");
      return;
    }
    selectedAnswer = selected.value;
  } else {
    const textarea = document.getElementById("subjectiveAnswer");
    if (!textarea || textarea.value.trim() === "") {
      errorMsg.textContent = t("typeAnswer");
      errorMsg.classList.remove("hidden");
      return;
    }
    selectedAnswer = textarea.value.trim();
  }

  // --- Map to backend expected format ---
  let answerObj = {
    section: q.section,
    type: q.type === "objective" ? "Objective" : "Subjective"
  };
  if (q.type === "subjective") {
    answerObj.questionId = q.questionId || `Q${currentIndex + 1}`;
    answerObj.answer = selectedAnswer;
  } else {
    answerObj.questionIndex = typeof q.questionIndex === "number" ? q.questionIndex : currentIndex;
    answerObj.selectedOption = q.options && q.options.find(opt => opt.text[selectedLanguage] === selectedAnswer || opt.text.en === selectedAnswer)?.key || selectedAnswer;
  }
  userInfo.responses.push(answerObj);
  // --- End mapping ---

  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion(currentIndex);
  }
  else {
    questionContainer.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle" style="margin-right: 10px; font-size: 20px;"></i>
                ${t("thankYou")}
            </div>
        `;
    sendData(userInfo);
  }
});

function sendData(data) {
  showLoading();
  // --- Prepare payload for backend ---
  const formData = data.data || {};
  const userId = formData.email || formData.name || `user_${Date.now()}`;
  const payload = {
    userAnswers: data.responses,
    userId: userId,
    userName: formData.name || ""
  };
  // --- End payload ---

  console.log("Submitting data:", payload);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  fetch(`${BASE_API_URL}/api/mentalhealth/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: controller.signal,
  })
    .then((response) => {
      hideLoading();
      clearTimeout(timeoutId);
      if (!response.ok) {
        return response.text().then((msg) => {
          throw new Error(msg || `HTTP ${response.status}`);
        });
      }
      return response.json();
    })
    .then((result) => {
      clearTimeout(timeoutId);
      localStorage.removeItem("savedUserInfo");
      localStorage.removeItem("savedIndex");

      // --- Save backend result and redirect to results page ---
      localStorage.setItem("mh_assessment_result", JSON.stringify(result.data));
      window.location.href = "mentalHealthResult.html";
      // --- End redirect ---
    })
    .catch((err) => {
      hideLoading();
      clearTimeout(timeoutId);
      console.error("Error:", err.message);

      let errorText = "Something went wrong. Please try again.";
      if (err.name === "AbortError") {
        errorText = "Request timed out. Please try again.";
      } else if (err.message) {
        errorText = err.message;
      }

      questionContainer.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 30px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ef4444; margin-bottom: 20px;"></i>
                <h3 style="color: #ef4444; margin-bottom: 15px;">Submission Failed</h3>
                <p style="color: #6b7280; margin-bottom: 20px;">${errorText}</p>
                <button onclick="resetAssessment()" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Try Again
                </button>
            </div>
        `;
    });
}

// function to reset the assessment state
function resetAssessment() {
  // Reset state variables
  questions = [];
  currentIndex = 0;
  startTime = null;
  userInfo = { createdAt: new Date().toISOString(), data: {}, responses: [] };
  // Reset form fields
  if (form) form.reset();
  // Show the user details form
  container.style.transform = "translateX(0)";
  container.style.opacity = "1";
  container.style.display = "block";
  // Hide the question container and messages
  questionContainer.classList.add("hidden");
  questionContainer.innerHTML = `
    <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width: 0%"></div></div>
    <div id="progressText" style="text-align: center; margin-bottom: 20px; font-weight: 600; color: #667eea;"></div>
    <h2 id="sectionHeading" class="section-heading"></h2>
    <h3 id="questionTypeTitle" class="question-type"></h3>
    <p id="questionText" class="question-text"></p>
    <div id="optionsContainer" class="options-container"></div>
    <p id="errorMsg" class="error-message hidden"></p>
    <button onclick="resetAssessment()" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Try Again
                </button>
  `;
  // Hide any messages
  if (successMessage) successMessage.classList.add("hidden");
  if (errorMessage) errorMessage.classList.add("hidden");
  setTimeout(() => {
    const newNextBtn = document.getElementById("nextBtn");
    if (newNextBtn) {
      newNextBtn.addEventListener("click", () => {
        nextBtn.click();
      });
    }
  }, 100);
}