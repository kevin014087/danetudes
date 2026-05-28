// Premium FLE Level Quiz JavaScript — Secured & Modularized to comply with CSP
const quizTranslations = {
  fr: {
    questions: [
      {
        question: "Dans la rue à Abidjan, comment saluez-vous poliment une personne le matin ?",
        options: ["Salut, ça va ?", "Bonjour, monsieur/madame", "Allô !", "C'est comment ?"],
        correct: 1,
        explanation: "« Bonjour, monsieur/madame » est la salutation polie standard en français le matin."
      },
      {
        question: "Pour vous déplacer à Abidjan, vous dites au chauffeur : 'Je ___ descendre au prochain carrefour.'",
        options: ["dois", "doive", "aie", "veut"],
        correct: 0,
        explanation: "« Je dois » est la conjugaison correcte au présent de l'indicatif du verbe devoir."
      },
      {
        question: "Si un ami expatrié vous demande conseil, vous lui dites : 'Je te conseille de ___ les cours de DANETUDES.'",
        options: ["suivre", "suives", "suis", "suivi"],
        correct: 0,
        explanation: "Après la préposition « de », le verbe s'utilise à l'infinitif : « suivre »."
      },
      {
        question: "À Abidjan, l'expression amicale 'On est ensemble' signifie :",
        options: ["On marche côte à côte", "Nous sommes solidaires et d'accord", "On va habiter ensemble", "On est en retard"],
        correct: 1,
        explanation: "« On est ensemble » est une expression ivoirienne incontournable pour exprimer la solidarité et l'entente."
      },
      {
        question: "Il est indispensable que notre équipe ___ le français pour faciliter notre intégration.",
        options: ["apprenne", "apprend", "apprendra", "apprenait"],
        correct: 0,
        explanation: "« Il est indispensable que » exige l'emploi du subjonctif présent : « apprenne »."
      }
    ],
    levels: {
      beginner: {
        title: "Niveau Débutant (A1)",
        description: "Vous commencez tout juste votre parcours en français. C'est le moment idéal pour poser des bases solides avec notre méthode personnalisée !",
        recommendation: "Parcours « En pice » ou « Intégration Rapide » — 6 mois"
      },
      elementary: {
        title: "Niveau Élémentaire (A2)",
        description: "Vous comprenez des phrases simples et pouvez communiquer sur des sujets familiers à Abidjan.",
        recommendation: "Parcours « Intégration Rapide » — 3 mois"
      },
      intermediate: {
        title: "Niveau Intermédiaire (B1/B2)",
        description: "Vous pouvez vous exprimer avec confiance sur des sujets variés et interagir professionnellement à Abidjan.",
        recommendation: "Parcours « Français Professionnel » — 2 mois"
      }
    },
    ui: {
      question: "Question",
      of: "sur",
      next: "Question suivante",
      results: "Voir les résultats",
      redo: "Refaire le test",
      book: "Partager mon score & réserver",
      explanationTitle: "Explication :"
    }
  },
  en: {
    questions: [
      {
        question: "In the street in Abidjan, how do you politely greet someone in the morning?",
        options: ["Salut, ça va ?", "Bonjour, monsieur/madame", "Allô !", "C'est comment ?"],
        correct: 1,
        explanation: "'Bonjour, monsieur/madame' is the standard polite morning greeting in French."
      },
      {
        question: "To get around Abidjan, you tell the driver: 'Je ___ descendre au prochain carrefour.'",
        options: ["dois", "doive", "aie", "veut"],
        correct: 0,
        explanation: "'Je dois' is the correct indicative present conjugation of the verb 'devoir'."
      },
      {
        question: "If an expatriate friend asks for advice, you tell them: 'Je te conseille de ___ les cours de DANETUDES.'",
        options: ["suivre", "suives", "suis", "suivi"],
        correct: 0,
        explanation: "Following the preposition 'de', the verb is used in the infinitive form: 'suivre'."
      },
      {
        question: "In Abidjan, the friendly expression 'On est ensemble' means:",
        options: ["We walk side by side", "We stand together in agreement", "We will live together", "We are late"],
        correct: 1,
        explanation: "'On est ensemble' is an essential Ivorian idiom to express solidarity and mutual support."
      },
      {
        question: "It is indispensable that our team ___ French to facilitate our integration.",
        options: ["apprenne", "apprend", "apprendra", "apprenait"],
        correct: 0,
        explanation: "'Il est indispensable que' requires the subjunctive present form: 'apprenne'."
      }
    ],
    levels: {
      beginner: {
        title: "Beginner Level (A1)",
        description: "You are just starting your French learning journey. This is the perfect moment to build solid foundations with our customized method!",
        recommendation: "En Pièce or Fast Integration Package — 6 months"
      },
      elementary: {
        title: "Elementary Level (A2)",
        description: "You understand simple phrases and can communicate about familiar topics in Abidjan.",
        recommendation: "Fast Integration Package — 3 months"
      },
      intermediate: {
        title: "Intermediate Level (B1/B2)",
        description: "You can express yourself with confidence on various topics and interact professionally in Abidjan.",
        recommendation: "Professional French Program — 2 months"
      }
    },
    ui: {
      question: "Question",
      of: "of",
      next: "Next question",
      results: "View results",
      redo: "Retake test",
      book: "Share score & Book now",
      explanationTitle: "Explanation:"
    }
  }
};

