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

let questions = [];
let currentIndex = 0;
let startTime = null;
let selectedLanguage = "en";

let userInfo = {
  createdAt: new Date().toISOString(),
  data: {},
  responses: []
};

// Restore saved data if page reloads
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("savedUserInfo");
  const savedIndex = localStorage.getItem("savedIndex");
  if (saved && savedIndex) {
    userInfo = JSON.parse(saved);
    currentIndex = parseInt(savedIndex, 10);
    getData();
  }
});

// Translation dictionary for static UI text
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
    progress: (current, total) => `Question ${current} of ${total}`
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
    thankYou: "धन्यवाद! आपके उत्तर सबमिट किए जा रहे हैं...",
    selectOption: "कृपया आगे बढ़ने से पहले एक विकल्प चुनें।",
    typeAnswer: "कृपया आगे बढ़ने से पहले उत्तर लिखें।",
    progress: (current, total) => `प्रश्न ${current} / ${total}`
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
    thankYou: "ধন্যবাদ! আপনার উত্তর জমা দেওয়া হচ্ছে...",
    selectOption: "অনুগ্রহ করে একটি অপশন নির্বাচন করুন।",
    typeAnswer: "অনুগ্রহ করে উত্তর লিখুন।",
    progress: (current, total) => `প্রশ্ন ${current} / ${total}`
  }
};

function t(key, ...args) {
  const dict = translations[selectedLanguage] || translations.en;
  const val = dict[key];
  return typeof val === 'function' ? val(...args) : val || key;
}

function updateStaticText() {
  document.title = t('formTitle');
  const formTitle = document.querySelector('.elder-section-title');
  if (formTitle) formTitle.textContent = t('formTitle');
  const helper = document.querySelector('.elder-helper');
  if (helper) helper.textContent = t('formHelper');
  document.querySelectorAll('label[for="name"]').forEach(l => l.textContent = t('name'));
  document.querySelectorAll('label[for="email"]').forEach(l => l.textContent = t('email'));
  document.querySelectorAll('label[for="address"]').forEach(l => l.textContent = t('address'));
  document.querySelectorAll('label[for="number"]').forEach(l => l.textContent = t('phone'));
  document.querySelectorAll('label[for="ageSlab"]').forEach(l => l.textContent = t('ageRange'));
  document.querySelectorAll('option[value=""]')[0].textContent = t('selectAge');
  document.querySelectorAll('.elder-form-label').forEach(l => {
    if (l.textContent.trim() === 'Gender' || l.textContent.trim() === 'लिंग' || l.textContent.trim() === 'লিঙ্গ') l.textContent = t('gender');
  });
  document.querySelectorAll('span.elder-option-label').forEach(span => {
    if (span.textContent.trim() === 'Male' || span.textContent.trim() === 'पुरुष' || span.textContent.trim() === 'পুরুষ') span.textContent = t('male');
    if (span.textContent.trim() === 'Female' || span.textContent.trim() === 'महिला' || span.textContent.trim() === 'মহিলা') span.textContent = t('female');
    if (span.textContent.trim() === 'Other' || span.textContent.trim() === 'अन्य' || span.textContent.trim() === 'অন্যান্য') span.textContent = t('other');
  });
  document.querySelectorAll('button[type="submit"]').forEach(btn => btn.textContent = `${t('submit')}`);
  document.querySelectorAll('label[for="languageSelect"]').forEach(l => l.textContent = t('language'));
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
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    getData();
  });
}

function getData() {
  fetch("http://localhost:8000/api/mentalhealth/question")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      // Fix: Use data.data for questions
      console.log(data.data);
      questions = extractAllQuestions(data.data);
      console.log(questions);
      displayQuestions(questions, 0);
    })
    .catch((err) => {
      console.error("Error fetching questions:", err.message);
      errorMsg.textContent = "Unable to load questions. Please try again later.";
      errorMsg.classList.remove("hidden");
    });
}

function displayQuestions(data, index = 0) {
  container.classList.add("hidden");
  questionContainer.classList.remove("hidden");
  questions = data;
  startTime = Date.now();
  showQuestion(index);
  updateProgress(index);
}

function updateProgress(index) {
  const progressBar = document.getElementById("progressBar");
  if (!progressBar) return;
  const total = questions.length;
  progressBar.textContent = t('progress', index + 1, total);
}

