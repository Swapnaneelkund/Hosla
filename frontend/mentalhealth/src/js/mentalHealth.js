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

let questions = [];
let currentIndex = 0;
let startTime = null;

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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  userInfo.data.name = formData.get("name");
  userInfo.data.email = formData.get("email");
  userInfo.data.gender = formData.get("gender");
  userInfo.data.address = formData.get("address");
  userInfo.data.number = formData.get("number");
  userInfo.data.ageSlab = formData.get("ageSlab");

  localStorage.setItem("savedUserInfo", JSON.stringify(userInfo));
  localStorage.setItem("savedIndex", currentIndex.toString());

  getData();
});

function getData() {
  fetch("http://localhost:8000/api/mentalhealth/question")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      displayQuestions(data);
    })
    .catch((err) => {
      console.error("Error fetching questions:", err.message);
      errorMsg.textContent = "Unable to load questions. Please try again later.";
      errorMsg.classList.remove("hidden");
    });
}

function displayQuestions(data) {
  container.classList.add("hidden");
  questionContainer.classList.remove("hidden");
  questions = extractAllQuestions(data.data);
  startTime = Date.now();
  showQuestion();
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
            newQ.options = Object.entries(q.options || {}).map(([key, val]) => ({
              key,
              text: val.text,
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

function showQuestion() {
  const q = questions[currentIndex];
  if (!q) return;

  questionText.textContent = q.question;
  sectionHeading.textContent = `${q.section} - ${q.type}`;
  optionsContainer.innerHTML = "";
  errorMsg.classList.add("hidden");

  if (q.type === "objective" && q.options?.length > 0) {
    q.options.forEach((opt, index) => {
      const optionId = `option_${index}`;
      optionsContainer.innerHTML += `
        <div class="flex items-center gap-2">
          <input type="radio" name="questionOption" id="${optionId}" value="${opt.text}" class="mr-2">
          <label for="${optionId}" class="text-black">${opt.key}) ${opt.text}</label>
        </div>
      `;
    });
  } else {
    optionsContainer.innerHTML = `
      <textarea id="subjectiveAnswer" rows="3" class="w-full p-2 rounded text-black" placeholder="Type your answer here..."></textarea>
    `;
  }

  startTime = Date.now();
  localStorage.setItem("savedIndex", currentIndex.toString());
}

nextBtn.addEventListener("click", () => {
  const q = questions[currentIndex];
  const endTime = Date.now();
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  let selectedAnswer = null;

  if (q.type === "objective") {
    const selected = document.querySelector("input[name='questionOption']:checked");
    if (!selected) {
      errorMsg.textContent = "Please select an option before proceeding.";
      errorMsg.classList.remove("hidden");
      return;
    }
    selectedAnswer = selected.value;
  } else {
    const textarea = document.getElementById("subjectiveAnswer");
    if (!textarea || textarea.value.trim() === "") {
      errorMsg.textContent = "Please type your answer before proceeding.";
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
    showQuestion();
  } else {
    localStorage.removeItem("savedUserInfo");
    localStorage.removeItem("savedIndex");

    questionContainer.innerHTML = "<p class='text-lg font-semibold text-green-700'>Thank you! Submitting your answers...</p>";
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
      form.reset();
    })
    .catch((err) => {
      clearTimeout(timeoutId);
      console.error("Submit error:", err.message);
      errorMessage.textContent = err.name === "AbortError"
        ? "Request timed out. Please try again."
        : err.message || "Something went wrong.";
    });
}

// Optional: Debug storage clear
// localStorage.clear();
