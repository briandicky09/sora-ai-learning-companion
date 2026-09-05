/**
 * SORA — Quiz Engine & Concept Weakness Diagnostic
 * Evaluates student comprehension, pinpoints weaknesses, and updates Knowledge Profile
 */

class SoraQuizEngine {
  constructor(app) {
    this.app = app;
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.startTime = null;
    this.isCompleted = false;
  }

  loadQuiz(quizId) {
    const quiz = this.app.data.quizzes.find(q => q.id === quizId) || this.app.data.quizzes[0];
    this.currentQuiz = JSON.parse(JSON.stringify(quiz));
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.startTime = Date.now();
    this.isCompleted = false;
    return this.currentQuiz;
  }

  getCurrentQuestion() {
    if (!this.currentQuiz) return null;
    return this.currentQuiz.questions[this.currentQuestionIndex];
  }

  selectAnswer(choiceId) {
    this.userAnswers[this.currentQuestionIndex] = choiceId;
  }

  getSelectedAnswer() {
    return this.userAnswers[this.currentQuestionIndex] || null;
  }

  hasNextQuestion() {
    return this.currentQuiz && this.currentQuestionIndex < this.currentQuiz.questions.length - 1;
  }

  nextQuestion() {
    if (this.hasNextQuestion()) {
      this.currentQuestionIndex++;
      return this.getCurrentQuestion();
    }
    return null;
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      return this.getCurrentQuestion();
    }
    return null;
  }

  /**
   * Finalize Quiz, calculate score & identify specific concept weaknesses
   */
  evaluateResults() {
    if (!this.currentQuiz) return null;

    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;
    const timeSpentString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds} detik`;

    let correctCount = 0;
    const weakConcepts = [];
    const masteredConcepts = [];

    this.currentQuiz.questions.forEach((q, idx) => {
      const selectedChoice = this.userAnswers[idx];
      const correctOption = q.options.find(opt => opt.correct);
      const isCorrect = selectedChoice === (correctOption ? correctOption.id : null);

      if (isCorrect) {
        correctCount++;
        masteredConcepts.push(q.concept);
      } else {
        weakConcepts.push({
          concept: q.concept,
          question: q.question,
          userAnswer: selectedChoice,
          correctAnswer: correctOption ? correctOption.text : "",
          explanation: q.explanation
        });
      }
    });

    const totalQuestions = this.currentQuiz.questions.length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    const result = {
      quizTitle: this.currentQuiz.title,
      totalQuestions: totalQuestions,
      correctCount: correctCount,
      incorrectCount: totalQuestions - correctCount,
      scorePercent: scorePercent,
      timeSpent: timeSpentString,
      weakConcepts: weakConcepts,
      masteredConcepts: masteredConcepts,
      completedAt: new Date().toISOString()
    };

    // Update global app knowledge profile & adaptive recommendations
    this.app.applyQuizEvaluation(result, this.currentQuiz);
    this.isCompleted = true;

    return result;
  }
}

window.SoraQuizEngine = SoraQuizEngine;