function extractAllQuestions(data) {
  const all = [];
  for (const section in data) {
    ["Subjective", "Objective"].forEach((type) => {
      if (Array.isArray(data[section][type])) {
        data[section][type].forEach((q) => {
          const newQ = {
            ...q,
            section,
            type: type.toLowerCase(), 
          };
          if (type.toLowerCase() === "objective") {
            // Fix: Map options for all languages
            newQ.options = Object.entries(q.options || {}).map(([key, val]) => ({
              key,
              text: val.text, // text is an object with languages
              score: val.score
            }));
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
  console.log(typeof q);
  if (!q) {
    questionText.textContent = "Question not found.";
    optionsContainer.innerHTML = "";
    return;
  }
  if (typeof q.question === 'object') {
    questionText.textContent = q.question[selectedLanguage] || q.question['en'];
  } else {
    questionText.textContent = q.question;
  }
  sectionHeading.textContent = `${q.section}`;
  document.getElementById("questionTypeTitle").textContent = q.type.charAt(0).toUpperCase() + q.type.slice(1) + ` ${t('gender') === 'Gender' ? 'Question' : ''}`;
  optionsContainer.innerHTML = "";
  errorMsg.classList.add("hidden");

  if (q.type === "objective" && q.options?.length > 0) {
    nextBtn.classList.remove("hidden"); 
    q.options.forEach((opt, idx) => {
      const optionId = `option_${idx}`;
      const optionText = typeof opt.text === 'object' ? (opt.text[selectedLanguage] || opt.text['en']) : opt.text;
      optionsContainer.innerHTML += `
        <div class="flex items-center gap-2 mb-2">
          <input type="radio" name="questionOption" id="${optionId}" value="${optionText}" class="elder-radio">
          <label for="${optionId}" class="elder-option-label">${opt.key}) ${optionText}</label>
        </div>
      `;
    });
    
  } else {
    nextBtn.classList.add("hidden");
    optionsContainer.innerHTML = `
      <textarea id="subjectiveAnswer" rows="6" class="elder-input w-full" placeholder="Type your answer here..."></textarea>
      <div class="text-center mt-4">
        <button id="nextBtnDynamic" type="button" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition-transform duration-150">${t('next')}</button>
      </div>
    `;
    const nextBtnDynamic = document.getElementById("nextBtnDynamic");
    if (nextBtnDynamic) {
      nextBtnDynamic.addEventListener("click", () => {
        nextBtn.click();
      });
    }
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
    const selected = document.querySelector("input[name='questionOption']:checked");
    if (!selected) {
      errorMsg.textContent = t('selectOption');
      errorMsg.classList.remove("hidden");
      return;
    }
    selectedAnswer = selected.value;
  } else {
    const textarea = document.getElementById("subjectiveAnswer");
    if (!textarea || textarea.value.trim() === "") {
      errorMsg.textContent = t('typeAnswer');
      errorMsg.classList.remove("hidden");
      return;
    }
    selectedAnswer = textarea.value.trim();
  }

  userInfo.responses.push({
    question: q.question,
    section: q.section,
    type: q.type,
    selectedAnswer,
    timeTaken
  });

  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion(currentIndex);
  } else {
    questionContainer.innerHTML = `<p class='text-lg font-semibold text-green-700 text-center'>${t('thankYou')}</p>`;
    sendData(userInfo);
  }
});

function sendData(data) {
  console.log("Submitting data:", data);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  fetch("https://example.org/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: controller.signal,
  })
    .then((response) => {
      clearTimeout(timeoutId);
      if (!response.ok) {
        return response.text().then((msg) => {
          throw new Error(msg || `HTTP ${response.status}`);
        });
      }
      return response.json();
    })
    .then(() => {
      successMessage.textContent = "Data submitted successfully!";
      successMessage.classList.remove("hidden");
      errorMessage.classList.add("hidden");
      form.reset();
    })
    .catch((err) => {
      clearTimeout(timeoutId);
      console.error("error:", err.message);
      if (err.name === "AbortError") {
        errorMessage.textContent = "Request timed out. Please try again.";
      } else {
        errorMessage.textContent = err.message || "Something went wrong.";
      }
      errorMessage.classList.remove("hidden");
      successMessage.classList.add("hidden");
    });
}
