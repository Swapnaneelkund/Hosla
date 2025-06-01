const form = document.getElementById("userForm");
const container = document.getElementById("form-container");
const questionContainer = document.getElementById("questionContainer");
const questionText = document.getElementById("questionText");
const sectionHeading = document.getElementById("sectionHeading");
const nextBtn = document.getElementById("nextBtn");

let questions = [];
let currentIndex = 0;
let startTime = null;

const userInfo = {
  createdAt: new Date().toISOString(),
  data: {},
  responses: []
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  userInfo.data.name = formData.get("name");
  userInfo.data.email = formData.get("email");
  userInfo.data.gender = formData.get("gender");
  userInfo.data.address = formData.get("address");
  userInfo.data.number = formData.get("number");
  userInfo.data.ageSlab = formData.get("ageSlab");
  getData();
});

function getData() {
  fetch("http://localhost:5000/api/mentalhealth/question")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      displayQuestions(data);
    })
    .catch((err) => {
      console.error(err.message);
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
    ["subjective", "objective"].forEach((type) => {
      if (Array.isArray(data[section][type])) {
        data[section][type].forEach((q) => {
          all.push({ ...q, section, type });
        });
      }
    });
  }
  return all;
}

function showQuestion() {
  const q = questions[currentIndex];
  questionText.textContent = q.question;
  sectionHeading.textContent = `${q.section} - ${q.type}`;

  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  if (q.options && q.options.length > 0) {
    q.options.forEach((opt, index) => {
      const optionId = `option_${index}`;
      const radioHTML = `
        <div>
          <input type="radio" name="questionOption" id="${optionId}" value="${opt}" class="mr-2">
          <label for="${optionId}" class="text-white">${opt}</label>
        </div>`;
      optionsContainer.innerHTML += radioHTML;
    });
  } else {
    optionsContainer.innerHTML = "<p class='text-gray-400 italic'>No options available for this question.</p>";
  }

  document.getElementById("errorMsg").classList.add("hidden");
  startTime = Date.now();
}

nextBtn.addEventListener("click", () => {
  const endTime = Date.now();
  const timeTaken = Math.floor((endTime - startTime) / 1000);

  const selectedOption = document.querySelector("input[name='questionOption']:checked");

  if (!selectedOption && questions[currentIndex].options?.length > 0) {
    document.getElementById("errorMsg").classList.remove("hidden");
    return;
  }

  userInfo.responses.push({
    question: questions[currentIndex].question,
    section: questions[currentIndex].section,
    type: questions[currentIndex].type,
    selectedAnswer: selectedOption ? selectedOption.value : null,
    timeTaken
  });

  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    questionContainer.innerHTML = "<p class='text-lg font-semibold text-green-700'>Thank you! Submitting your answers...</p>";
    sendData(userInfo);
  }
});

function sendData(data) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  fetch("https://example.org/post", {
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
        return response.text().then((serverMessage) => {
          throw new Error(serverMessage || `HTTP ${response.status}`);
        });
      }
      return response.json();
    })
    .then((result) => {
      successMessage.textContent = "Data submitted successfully!";
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
    });
}