let currentQuestionIndex = 0;
let userAnswers = [];
let selectedOption = null;
let isAnswered = false;

function getActiveQuestions() {
  const lang = window.getLang ? window.getLang() : 'fr';
  return quizTranslations[lang].questions;
}

function getActiveUI() {
  const lang = window.getLang ? window.getLang() : 'fr';
  return quizTranslations[lang].ui;
}

function selectOption(element, optionIndex) {
  if (isAnswered) return;
  
  isAnswered = true;
  selectedOption = optionIndex;
  userAnswers.push(optionIndex);
  
  const questions = getActiveQuestions();
  const ui = getActiveUI();
  const question = questions[currentQuestionIndex];
  
  const optionsElements = document.querySelectorAll('.quiz-option');
  
  optionsElements.forEach((opt, idx) => {
    opt.classList.add('disabled-state');
    if (idx === question.correct) {
      opt.classList.add('correct');
    } else if (idx === optionIndex) {
      opt.classList.add('incorrect');
    }
  });
  
  // Show explanation dynamically using safe DOM methods
  const explanationDiv = document.createElement('div');
  explanationDiv.className = 'quiz-explanation-box';
  explanationDiv.style.marginTop = '20px';
  explanationDiv.style.padding = '15px';
  explanationDiv.style.borderRadius = '8px';
  explanationDiv.style.background = '#f0f7ff';
  explanationDiv.style.borderLeft = '4px solid #2563eb';
  explanationDiv.style.fontSize = '0.95rem';
  explanationDiv.style.color = '#1e3a8a';
  explanationDiv.style.animation = 'fadeInUp 0.3s ease forwards';
  
  const explanationTitleElement = document.createElement('strong');
  explanationTitleElement.textContent = ui.explanationTitle + ' ';
  explanationDiv.appendChild(explanationTitleElement);
  explanationDiv.appendChild(document.createTextNode(question.explanation));
  
  document.getElementById('quiz-question').appendChild(explanationDiv);
  
  // Enable next button
  document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
  const questions = getActiveQuestions();
  currentQuestionIndex++;
  isAnswered = false;
  selectedOption = null;
  
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    showResult();
  }
}

function displayQuestion() {
  const questions = getActiveQuestions();
  const ui = getActiveUI();
  const question = questions[currentQuestionIndex];
  const questionElement = document.getElementById('quiz-question');
  
  // Safe text content clearing
  questionElement.textContent = '';
  
  // 1. Question Number
  const qNum = document.createElement('div');
  qNum.className = 'question-number';
  qNum.textContent = `${ui.question} ${currentQuestionIndex + 1}`;
  questionElement.appendChild(qNum);
  
  // 2. Question Text
  const qText = document.createElement('div');
  qText.className = 'question-text';
  qText.textContent = question.question;
  questionElement.appendChild(qText);
  
  // 3. Quiz Options Wrapper
  const quizOptionsWrapper = document.createElement('div');
  quizOptionsWrapper.className = 'quiz-options';
  
  question.options.forEach((option, index) => {
    const optDiv = document.createElement('div');
    optDiv.className = 'quiz-option';
    optDiv.addEventListener('click', function() {
      selectOption(optDiv, index);
    });
    
    const optRadio = document.createElement('div');
    optRadio.className = 'option-radio';
    optDiv.appendChild(optRadio);
    
    const optText = document.createElement('div');
    optText.className = 'option-text';
    optText.textContent = option;
    optDiv.appendChild(optText);
    
    quizOptionsWrapper.appendChild(optDiv);
  });
  
  questionElement.appendChild(quizOptionsWrapper);
  
  // Update progress
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  document.getElementById('progress-fill').style.width = progress + '%';
  document.getElementById('current-question').textContent = currentQuestionIndex + 1;
  document.getElementById('total-questions').textContent = questions.length;
  
  // Reset buttons
  document.getElementById('next-btn').disabled = true;
  document.getElementById('next-btn').textContent = currentQuestionIndex === questions.length - 1 ? ui.results : ui.next;
}

