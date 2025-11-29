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

  const currentQuestion = QUESTIONS[step]
  const progress = ((step + 1) / QUESTIONS.length) * 100
  const canProceed = answers[currentQuestion?.id] !== undefined

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
  }

  const onViewActionPlan = () => setView('results')

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

      {/* SCORE VIEW (compact) */}
      {view === 'score' && score && (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{showSwahili ? 'Alama Yako' : 'Your Score'}</h2>
              <p className="text-sm text-charcoal/60">Based on your answers</p>
            </div>
            <div className="text-3xl font-bold">{score.overall}</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4">
              <div className="w-36 h-36 mb-3">
                {/* simple circle using SVG */}
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" strokeWidth="12" stroke="#EDE6F7" fill="none" />
                  <circle cx="100" cy="100" r="90" strokeWidth="12" strokeLinecap="round" stroke="url(#g)" strokeDasharray={`${(score.overall / 100) * 565} 565`} transform="rotate(-90 100 100)" />
                  <defs>
                    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4B2E83" />
                      <stop offset="100%" stopColor="#F79E38" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-br from-deep-purple to-sunrise-orange text-white font-bold">{score.label || 'Score'}</div>

              <div className="mt-3 text-sm text-charcoal/70 text-center">{score.message}</div>

              <div className="flex gap-3 mt-4 w-full">
                <button onClick={onRetake} className="flex-1 py-2 rounded-xl border">Retake</button>
                <button onClick={onViewActionPlan} className="flex-1 py-2 rounded-xl bg-deep-purple text-white">Action Plan</button>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(score.categories).map(([cat, val]) => (
                <CategoryScore key={cat} category={cat} value={val} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULTS / ACTION PLAN (compact, re-uses score) */}
      {view === 'results' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{showSwahili ? 'Mpango wa Vitendo' : 'Action Plan'}</h2>
              <p className="text-sm text-charcoal/60">Practical steps you can take now</p>
            </div>
            <div className="text-sm text-charcoal/60">Last: {new Date().toLocaleDateString()}</div>
          </div>

          {/* Urgent actions */}
          <div className="space-y-3">
            {(score?.riskAreas || ['Change weak passwords', 'Enable 2FA']).slice(0,3).map((r, i) => (
              <div key={i} className="p-3 rounded-lg border-l-4 border-red-400 bg-red-50 flex items-start justify-between">
                <div>{r}</div>
                <button className="text-sm px-3 py-1 rounded-xl bg-white border">Mark done</button>
              </div>
            ))}
          </div>

          {/* Quick tips */}
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              showSwahili ? 'Weka wasifu kuwa wa faragha' : 'Set profiles to private',
              showSwahili ? 'Tumia nywila tofauti' : 'Use unique passwords',
              showSwahili ? 'Washa uthibitishaji wa hatua mbili' : 'Enable two-factor authentication',
              showSwahili ? 'Angalia programu zilizounganishwa' : 'Review connected apps'
            ].map((tip, idx) => (
              <div key={idx} className="p-3 bg-light-lilac/20 rounded-xl text-sm">{tip}</div>
            ))}
          </div>

          <div className="flex gap-3 mt-3">
            <button onClick={() => setView('form')} className="flex-1 py-2 rounded-xl border">Edit Answers</button>
            <button onClick={onRetake} className="flex-1 py-2 rounded-xl bg-deep-purple text-white">Retake</button>
          </div>

          {/* emergency resources condensed */}
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm">
            <div className="font-semibold text-red-700 mb-2">🆘 {showSwahili ? 'Rasilimali za Dharura' : 'Emergency Resources'}</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <a href="tel:1195" className="p-2 bg-white rounded">1195</a>
              <a href="tel:999" className="p-2 bg-white rounded">999</a>
              <a href="tel:0800723253" className="p-2 bg-white rounded">0800 723 253</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { QUESTIONS }
