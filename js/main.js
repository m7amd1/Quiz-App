// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestion() {
  fetch("https://m7amd1.github.io/Quiz-App/html_questions.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((questionObject) => {
      let questionCount = questionObject.length;
      createBullets(questionCount);
      addQuestionData(questionObject[currentIndex], questionCount);
      countDown(100, questionCount);

      submitButton.onclick = () => {
        let rightAnswer = questionObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(rightAnswer, questionCount);
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        if (currentIndex < questionCount) {
          addQuestionData(questionObject[currentIndex], questionCount);
          handleBullets();
          clearInterval(countdownInterval);
          countDown(100, questionCount);
        } else {
          showResults(questionCount);
        }
      };
    })
    .catch((error) => {
      console.error("Error loading questions:", error);
      resultsContainer.innerHTML = `<span class='bad'>Error loading questions. Please try again later.</span>`;
    });
}

getQuestion();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }

    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");

    let questionText = document.createTextNode(obj.title);

    questionTitle.appendChild(questionText);

    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");

      mainDiv.className = "answer";

      let radioInput = document.createElement("input");

      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      let label = document.createElement("label");

      label.htmlFor = `answer_${i}`;

      let labelText = document.createTextNode(obj[`answer_${i}`]);

      label.appendChild(labelText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(label);

      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
    console.log("You Chooses The Right Answer");
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpan);

  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class='good'>Good</span>, ${rightAnswers} From ${count} is Good.`;
    } else if (rightAnswers === count) {
      theResult = `<span class='perfect'>Perfect</span>, All Answers is Right`;
    } else {
      theResult = `<span class='bad'>Bad</span>, ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResult;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "#FFF";
    resultsContainer.style.marginTop = "10px";
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
