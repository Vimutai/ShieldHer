/**
 * Enhanced AssessmentForm Component
 * Standout privacy assessment with animated transitions and better feedback
 */
import { useState, useEffect } from 'react'
import { calculateScore } from '../utils/scoreCalculator'

/* ---------- QUESTIONS (kept here so this file is standalone) ---------- */
const QUESTIONS = [
  { id: 'social_public', text: 'Are any of your social media profiles set to public?', category: 'visibility', icon: '👁️', weight: 3, tip: 'Public profiles can be viewed by anyone, including strangers. Consider switching to private.' },
  { id: 'location_sharing', text: 'Do you share your location on social media (check-ins, geotags)?', category: 'location', icon: '📍', weight: 4, tip: 'Location data can reveal your daily patterns and home address. Be mindful of real-time sharing.' },
  { id: 'real_name', text: 'Do you use your real full name on most online accounts?', category: 'identity', icon: '🪪', weight: 2, tip: 'Real names make it easier to find and connect your accounts across platforms.' },
  { id: 'password_reuse', text: 'Do you use the same password for multiple accounts?', category: 'security', icon: '🔐', weight: 4, tip: 'Password reuse puts all accounts at risk if one gets compromised. Use a password manager!' },
  { id: 'two_factor', text: 'Have you enabled two-factor authentication on important accounts?', category: 'security', icon: '✅', weight: 3, invertScore: true, tip: '2FA prevents 99% of automated attacks. Enable it on email, banking, and social media.' },
  { id: 'personal_info', text: 'Is sensitive info like phone/address visible on online profiles?', category: 'identity', icon: '📱', weight: 5, tip: 'This information can be used for harassment, doxxing, or physical stalking.' },
  { id: 'photo_sharing', text: 'Do you share photos showing your home, workplace, or daily routine?', category: 'location', icon: '📸', weight: 3, tip: 'Photos can reveal locations through backgrounds, landmarks, or metadata.' },
  { id: 'friend_lists', text: 'Are your friend/follower lists visible to the public?', category: 'network', icon: '👥', weight: 2, tip: 'Visible connections can be used to target your friends and family.' },
  { id: 'google_yourself', text: "Have you Googled yourself recently to see what's public?", category: 'awareness', icon: '🔍', weight: 2, invertScore: true, tip: 'Regular self-searches help you discover and remove unexpected data exposure.' },
  { id: 'data_broker', text: 'Have you checked if your info is on data broker sites?', category: 'awareness', icon: '📊', weight: 2, invertScore: true, tip: 'Data brokers compile and sell personal information. You can opt-out.' },
]

/* ---------- Small presentational subcomponents (compact) ---------- */
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

  const cfg = categoryConfig[category] || { icon: '📊', label: category }

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-light-lilac">
      <div className="flex items-center gap-3">
        <span className="text-xl">{cfg.icon}</span>
        <div>
          <div className="font-medium text-charcoal">{cfg.label}</div>
          <div className="text-sm text-charcoal/60">{value}% secure</div>
        </div>
      </div>
      <div className="w-20">
        <div className="h-2 bg-light-lilac rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${getColor(value)} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
        </div>
      </div>
    </div>
  )
}

