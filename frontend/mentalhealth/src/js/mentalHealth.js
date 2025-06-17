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
    thankYou: "धन्यवाद! आपके उत्तर सबमिट किए जा रहे हैं...",
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
    thankYou: "ধন্যবাদ! আপনার উত্তর জমা দেওয়া হচ্ছে...",
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
    e.preventDefault();
    const formData = new FormData(form);
    userInfo.data = Object.fromEntries(formData);
    container.style.transform = "translateX(-100%)";
    container.style.opacity = "0";
    setTimeout(() => {
      getData();
    }, 300);
  });
}

function getData() {
  const mockData = {
    data: {
      Depression: {
        Subjective: [
          {
            question: {
              en: "How have you been feeling about your mood and energy levels lately?",
              hi: "हाल ही में आपका मूड और ऊर्जा का स्तर कैसा रहा है?",
              bn: "সম্প্রতি আপনার মেজাজ এবং শক্তির মাত্রা কেমন লাগছে?",
            },
          },
          {
            question: {
              en: "Describe any changes in your sleep patterns or appetite.",
              hi: "अपनी नींद के पैटर्न या भूख में कोई बदलाव का वर्णन करें।",
              bn: "আপনার ঘুমের ধরন বা ক্ষুধায় কোনো পরিবর্তনের বর্ণনা দিন।",
            },
          },
        ],
        Objective: [
          {
            question: {
              en: "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
              hi: "पिछले दो हफ्तों में, आपने कितनी बार उदास, अवसादग्रस्त या निराश महसूस किया है?",
              bn: "গত দুই সপ্তাহে, আপনি কতবার হতাশ, বিষণ্ণ বা আশাহীন বোধ করেছেন?",
            },
            options: {
              A: {
                text: { en: "Not at all", hi: "बिल्कुल नहीं", bn: "একদমই নয়" },
                score: 0,
              },
              B: {
                text: { en: "Several days", hi: "कई दिन", bn: "কয়েক দিন" },
                score: 1,
              },
              C: {
                text: {
                  en: "More than half the days",
                  hi: "आधे से अधिक दिन",
                  bn: "অর্ধেকের বেশি দিন",
                },
                score: 2,
              },
              D: {
                text: {
                  en: "Nearly every day",
                  hi: "लगभग हर दिन",
                  bn: "প্রায় প্রতিদিন",
                },
                score: 3,
              },
            },
          },
          {
            question: {
              en: "How often have you had little interest or pleasure in doing things?",
              hi: "आपको काम करने में कितनी बार कम रुचि या खुशी महसूस हुई है?",
              bn: "কাজকর্মে আগ্রহ বা আনন্দ কম লাগার অভিজ্ঞতা কতবার হয়েছে?",
            },
            options: {
              A: {
                text: { en: "Not at all", hi: "बिल्कुल नहीं", bn: "একদমই নয়" },
                score: 0,
              },
              B: {
                text: { en: "Several days", hi: "कई दिन", bn: "কয়েক দিন" },
                score: 1,
              },
              C: {
                text: {
                  en: "More than half the days",
                  hi: "आधे से अधिक दिन",
                  bn: "অর্ধেকের বেশি দিন",
                },
                score: 2,
              },
              D: {
                text: {
                  en: "Nearly every day",
                  hi: "लगभग हर दिन",
                  bn: "প্রায় প্রতিদিন",
                },
                score: 3,
              },
            },
          },
        ],
      },
      Anxiety: {
        Subjective: [
          {
            question: {
              en: "What situations or thoughts tend to make you feel most anxious?",
              hi: "कौन सी परिस्थितियां या विचार आपको सबसे अधिक चिंतित करते हैं?",
              bn: "কোন পরিস্থিতি বা চিন্তা আপনাকে সবচেয়ে বেশি উদ্বিগ্ন করে তোলে?",
            },
          },
          {
            question: {
              en: "How do you typically cope with feelings of worry or stress?",
              hi: "आप आमतौर पर चिंता या तनाव की भावनाओं से कैसे निपटते हैं?",
              bn: "আপনি সাধারণত দুশ্চিন্তা বা চাপের অনুভূতির সাথে কীভাবে মোকাবিলা করেন?",
            },
          },
        ],
        Objective: [
          {
            question: {
              en: "Over the past two weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
              hi: "पिछले दो हफ्तों में, घबराहट, चिंता या बेचैनी की भावना से आप कितनी बार परेशान हुए हैं?",
              bn: "গত দুই সপ্তাহে, নার্ভাস, উদ্বিগ্ন বা অস্থির অনুভব করে কতবার বিরক্ত হয়েছেন?",
            },
            options: {
              A: {
                text: { en: "Not at all", hi: "बिल्कुल नहीं", bn: "একদমই নয়" },
                score: 0,
              },
              B: {
                text: { en: "Several days", hi: "कई दिन", bn: "কয়েক দিন" },
                score: 1,
              },
              C: {
                text: {
                  en: "More than half the days",
                  hi: "आधे से अधिक দিন",
                  bn: "অর্ধেকের বেশি দিন",
                },
                score: 2,
              },
              D: {
                text: {
                  en: "Nearly every day",
                  hi: "लगभग हर दिन",
                  bn: "প্রায় প্রতিদিন",
                },
                score: 3,
              },
            },
          },
          {
            question: {
              en: "How often have you been unable to stop or control worrying?",
              hi: "कितनी बार आप चिंता को रोकने या नियंत्रित करने में असमर্থ रहे हैं?",
              bn: "কতবার আপনি দুশ্চিন্তা বন্ধ বা নিয়ন্ত্রণ করতে অক্ষম হয়েছেন?",
            },
            options: {
              A: {
                text: { en: "Not at all", hi: "बिल्कुल नहीं", bn: "একদমই নয়" },
                score: 0,
              },
              B: {
                text: { en: "Several days", hi: "कई दিन", bn: "কয়েক দিন" },
                score: 1,
              },
              C: {
                text: {
                  en: "More than half the days",
                  hi: "आধे से अধিক দিন",
                  bn: "অর্ধেকের বেশি দিন",
                },
                score: 2,
              },
              D: {
                text: {
                  en: "Nearly every day",
                  hi: "लगभग हर দিন",
                  bn: "প্রায় প্রতিদিন",
                },
                score: 3,
              },
            },
          },
        ],
      },
      Cognitive: {
        Subjective: [
          {
            question: {
              en: "Have you noticed any changes in your memory or ability to concentrate?",
              hi: "क्या आपने अपनी याददाश्त या ध्यान केंद्रित करने की क्षमता में कोई बदलाव देखा है?",
              bn: "আপনার স্মৃতিশক্তি বা মনোযোগ দেওয়ার ক্ষমতায় কোনো পরিবর্তন লক্ষ্য করেছেন?",
            },
          },
          {
            question: {
              en: "Describe any difficulties you have with daily tasks or decision-making.",
              hi: "दैनिक कार्यों या निर্णয় लेने में आपको होने वाली कोई कठিनाइयों का वर্णन करें।",
              bn: "দৈনন্দিন কাজ বা সিদ্ধান্ত নেওয়ার ক্ষেত্রে আপনার কোনো অসুবিধার বর্ণনা দিন।",
            },
          },
        ],
        Objective: [
          {
            question: {
              en: "How often do you forget important appointments or events?",
              hi: "आप कितनी बार महत्वपूर्ণ अपॉइंटमेंट या घटनाओं को भूल जाते हैं?",
              bn: "আপনি কত ঘন ঘন গুরুত্वপূর্ণ অ্যাপয়েন্টমেন্ট বা ঘটনা ভুলে যান?",
            },
            options: {
              A: {
                text: { en: "Never", hi: "कभी नहीं", bn: "কখনো না" },
                score: 0,
              },
              B: {
                text: { en: "Rarely", hi: "शायद ही कभी", bn: "খুব কমই" },
                score: 1,
              },
              C: {
                text: { en: "Sometimes", hi: "कभी कभी", bn: "মাঝে মাঝে" },
                score: 2,
              },
              D: {
                text: { en: "Often", hi: "अक्सर", bn: "প্রায়ই" },
                score: 3,
              },
            },
          },
          {
            question: {
              en: "How frequently do you have trouble finding the right words when speaking?",
              hi: "बात करते समय सही शब्द खोजने में आपको कितनी बार परेशानी होती है?",
              bn: "কথা বলার সময় সঠিক শব্দ খুঁজে পেতে কত ঘন ঘন সমস্যা হয়?",
            },
            options: {
              A: {
                text: { en: "Never", hi: "कभी नहीं", bn: "কখনো না" },
                score: 0,
              },
              B: {
                text: { en: "Rarely", hi: "शायद ही कभी", bn: "খুব কমই" },
                score: 1,
              },
              C: {
                text: { en: "Sometimes", hi: "कभी कभी", bn: "মাঝে মাঝে" },
                score: 2,
              },
              D: {
                text: { en: "Often", hi: "अक्सर", bn: "প্রায়ই" },
                score: 3,
              },
            },
          },
        ],
      },
      Social: {
        Subjective: [
          {
            question: {
              en: "How do you feel about your current social connections and relationships?",
              hi: "अपने वर्तमान सामाजिक संपर्कों और रिश्तों के बारे में आप कैसा महसूस करते हैं?",
              bn: "আপনার বর্তমান সামাজিক সংযোগ এবং সম্পর্কের বিষয়ে আপনি কেমন অনুভব করেন?",
            },
          },
          {
            question: {
              en: "What activities or hobbies do you engage in regularly?",
              hi: "आप नियमित रूप से किन गतिविधियों या शौकों में संलग্न रहते हैं?",
              bn: "আপনি নিয়মিত কোন কার্যকলাপ বা শখে নিযুক্ত থাকেন?",
            },
          },
        ],
        Objective: [
          {
            question: {
              en: "How often do you feel lonely or isolated?",
              hi: "आप कितनी बার अकेला या अलग-थलग महसूस করते हैं?",
              bn: "আপনি কত ঘন ঘন একাকী বা বিচ্ছিন্ন বোধ করেন?",
            },
            options: {
              A: {
                text: { en: "Never", hi: "कभी नहीं", bn: "কখনো না" },
                score: 0,
              },
              B: {
                text: { en: "Rarely", hi: "शायद ही कभी", bn: "খুব কমই" },
                score: 1,
              },
              C: {
                text: { en: "Sometimes", hi: "कभी कभी", bn: "মাঝে মাঝে" },
                score: 2,
              },
              D: {
                text: { en: "Often", hi: "अक्सर", bn: "প্রায়ই" },
                score: 3,
              },
            },
          },
          {
            question: {
              en: "How frequently do you participate in social activities or gatherings?",
              hi: "आप कितनी बार सामाजिक गतिविধियों या सभाओं में भाग लेते हैं?",
              bn: "আপনি কত ঘন ঘন সামাজিক ক্রিয়াকলাপ বা জমায়েতে অংশগ্রহণ করেন?",
            },
            options: {
              A: {
                text: { en: "Very often", hi: "बहुत बार", bn: "খুব ঘন ঘন" },
                score: 0,
              },
              B: {
                text: { en: "Sometimes", hi: "कभी कभी", bn: "মাঝে মাঝে" },
                score: 1,
              },
              C: {
                text: { en: "Rarely", hi: "शायद ही कभी", bn: "খুব কমই" },
                score: 2,
              },
              D: {
                text: { en: "Never", hi: "कभी नहीं", bn: "কখনো না" },
                score: 3,
              },
            },
          },
        ],
      },
    },
  };

  console.log(mockData.data);
  questions = extractAllQuestions(mockData.data);
  console.log(questions);
  displayQuestions(questions, 0);
}

function displayQuestions(data, index = 0) {
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
            newQ.options = Object.entries(q.options || {}).map(
              ([key, val]) => ({
                key,
                text: val.text,
                score: val.score,
              })
            );
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

  userInfo.responses.push({
    question: q.question,
    section: q.section,
    type: q.type,
    selectedAnswer,
    timeTaken,
  });

  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion(currentIndex);
  } else {
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
  console.log("Submitting data:", data);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  fetch("http://localhost:8000/api/mentalhealth/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    .then((result) => {
      clearTimeout(timeoutId);
      localStorage.removeItem("savedUserInfo");
      localStorage.removeItem("savedIndex");

      questionContainer.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 30px;">
                <i class="fas fa-check-circle" style="font-size: 48px; color: #10b981; margin-bottom: 20px;"></i>
                <h3 style="color: #10b981; margin-bottom: 15px;">Assessment Complete!</h3>
                <p style="color: #6b7280; margin-bottom: 20px;">Thank you for completing the mental health assessment. Your responses have been successfully recorded.</p>
                <button onclick="location.reload()" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Take Another Assessment
                </button>
            </div>
        `;
    })
    .catch((err) => {
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
                <button onclick="location.reload()" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Try Again
                </button>
            </div>
        `;
    });
}
