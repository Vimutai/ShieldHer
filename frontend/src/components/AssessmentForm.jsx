/**
 * Enhanced AssessmentForm Component
 * Standout privacy assessment with animated transitions and better feedback
 */
import { useState, useEffect } from 'react'
import { calculateScore } from '../utils/scoreCalculator'

// Enhanced questions with icons and more detailed categories
const QUESTIONS = [
  {
    id: 'social_public',
    text: 'Are any of your social media profiles set to public?',
    category: 'visibility',
    icon: '👁️',
    weight: 3,
    tip: 'Public profiles can be viewed by anyone, including strangers. Consider switching to private.',
  },
  {
    id: 'location_sharing',
    text: 'Do you share your location on social media (check-ins, geotags)?',
    category: 'location',
    icon: '📍',
    weight: 4,
    tip: 'Location data can reveal your daily patterns and home address. Be mindful of real-time sharing.',
  },
  {
    id: 'real_name',
    text: 'Do you use your real full name on most online accounts?',
    category: 'identity',
    icon: '🪪',
    weight: 2,
    tip: 'Real names make it easier to find and connect your accounts across platforms.',
  },
  {
    id: 'password_reuse',
    text: 'Do you use the same password for multiple accounts?',
    category: 'security',
    icon: '🔐',
    weight: 4,
    tip: 'Password reuse puts all accounts at risk if one gets compromised. Use a password manager!',
  },
  {
    id: 'two_factor',
    text: 'Have you enabled two-factor authentication on important accounts?',
    category: 'security',
    icon: '✅',
    weight: 3,
    invertScore: true,
    tip: '2FA prevents 99% of automated attacks. Enable it on email, banking, and social media.',
  },
  {
    id: 'personal_info',
    text: 'Is sensitive info like phone/address visible on online profiles?',
    category: 'identity',
    icon: '📱',
    weight: 5,
    tip: 'This information can be used for harassment, doxxing, or physical stalking.',
  },
  {
    id: 'photo_sharing',
    text: 'Do you share photos showing your home, workplace, or daily routine?',
    category: 'location',
    icon: '📸',
    weight: 3,
    tip: 'Photos can reveal locations through backgrounds, landmarks, or metadata.',
  },
  {
    id: 'friend_lists',
    text: 'Are your friend/follower lists visible to the public?',
    category: 'network',
    icon: '👥',
    weight: 2,
    tip: 'Visible connections can be used to target your friends and family.',
  },
  {
    id: 'google_yourself',
    text: 'Have you Googled yourself recently to see what\'s public?',
    category: 'awareness',
    icon: '🔍',
    weight: 2,
    invertScore: true,
    tip: 'Regular self-searches help you discover and remove unexpected data exposure.',
  },
  {
    id: 'data_broker',
    text: 'Have you checked if your info is on data broker sites?',
    category: 'awareness',
    icon: '📊',
    weight: 2,
    invertScore: true,
    tip: 'Data brokers compile and sell personal information. You can opt-out.',
  },
]

