/**
 * Screening Logic Module
 * Calculates scores and interprets screening results
 */

const screeningLogic = (() => {
  // Scoring thresholds for each disorder
  const thresholds = {
    ASD: {
      maxScore: 80,  // 20 questions × 4 max points
      low: 20,       // 25% of max
      moderate: 40,  // 50% of max
      high: 60       // 75% of max
    },
    ADHD: {
      maxScore: 100, // 25 questions × 4 max points
      low: 25,
      moderate: 50,
      high: 75
    },
    Dyslexia: {
      maxScore: 100, // 25 questions × 4 max points
      low: 25,
      moderate: 50,
      high: 75
    }
  };

  /**
   * Calculate total score from answers
   * @param {Array} answers - Array of answer objects with { questionId, score }
   * @returns {number} Total score
   */
  function calculateScore(answers) {
    return answers.reduce((total, answer) => total + (answer.score || 0), 0);
  }

  /**
   * Interpret score based on thresholds
   * @param {number} score - Total score
   * @param {string} disorder - Disorder type (ASD, ADHD, Dyslexia)
   * @returns {object} Interpretation with level and message
   */
  function interpretScore(score, disorder) {
    const threshold = thresholds[disorder];

    if (!threshold) {
      return {
        level: 'unknown',
        message: 'Unable to interpret score for unknown disorder type.'
      };
    }

    const percentage = (score / threshold.maxScore) * 100;

    if (score < threshold.low) {
      return {
        level: 'low',
        severity: 'minimal',
        percentage: Math.round(percentage),
        message: `Based on the screening responses, your child shows minimal indicators for ${disorder}.`,
        recommendation: 'No immediate concerns based on this screening. However, if you have ongoing concerns about your child\'s development, consider consulting with a healthcare professional.',
        color: 'success'
      };
    } else if (score < threshold.moderate) {
      return {
        level: 'low-moderate',
        severity: 'mild',
        percentage: Math.round(percentage),
        message: `Based on the screening responses, your child shows some indicators that may be associated with ${disorder}.`,
        recommendation: 'Consider monitoring your child\'s development and discussing these observations with a pediatrician or developmental specialist. Early consultation can help determine if further evaluation is needed.',
        color: 'warning'
      };
    } else if (score < threshold.high) {
      return {
        level: 'moderate',
        severity: 'moderate',
        percentage: Math.round(percentage),
        message: `Based on the screening responses, your child shows several indicators commonly associated with ${disorder}.`,
        recommendation: 'We recommend scheduling a consultation with a qualified healthcare professional for a comprehensive evaluation. Early intervention can make a significant difference.',
        color: 'warning'
      };
    } else {
      return {
        level: 'high',
        severity: 'significant',
        percentage: Math.round(percentage),
        message: `Based on the screening responses, your child shows multiple indicators strongly associated with ${disorder}.`,
        recommendation: 'We strongly recommend seeking a professional evaluation from a qualified healthcare provider or developmental specialist as soon as possible. Early diagnosis and intervention are important.',
        color: 'danger'
      };
    }
  }

  /**
   * Generate category breakdowns
   * @param {Array} answers - Array of answer objects
   * @param {Array} questions - Array of question objects
   * @returns {object} Category scores
   */
  function generateCategoryBreakdown(answers, questions) {
    const categories = {};

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question && question.category) {
        if (!categories[question.category]) {
          categories[question.category] = {
            total: 0,
            count: 0,
            questions: []
          };
        }
        categories[question.category].total += answer.score;
        categories[question.category].count += 1;
        categories[question.category].questions.push({
          text: question.text,
          score: answer.score
        });
      }
    });

    // Calculate averages
    Object.keys(categories).forEach(category => {
      categories[category].average = categories[category].total / categories[category].count;
    });

    return categories;
  }

  /**
   * Process complete screening
   * @param {string} disorder - Disorder type
   * @param {Array} answers - Array of answers
   * @param {Array} questions - Array of questions
   * @returns {object} Complete screening results
   */
  function processScreening(disorder, answers, questions) {
    const score = calculateScore(answers);
    const interpretation = interpretScore(score, disorder);
    const categoryBreakdown = generateCategoryBreakdown(answers, questions);

    return {
      disorder,
      score,
      maxScore: thresholds[disorder].maxScore,
      interpretation,
      categoryBreakdown,
      answeredQuestions: answers.length,
      totalQuestions: questions.length,
      completionPercentage: Math.round((answers.length / questions.length) * 100),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validate that all questions are answered
   * @param {Array} answers - Array of answers
   * @param {Array} questions - Array of questions
   * @returns {object} Validation result
   */
  function validateAnswers(answers, questions) {
    const unansweredQuestions = questions.filter(q =>
      !answers.some(a => a.questionId === q.id)
    );

    return {
      isValid: unansweredQuestions.length === 0,
      unansweredCount: unansweredQuestions.length,
      unansweredQuestions: unansweredQuestions.map(q => ({
        id: q.id,
        text: q.text
      }))
    };
  }

  /**
   * Get likert scale options
   * @returns {Array} Array of likert scale options
   */
  function getLikertScaleOptions() {
    return [
      { value: 0, label: 'Never', description: 'Not observed' },
      { value: 1, label: 'Rarely', description: 'Once in a while' },
      { value: 2, label: 'Sometimes', description: 'Occasionally' },
      { value: 3, label: 'Often', description: 'Frequently' },
      { value: 4, label: 'Very Often', description: 'Almost always' }
    ];
  }

  /**
   * Generate comparison data for multiple screenings
   * @param {Array} screenings - Array of screening results
   * @returns {object} Comparison data
   */
  function compareScreenings(screenings) {
    if (screenings.length < 2) {
      return null;
    }

    const sorted = screenings.sort((a, b) =>
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    const latest = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2];

    const scoreDiff = latest.score - previous.score;
    const percentageDiff = latest.interpretation.percentage - previous.interpretation.percentage;

    return {
      trend: scoreDiff > 0 ? 'increasing' : scoreDiff < 0 ? 'decreasing' : 'stable',
      scoreDifference: scoreDiff,
      percentageDifference: percentageDiff,
      latestDate: latest.timestamp,
      previousDate: previous.timestamp,
      message: generateTrendMessage(scoreDiff)
    };
  }

  /**
   * Generate trend message
   * @param {number} scoreDiff - Score difference
   * @returns {string} Trend message
   */
  function generateTrendMessage(scoreDiff) {
    if (scoreDiff > 5) {
      return 'Indicators have increased since the last screening. Consider professional consultation.';
    } else if (scoreDiff < -5) {
      return 'Indicators have decreased since the last screening, showing improvement.';
    } else {
      return 'Indicators remain relatively stable compared to the last screening.';
    }
  }

  /**
   * Get disorder information
   * @param {string} disorder - Disorder type
   * @returns {object} Disorder information
   */
  function getDisorderInfo(disorder) {
    const info = {
      ASD: {
        name: 'Autism Spectrum Disorder',
        shortName: 'ASD',
        description: 'A developmental condition affecting social communication and behavior.',
        keyAreas: ['Social interaction', 'Communication', 'Repetitive behaviors', 'Sensory sensitivities']
      },
      ADHD: {
        name: 'Attention-Deficit/Hyperactivity Disorder',
        shortName: 'ADHD',
        description: 'A neurodevelopmental condition affecting attention, impulsivity, and activity level.',
        keyAreas: ['Inattention', 'Hyperactivity', 'Impulsivity']
      },
      Dyslexia: {
        name: 'Dyslexia',
        shortName: 'Dyslexia',
        description: 'A learning difference affecting reading, writing, and spelling skills.',
        keyAreas: ['Reading', 'Writing', 'Phonological awareness', 'Language processing']
      }
    };

    return info[disorder] || null;
  }

  // Public API
  return {
    calculateScore,
    interpretScore,
    processScreening,
    validateAnswers,
    getLikertScaleOptions,
    generateCategoryBreakdown,
    compareScreenings,
    getDisorderInfo,
    thresholds
  };
})();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = screeningLogic;
}