/* ---------- Main combined page ---------- */
export default function CombinedAssessmentPage({ initialAnswers = {} }) {
  const [answers, setAnswers] = useState(initialAnswers)
  const [step, setStep] = useState(0)
  const [showTip, setShowTip] = useState(false)
  const [direction, setDirection] = useState('next')
  const [view, setView] = useState('form') // 'form' | 'score' | 'results'
  const [score, setScore] = useState(null)
  const [showSwahili, setShowSwahili] = useState(false)
  const [completedActions, setCompletedActions] = useState(new Set())

  const currentQuestion = QUESTIONS[step]
  const progress = ((step + 1) / QUESTIONS.length) * 100
  const canProceed = answers[currentQuestion?.id] !== undefined

  // Action items with state management
  const actionItems = [
    { 
      id: 'privacy', 
      text: 'Set your social media profiles to private', 
      reason: 'Your profiles are publicly accessible'
    },
    { 
      id: 'location', 
      text: 'Disable location sharing on social media', 
      reason: 'Location sharing reveals your whereabouts'
    },
    { 
      id: 'passwords', 
      text: 'Use unique passwords for each account', 
      reason: 'Password reuse puts multiple accounts at risk'
    },
    { 
      id: '2fa', 
      text: 'Enable two-factor authentication', 
      reason: 'Adds an extra layer of security'
    }
  ]

  // Keep handlers compact
  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
    setShowTip(true)
  }

  const handleNext = () => {
    setDirection('next')
    setShowTip(false)
    if (step === QUESTIONS.length - 1) {
      const computed = calculateScore(answers, QUESTIONS)
      setScore(computed)
      setView('score')
    } else {
      setTimeout(() => setStep(s => s + 1), 220)
    }
  }

  const handleBack = () => {
    setDirection('back')
    setShowTip(false)
    if (step > 0) setTimeout(() => setStep(s => s - 1), 220)
  }

  const onRetake = () => {
    setAnswers({})
    setStep(0)
    setScore(null)
    setView('form')
    setCompletedActions(new Set())
  }

  const onViewActionPlan = () => setView('results')

  const toggleAction = (actionId) => {
    setCompletedActions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(actionId)) {
        newSet.delete(actionId)
      } else {
        newSet.add(actionId)
      }
      return newSet
    })
  }

  // Minimal header
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Digital Safety — Quick Check</h1>
          <p className="text-sm text-charcoal/70">Short, focused — get results and a compact action plan.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSwahili(s => !s)} className="px-3 py-1 text-sm rounded-xl border">{showSwahili ? 'EN' : 'SW'}</button>
          <button onClick={() => setView(view === 'form' ? 'results' : 'form')} className="px-3 py-1 text-sm rounded-xl border">{view === 'form' ? 'Action Plan' : 'Assessment'}</button>
        </div>
      </div>

      {/* CONDENSED FORM VIEW */}
      {view === 'form' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-charcoal/60">Question {step + 1} / {QUESTIONS.length}</div>
            <div className="text-sm text-charcoal/60">{Math.round(progress)}%</div>
          </div>

          <div className={`p-6 rounded-xl border ${direction === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="text-2xl">{currentQuestion.icon}</div>
              <div>
                <div className="font-semibold text-lg">{currentQuestion.text}</div>
                <div className="text-xs text-charcoal/60 mt-1">{currentQuestion.tip}</div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              {[{ value: true, label: showSwahili ? 'Ndiyo' : 'Yes', emoji: '✅' }, { value: false, label: showSwahili ? 'Hapana' : 'No', emoji: '❌' }].map(opt => (
                <button key={String(opt.value)} onClick={() => handleAnswer(opt.value)} className={`flex-1 py-3 rounded-xl font-semibold ${answers[currentQuestion.id] === opt.value ? 'bg-deep-purple text-white' : 'bg-white border hover:shadow-sm'}`}>
                  <div className="flex items-center justify-center gap-2">{opt.emoji}<span>{opt.label}</span></div>
                </button>
              ))}
            </div>

            {showTip && <div className="mt-4 p-3 rounded-lg bg-light-lilac/40 text-sm">{showSwahili ? 'Kwa nini hili ni muhimu:' : 'Why this matters:'} {currentQuestion.tip}</div>}
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleBack} disabled={step === 0} className="flex-1 py-2 rounded-xl border disabled:opacity-40">← Back</button>
            <button onClick={handleNext} disabled={!canProceed} className="flex-1 py-2 rounded-xl bg-deep-purple text-white disabled:opacity-50">{step === QUESTIONS.length - 1 ? (showSwahili ? 'Tazama Matokeo' : 'See Results') : (showSwahili ? 'Ifuatayo' : 'Next')}</button>
          </div>

          {/* minimal progress dots */}
          <div className="flex gap-2 justify-center mt-4">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-deep-purple w-6' : i < step ? 'bg-sunrise-orange' : 'bg-light-lilac'}`} />
            ))}
          </div>
        </div>
      )}

      {/* SCORE VIEW */}
      {view === 'score' && score && (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{showSwahili ? 'Alama Yako' : 'Your Score'}</h2>
            <p className="text-charcoal/60">{showSwahili ? 'Kulingana na majibu yako' : 'Based on your answers'}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Score Circle */}
            <div className="flex flex-col items-center justify-center p-4">
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" strokeWidth="10" stroke="#f3f4f6" fill="none" />
                  <circle cx="100" cy="100" r="85" strokeWidth="10" strokeLinecap="round" 
                          stroke="url(#scoreGradient)" 
                          strokeDasharray={`${(score.overall / 100) * 534} 534`} 
                          transform="rotate(-90 100 100)" 
                          className="transition-all duration-1000 ease-out" />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4B2E83" />
                      <stop offset="100%" stopColor="#F79E38" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-charcoal">{score.overall}</div>
                  <div className="text-sm text-charcoal/60 mt-1">/ 100</div>
                </div>
              </div>

              <div className={`px-6 py-2 rounded-full font-semibold ${
                score.overall >= 80 ? 'bg-green-100 text-green-800' :
                score.overall >= 60 ? 'bg-blue-100 text-blue-800' :
                score.overall >= 40 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {score.label || 'Score'}
              </div>

              <p className="text-center text-charcoal/70 mt-4 px-4">
                {score.message || (showSwahili ? 'Angalia mpango wa vitendo hapa chini' : 'Check out your action plan below')}
              </p>

              <div className="flex gap-3 mt-6 w-full max-w-xs">
                <button onClick={onRetake} className="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">
                  {showSwahili ? 'Fanya Upya' : 'Retake'}
                </button>
                <button onClick={onViewActionPlan} className="flex-1 py-3 rounded-xl bg-deep-purple text-white hover:bg-purple-800 transition-colors">
                  {showSwahili ? 'Mpango wa Vitendo' : 'Action Plan'}
                </button>
              </div>
            </div>

            {/* Category Scores */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">{showSwahili ? 'Vipimo vya Kategoria' : 'Category Breakdown'}</h3>
              
              {Object.entries(score.categories).map(([cat, val]) => {
                const categoryConfig = {
                  visibility: { icon: '👁️', label: showSwahili ? 'Uonekano wa Wasifu' : 'Profile Visibility' },
                  location: { icon: '📍', label: showSwahili ? 'Ugawaji wa Eneo' : 'Location Sharing' },
                  identity: { icon: '🪪', label: showSwahili ? 'Ulinzi wa Utambulisho' : 'Identity Protection' },
                  security: { icon: '🔐', label: showSwahili ? 'Usalama wa Akaunti' : 'Account Security' },
                  network: { icon: '👥', label: showSwahili ? 'Faragha ya Mtandao' : 'Network Privacy' },
                  awareness: { icon: '🧠', label: showSwahili ? 'Ufahamu wa Faragha' : 'Privacy Awareness' },
                }

                const cfg = categoryConfig[cat] || { icon: '📊', label: cat }
                const getBarColor = (v) => {
                  if (v >= 80) return 'bg-green-500'
                  if (v >= 60) return 'bg-blue-500'
                  if (v >= 40) return 'bg-yellow-500'
                  if (v >= 20) return 'bg-orange-500'
                  return 'bg-red-500'
                }

                return (
                  <div key={cat} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{cfg.icon}</span>
                        <span className="font-medium text-charcoal">{cfg.label}</span>
                      </div>
                      <span className={`font-semibold ${
                        val >= 80 ? 'text-green-600' :
                        val >= 60 ? 'text-blue-600' :
                        val >= 40 ? 'text-yellow-600' :
                        val >= 20 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {val}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${getBarColor(val)}`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-deep-purple">{QUESTIONS.length}</div>
              <div className="text-sm text-charcoal/60">{showSwahili ? 'Maswali' : 'Questions'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sunrise-orange">
                {Object.values(answers).filter(a => a === true).length}
              </div>
              <div className="text-sm text-charcoal/60">{showSwahili ? 'Majibu Mazuri' : 'Secure Answers'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-charcoal">
                {Math.round((Object.values(answers).filter(a => a === true).length / QUESTIONS.length) * 100)}%
              </div>
              <div className="text-sm text-charcoal/60">{showSwahili ? 'Kiwango cha Usalama' : 'Security Rate'}</div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS / ACTION PLAN */}
      {view === 'results' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-charcoal">ShieldHer</h1>
            <p className="text-charcoal/60 mt-2">Short, focused — get results and a compact action plan.</p>
          </div>

          {/* Main Action Plan Section */}
          <div className="bg-gradient-to-r from-deep-purple/5 to-sunrise-orange/5 p-6 rounded-xl border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Action Plan</h2>
                <p className="text-sm text-charcoal/60">Practical steps you can take now</p>
              </div>
              <div className="text-sm text-charcoal/60">Last: {new Date().toLocaleDateString()}</div>
            </div>

            {/* Priority Actions */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-charcoal mb-3">Priority Actions</h3>
              
              {actionItems.map((action) => {
                const isCompleted = completedActions.has(action.id)
                return (
                  <div key={action.id} className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}>
                        {isCompleted && <span className="text-white text-sm">✓</span>}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${isCompleted ? 'text-charcoal/60 line-through' : 'text-charcoal'}`}>
                          {action.text}
                        </div>
                        <div className="text-sm text-charcoal/60 mt-1">{action.reason}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleAction(action.id)}
                      className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isCompleted 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-deep-purple text-white hover:bg-purple-800'
                      }`}
                    >
                      {isCompleted ? 'Completed' : 'Mark done'}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Quick Security Tips */}
            <div className="mb-6">
              <h3 className="font-semibold text-charcoal mb-3">Quick Security Tips</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Review connected apps and remove unused ones',
                  'Regularly check your privacy settings',
                  'Be cautious about sharing personal information',
                  'Use a password manager for better security',
                  'Avoid public Wi-Fi for sensitive activities',
                  'Keep your apps and devices updated'
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-sunrise-orange mt-0.5">•</span>
                    <span className="text-sm text-charcoal/80">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Resources */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600">🆘</span>
              </div>
              <h3 className="font-semibold text-red-800">Emergency Resources</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { number: '1195', label: 'Gender Violence' },
                { number: '999', label: 'Emergency Services' },
                { number: '0800 723 253', label: 'Counseling Support' }
              ].map((resource, index) => (
                <a 
                  key={index}
                  href={`tel:${resource.number.replace(/\s/g, '')}`}
                  className="bg-white p-4 rounded-lg border border-red-200 text-center hover:bg-red-100 transition-colors group"
                >
                  <div className="font-semibold text-red-700 text-lg group-hover:text-red-800">
                    {resource.number}
                  </div>
                  <div className="text-sm text-red-600 mt-1">
                    {resource.label}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => setView('form')}
              className="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              Edit Answers
            </button>
            <button 
              onClick={onRetake}
              className="flex-1 py-3 rounded-xl bg-deep-purple text-white hover:bg-purple-800 transition-colors font-medium"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { QUESTIONS }