function AssessmentForm({ onComplete, existingAnswers }) {
  const [answers, setAnswers] = useState(existingAnswers || {})
  const [currentStep, setCurrentStep] = useState(0)
  const [showTip, setShowTip] = useState(false)
  const [direction, setDirection] = useState('next')

  const currentQuestion = QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100
  const isLastQuestion = currentStep === QUESTIONS.length - 1
  const canProceed = answers[currentQuestion?.id] !== undefined

  // Handle answer selection with animation trigger
  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
    setShowTip(true)
  }

  // Enhanced navigation with direction tracking
  const navigate = (newDirection) => {
    setDirection(newDirection)
    setShowTip(false)
  }

  const handleNext = () => {
    navigate('next')
    if (isLastQuestion) {
      const score = calculateScore(answers, QUESTIONS)
      onComplete(answers, score)
    } else {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300)
    }
  }

  const handleBack = () => {
    navigate('back')
    if (currentStep > 0) {
      setTimeout(() => setCurrentStep(prev => prev - 1), 300)
    }
  }

  // Category colors for visual consistency
  const categoryColors = {
    visibility: 'bg-blue-100 text-blue-800 border-blue-200',
    location: 'bg-purple-100 text-purple-800 border-purple-200',
    identity: 'bg-red-100 text-red-800 border-red-200',
    security: 'bg-green-100 text-green-800 border-green-200',
    network: 'bg-orange-100 text-orange-800 border-orange-200',
    awareness: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Enhanced Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-16 h-16 bg-gradient-to-br from-deep-purple to-sunrise-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
          <span className="text-2xl">🔒</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-deep-purple to-sunrise-orange bg-clip-text text-transparent mb-3">
          Digital Safety Check
        </h2>
        <p className="text-charcoal/70 text-lg">
          {currentStep === 0 
            ? "Let's assess your online privacy in 10 quick questions" 
            : "Your privacy matters — every answer helps us protect you better"
          }
        </p>
      </div>

      {/* Enhanced Progress */}
      <div className="mb-8 px-4">
        <div className="flex justify-between text-sm text-charcoal/60 mb-3 font-medium">
          <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-3 bg-light-lilac/50 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-deep-purple to-sunrise-orange 
                       transition-all duration-700 ease-out rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Animated Question Card */}
      <div 
        className={`card p-8 mb-6 relative overflow-hidden 
                   ${direction === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-deep-purple/5 to-sunrise-orange/5 rounded-full -translate-y-16 translate-x-16" />
        
        {/* Category with icon */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">{currentQuestion.icon}</span>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border
                          ${categoryColors[currentQuestion.category]}`}>
            {currentQuestion.category}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-deep-purple/20 to-transparent" />
        </div>

        {/* Question text */}
        <h3 className="text-xl font-semibold text-charcoal mb-8 leading-relaxed">
          {currentQuestion.text}
        </h3>

        {/* Enhanced Answer buttons */}
        <div className="flex gap-4 mb-8">
          {[
            { value: true, label: 'Yes', emoji: '✅' },
            { value: false, label: 'No', emoji: '❌' }
          ].map(({ value, label, emoji }) => (
            <button
              key={value}
              onClick={() => handleAnswer(value)}
              className={`flex-1 py-5 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3
                ${answers[currentQuestion.id] === value
                  ? value 
                    ? 'bg-green-500 text-white shadow-lg transform scale-105' 
                    : 'bg-red-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-charcoal/70 border-2 border-light-lilac hover:border-deep-purple/30 hover:transform hover:scale-105'
                }`}
            >
              <span className="text-xl">{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Enhanced Tip */}
        {showTip && (
          <div className="p-5 bg-gradient-to-r from-sunrise-orange/10 to-deep-purple/10 rounded-2xl border border-sunrise-orange/20 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sunrise-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">💡</span>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Why this matters:</p>
                <p className="text-charcoal/80 leading-relaxed">{currentQuestion.tip}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Navigation */}
      <div className="flex gap-4 px-4">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="btn-secondary flex items-center justify-center gap-2 flex-1 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <span>←</span>
          <span>Back</span>
        </button>
        
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="btn-primary flex items-center justify-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
        >
          <span>{isLastQuestion ? 'See My Results' : 'Next Question'}</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-8">
        {QUESTIONS.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'bg-deep-purple w-6'
                : index < currentStep
                ? 'bg-sunrise-orange'
                : 'bg-light-lilac'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Enhanced ScoreCard Component
 * Premium score display with interactive elements
 */
function ScoreCard({ score, onRetake, onViewActionPlan }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Enhanced score levels with gradients
  const getScoreLevel = (value) => {
    if (value >= 90) return {
      level: 'excellent',
      label: 'Privacy Champion',
      color: 'from-green-500 to-emerald-400',
      bg: 'bg-gradient-to-br from-green-500 to-emerald-400',
      message: "Outstanding! You're a digital safety expert. Share your knowledge with others!"
    }
    if (value >= 75) return {
      level: 'great',
      label: 'Very Secure',
      color: 'from-blue-500 to-cyan-400',
      bg: 'bg-gradient-to-br from-blue-500 to-cyan-400',
      message: "Great work! You're taking excellent care of your digital footprint."
    }
    if (value >= 60) return {
      level: 'good',
      label: 'Good Standing',
      color: 'from-purple-500 to-indigo-400',
      bg: 'bg-gradient-to-br from-purple-500 to-indigo-400',
      message: "You're doing well! A few tweaks could make you even more secure."
    }
    if (value >= 40) return {
      level: 'moderate',
      label: 'Needs Improvement',
      color: 'from-yellow-500 to-amber-400',
      bg: 'bg-gradient-to-br from-yellow-500 to-amber-400',
      message: "There's room for improvement. Let's work on strengthening your privacy."
    }
    if (value >= 20) return {
      level: 'vulnerable',
      label: 'At Risk',
      color: 'from-orange-500 to-red-400',
      bg: 'bg-gradient-to-br from-orange-500 to-red-400',
      message: "Several areas need attention. Follow the action plan to improve your safety."
    }
    return {
      level: 'critical',
      label: 'High Risk',
      color: 'from-red-600 to-rose-500',
      bg: 'bg-gradient-to-br from-red-600 to-rose-500',
      message: "Immediate action needed. Your digital safety requires urgent attention."
    }
  }

  const scoreInfo = getScoreLevel(score.overall)

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Score Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-deep-purple to-sunrise-orange bg-clip-text text-transparent mb-4">
          Your Privacy Score
        </h2>
        <p className="text-charcoal/70 text-lg">
          Based on your assessment on {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: Score Visualization */}
        <div className="card p-8">
          {/* Animated Score Circle */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#EDE6F7"
                strokeWidth="16"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke={`url(#${scoreInfo.level}Gradient)`}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${(score.overall / 100) * 553} 553`}
                className="transition-all duration-2000 ease-out"
              />
              <defs>
                <linearGradient id={`${scoreInfo.level}Gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4B2E83" />
                  <stop offset="100%" stopColor="#F79E38" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-deep-purple">
                {score.overall}
              </span>
              <span className="text-sm text-charcoal/60 mt-1">out of 100</span>
            </div>
          </div>

          {/* Score Badge */}
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold ${scoreInfo.bg} shadow-lg mb-4`}>
            <span className="text-lg">🏆</span>
            <span>{scoreInfo.label}</span>
          </div>

          {/* Score Message */}
          <p className="text-charcoal/70 text-center mb-8 leading-relaxed">
            {scoreInfo.message}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onRetake}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              <span>Retake</span>
            </button>
            <button
              onClick={onViewActionPlan}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <span>📋</span>
              <span>Action Plan</span>
            </button>
          </div>
        </div>

        {/* Right: Detailed Breakdown */}
        <div className="space-y-6">
          {/* Category Breakdown */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
              <span>📊</span>
              Category Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(score.categories).map(([category, value]) => (
                <CategoryScore key={category} category={category} value={value} />
              ))}
            </div>
          </div>

          {/* Risk Areas */}
          {score.riskAreas.length > 0 && (
            <div className="card p-6 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200">
              <h3 className="text-lg font-semibold text-charcoal mb-3 flex items-center gap-2">
                <span>⚠️</span>
                Priority Improvements
              </h3>
              <ul className="space-y-2">
                {score.riskAreas.map((risk, index) => (
                  <li key={index} className="flex items-start gap-3 text-charcoal/80">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths */}
          {score.strengths && score.strengths.length > 0 && (
            <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <h3 className="text-lg font-semibold text-charcoal mb-3 flex items-center gap-2">
                <span>✅</span>
                What You're Doing Well
              </h3>
              <ul className="space-y-2">
                {score.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3 text-charcoal/80">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Enhanced Category Score Component
 */
function CategoryScore({ category, value }) {
  const getColor = (v) => {
    if (v >= 80) return 'from-green-500 to-emerald-400'
    if (v >= 60) return 'from-blue-500 to-cyan-400'
    if (v >= 40) return 'from-yellow-500 to-amber-400'
    if (v >= 20) return 'from-orange-500 to-red-400'
    return 'from-red-500 to-rose-400'
  }

  const categoryConfig = {
    visibility: { icon: '👁️', label: 'Profile Visibility' },
    location: { icon: '📍', label: 'Location Sharing' },
    identity: { icon: '🪪', label: 'Identity Protection' },
    security: { icon: '🔐', label: 'Account Security' },
    network: { icon: '👥', label: 'Network Privacy' },
    awareness: { icon: '🧠', label: 'Privacy Awareness' },
  }

  const config = categoryConfig[category] || { icon: '📊', label: category }

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-light-lilac">
      <div className="flex items-center gap-3">
        <span className="text-xl">{config.icon}</span>
        <div>
          <div className="font-medium text-charcoal">{config.label}</div>
          <div className="text-sm text-charcoal/60">{value}% secure</div>
        </div>
      </div>
      
      <div className="w-20">
        <div className="h-2 bg-light-lilac rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getColor(value)} rounded-full transition-all duration-1000`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export { QUESTIONS }
export default AssessmentForm