function showResult() {
  const questions = getActiveQuestions();
  const lang = window.getLang ? window.getLang() : 'fr';
  const data = quizTranslations[lang];
  const ui = data.ui;
  
  // Calculate score
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].correct) {
      score++;
    }
  }
  
  // Determine level
  let levelObj;
  if (score <= 2) {
    levelObj = data.levels.beginner;
  } else if (score <= 4) {
    levelObj = data.levels.elementary;
  } else {
    levelObj = data.levels.intermediate;
  }
  
  // Update result display
  document.getElementById('result-score').textContent = `${score}/${questions.length}`;
  document.getElementById('result-level').textContent = levelObj.title;
  document.getElementById('result-description').textContent = levelObj.description;
  document.getElementById('result-recommendation').textContent = levelObj.recommendation;
  
  // Share results on WhatsApp CTA action
  const bookBtn = document.querySelector('.btn-download');
  if (bookBtn) {
    // Redo text
    const bookSpan = bookBtn.querySelector('[data-i18n="quiz.res.btn.book"]') || bookBtn;
    bookSpan.textContent = ui.book;
    
    bookBtn.onclick = function(e) {
      e.preventDefault();
      const waMsg = lang === 'en'
        ? `📅 *My French Level Test Result on DANETUDES*\n\n📈 Score: ${score}/${questions.length}\n🎯 Level: ${levelObj.title}\n📚 Course Recommendation: ${levelObj.recommendation}\n\nI would like to schedule my free diagnostic interview now!`
        : `📅 *Résultat de mon test de niveau de français DANETUDES*\n\n📈 Score : ${score}/${questions.length}\n🎯 Niveau : ${levelObj.title}\n📚 Parcours recommandé : ${levelObj.recommendation}\n\nJe souhaite planifier mon entretien diagnostic offert !`;
      const waUrl = `https://wa.me/22589767600?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    };
  }
  
  // Show result and hide quiz
  document.querySelector('.quiz-container').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'block';
}

function restartQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];
  selectedOption = null;
  isAnswered = false;
  
  // Reset progress
  document.getElementById('progress-fill').style.width = '20%';
  document.getElementById('current-question').textContent = '1';
  
  // Show quiz and hide result
  document.querySelector('.quiz-container').style.display = 'block';
  document.getElementById('quiz-result').style.display = 'none';
  
  // Display first question
  displayQuestion();
}

// Global language hook for real-time translation toggle
window.updateQuizLang = function(lang) {
  const ui = getActiveUI();
  
  // Update header titles if applicable
  const h2El = document.querySelector('.resources-header h2');
  const pEl = document.querySelector('.resources-header p');
  if (h2El && window.TRANSLATIONS?.[lang]?.[h2El.getAttribute('data-i18n')]) {
    h2El.textContent = window.TRANSLATIONS[lang][h2El.getAttribute('data-i18n')];
  }
  if (pEl && window.TRANSLATIONS?.[lang]?.[pEl.getAttribute('data-i18n')]) {
    pEl.textContent = window.TRANSLATIONS[lang][pEl.getAttribute('data-i18n')];
  }
  
  // If in quiz phase, re-render question
  if (document.querySelector('.quiz-container').style.display !== 'none') {
    displayQuestion();
  } else {
    // If in result phase, re-evaluate result display text
    showResult();
  }
};

// Initialize quiz on load
document.addEventListener('DOMContentLoaded', function() {
  displayQuestion();
});
