/**
 * Score Calculator Utility
 * Calculates digital safety score based on assessment answers
 * 
 * SCORING LOGIC:
 * - Each question has a weight (1-5) indicating its importance
 * - Some questions are "inverted" (Yes = good, like 2FA enabled)
 * - Score is calculated per category and overall
 * - Risk areas are identified from high-weight questions answered "risky"
 */

/**
 * Calculate the overall safety score and category breakdown
 * @param {Object} answers - Map of questionId to boolean answer
 * @param {Array} questions - Array of question objects with weights and categories
 * @returns {Object} Score object with overall, categories, and riskAreas
 */
export function calculateScore(answers, questions) {
  // Initialize category scores
  const categoryScores = {}
  const categoryMaxScores = {}
  const riskAreas = []

  // Calculate scores
  questions.forEach(question => {
    const { id, category, weight, invertScore } = question
    const answer = answers[id]

    // Initialize category if needed
    if (!categoryScores[category]) {
      categoryScores[category] = 0
      categoryMaxScores[category] = 0
    }

    // Add to max possible score for this category
    categoryMaxScores[category] += weight

    // Skip if not answered
    if (answer === undefined) return

    // Determine if the answer is "safe"
    // - For normal questions: No = safe (e.g., "Is your profile public?" No = good)
    // - For inverted questions: Yes = safe (e.g., "Do you have 2FA?" Yes = good)
    const isSafeAnswer = invertScore ? answer : !answer

    if (isSafeAnswer) {
      // Add points for safe answers
      categoryScores[category] += weight
    } else if (weight >= 3) {
      // Track high-weight risky items
      riskAreas.push(getRiskMessage(question))
    }
  })

  // Calculate percentage scores per category
  const categories = {}
  Object.keys(categoryScores).forEach(category => {
    const maxScore = categoryMaxScores[category]
    categories[category] = maxScore > 0 
      ? Math.round((categoryScores[category] / maxScore) * 100)
      : 100
  })

  // Calculate overall score (weighted average)
  let totalWeightedScore = 0
  let totalMaxScore = 0

  questions.forEach(question => {
    const { id, weight, invertScore } = question
    const answer = answers[id]
    totalMaxScore += weight

    if (answer === undefined) {
      // Neutral for unanswered - give half points
      totalWeightedScore += weight * 0.5
    } else {
      const isSafeAnswer = invertScore ? answer : !answer
      if (isSafeAnswer) {
        totalWeightedScore += weight
      }
    }
  })

  const overall = totalMaxScore > 0 
    ? Math.round((totalWeightedScore / totalMaxScore) * 100)
    : 50

  return {
    overall,
    categories,
    riskAreas: riskAreas.slice(0, 5), // Limit to top 5 risks
    timestamp: new Date().toISOString(),
  }
}

/**
 * Generate a user-friendly risk message from a question
 * @param {Object} question - Question object
 * @returns {string} Risk message
 */
function getRiskMessage(question) {
  const messages = {
    social_public: 'Your social media profiles are publicly accessible',
    location_sharing: 'Location sharing reveals your whereabouts',
    password_reuse: 'Password reuse puts multiple accounts at risk',
    two_factor: 'Important accounts lack two-factor authentication',
    personal_info: 'Personal contact info is visible online',
    photo_sharing: 'Photos may reveal your location or routine',
  }

  return messages[question.id] || question.text
}

/**
 * Get score interpretation and recommendations
 * @param {number} score - Overall score 0-100
 * @returns {Object} Interpretation with level, message, and color
 */
export function interpretScore(score) {
  if (score >= 80) {
    return {
      level: 'excellent',
      message: 'Your digital footprint is well protected!',
      color: 'green',
      emoji: '🏆',
    }
  }
  if (score >= 60) {
    return {
      level: 'good',
      message: 'Good foundation, but room for improvement.',
      color: 'blue',
      emoji: '👍',
    }
  }
  if (score >= 40) {
    return {
      level: 'moderate',
      message: 'Several areas need attention.',
      color: 'yellow',
      emoji: '⚠️',
    }
  }
  if (score >= 20) {
    return {
      level: 'needs-work',
      message: 'Your digital footprint is quite exposed.',
      color: 'orange',
      emoji: '🔶',
    }
  }
  return {
    level: 'critical',
    message: 'Urgent: Take immediate steps to protect yourself.',
    color: 'red',
    emoji: '🚨',
  }
}

// Default export for convenience
export default { calculateScore, interpretScore }
