/**
 * Digital Footprint Shield - Main App Component
 * ENHANCED: Kenya-focused with Swahili support and emergency features
 */
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import AssessmentForm from './components/AssessmentForm'
import ScoreCard from './components/ScoreCard'
import ActionPlan from './components/ActionPlan'
import ResponseAssistant from './components/ResponseAssistant'
import Library from './components/Library'
import LiteracyHub from './components/LiteracyHub'
import AICompanion from './components/AICompanion'
import GamifiedChallenges from './components/GamifiedChallenges'
import BrowserExtensionDemo from './components/BrowserExtensionDemo'

function App() {
  // Global state - persisted to localStorage
  const [assessmentAnswers, setAssessmentAnswers] = useState(() => {
    const saved = localStorage.getItem('dfs_assessment')
    return saved ? JSON.parse(saved) : null
  })

  const [safetyScore, setSafetyScore] = useState(() => {
    const saved = localStorage.getItem('dfs_score')
    return saved ? JSON.parse(saved) : null
  })

  // Current view state
  const [currentView, setCurrentView] = useState('home')
  
  // Language state
  const [showSwahili, setShowSwahili] = useState(false)
  
  // AI Companion state
  const [isCompanionOpen, setIsCompanionOpen] = useState(false)

  // Persist state changes to localStorage
  useEffect(() => {
    if (assessmentAnswers) {
      localStorage.setItem('dfs_assessment', JSON.stringify(assessmentAnswers))
    }
  }, [assessmentAnswers])

  useEffect(() => {
    if (safetyScore) {
      localStorage.setItem('dfs_score', JSON.stringify(safetyScore))
    }
  }, [safetyScore])

  // Clear all data
  const handleClearData = () => {
    const msg = showSwahili 
      ? 'Futa data yako yote? Hii haiwezi kutenduliwa.'
      : 'Clear all your data? This cannot be undone.'
    if (confirm(msg)) {
      localStorage.removeItem('dfs_assessment')
      localStorage.removeItem('dfs_score')
      setAssessmentAnswers(null)
      setSafetyScore(null)
      setCurrentView('home')
    }
  }

  // Handle assessment completion
  const handleAssessmentComplete = (answers, score) => {
    setAssessmentAnswers(answers)
    setSafetyScore(score)
    setCurrentView('results')
  }

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Navigation */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        hasResults={!!safetyScore}
        onClearData={handleClearData}
        showSwahili={showSwahili}
      />

      {/* Main content area */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Privacy reassurance banner */}
        <div className="text-center mb-6 animate-fade-in">
          <span className="privacy-badge">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            {showSwahili 
              ? 'Hakuna akaunti inayohitajika. Data yako inabaki kwenye kivinjari chako.'
              : 'No account required. Your data stays in your browser.'}
          </span>
        </div>

        {/* Conditional content based on view */}
        {currentView === 'home' && (
          <HomePage 
            setCurrentView={setCurrentView} 
            hasResults={!!safetyScore}
            showSwahili={showSwahili}
            setShowSwahili={setShowSwahili}
          />
        )}

        {currentView === 'assessment' && (
          <AssessmentForm 
            onComplete={handleAssessmentComplete}
            existingAnswers={assessmentAnswers}
          />
        )}

        {currentView === 'results' && safetyScore && (
          <div className="space-y-8 animate-stagger">
            <ScoreCard score={safetyScore} />
            <ActionPlan answers={assessmentAnswers} score={safetyScore} />
          </div>
        )}

        {currentView === 'assistant' && (
          <ResponseAssistant />
        )}

        {currentView === 'library' && (
          <Library />
        )}

        {currentView === 'literacy' && (
          <LiteracyHub />
        )}

        {currentView === 'challenges' && (
          <GamifiedChallenges showSwahili={showSwahili} />
        )}

        {currentView === 'extension' && (
          <BrowserExtensionDemo showSwahili={showSwahili} />
        )}

        {currentView === 'companion' && (
          <AICompanion />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-charcoal/50">
        <p>{showSwahili ? 'Imejengwa na 💜 kwa usalama wa kidijitali' : 'Built with 💜 for digital safety'}</p>
        <p className="mt-1">{showSwahili ? 'Faragha yako ni muhimu. Hatukufuatilii.' : 'Your privacy matters. We don\'t track you.'}</p>
        <p className="mt-2 text-xs">🇰🇪 {showSwahili ? 'Iliyoundwa kwa Kenya' : 'Made for Kenya'}</p>
      </footer>

      {/* Floating AI Companion Button */}
      <button
        onClick={() => setIsCompanionOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-deep-purple to-sunrise-orange
                   rounded-full shadow-lg flex items-center justify-center
                   hover:scale-110 transition-transform z-40 group"
        aria-label={showSwahili ? 'Fungua Msaidizi' : 'Open Safety Companion'}
      >
        <span className="text-2xl">💬</span>
        {/* Tooltip */}
        <span className="absolute right-16 bg-charcoal text-white text-xs px-3 py-1.5 rounded-lg
                         opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {showSwahili ? 'Ongea na Msaidizi' : 'Chat with Companion'}
        </span>
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-sunrise-orange animate-ping opacity-30" />
      </button>

      {/* AI Companion Modal */}
      <AICompanion 
        isOpen={isCompanionOpen} 
        onClose={() => setIsCompanionOpen(false)}
        showSwahili={showSwahili}
      />
    </div>
  )
}

/**
 * Home Page Component - Kenya-focused
 * Landing page with feature overview and impact stats
 */
function HomePage({ setCurrentView, hasResults, showSwahili, setShowSwahili }) {
  return (
    <div className="text-center space-y-8 py-4 animate-slide-up">
      {/* Language toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowSwahili(!showSwahili)}
          className="px-4 py-2 rounded-full text-sm font-medium
                     bg-light-lilac text-deep-purple hover:bg-deep-purple hover:text-white
                     transition-all flex items-center gap-2"
        >
          {showSwahili ? '🇬🇧 English' : '🇰🇪 Kiswahili'}
        </button>
      </div>

      {/* Hero */}
      <div className="space-y-4">
        <div className="text-6xl mb-4">🛡️</div>
        <h1 className="text-3xl md:text-4xl font-bold text-deep-purple">
          Digital Footprint Shield
        </h1>
        <p className="text-lg text-charcoal/70 max-w-xl mx-auto">
          {showSwahili 
            ? 'Tathmini usalama wako wa mtandaoni, tengeneza mpango wa hatua, na upate msaada wa kukabiliana na unyanyasaji — yote kwa faragha, yote bure.'
            : 'Assess your online safety, create an action plan, and get help responding to harassment — all private, all free.'}
        </p>
        <p className="text-sm text-sunrise-orange font-medium">
          🇰🇪 {showSwahili ? 'Iliyoundwa kwa wanawake wa Kenya' : 'Built for Kenyan women'}
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-red-700 mb-3">
          {showSwahili ? '🆘 Nambari za Dharura Kenya' : '🆘 Kenya Emergency Numbers'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="tel:999" className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold hover:bg-red-200 transition-colors">
            🚨 999 (Police)
          </a>
          <a href="tel:1195" className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold hover:bg-purple-200 transition-colors">
            💜 1195 (GBV Hotline)
          </a>
          <a href="tel:0800723253" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold hover:bg-blue-200 transition-colors">
            📱 0800 723 253 (DCI)
          </a>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => setCurrentView('assessment')}
          className="btn-primary text-lg"
        >
          {hasResults 
            ? (showSwahili ? 'Fanya Upya Tathmini' : 'Retake Assessment')
            : (showSwahili ? 'Anza Tathmini ya Usalama' : 'Start Safety Assessment')}
        </button>
        {hasResults && (
          <button 
            onClick={() => setCurrentView('results')}
            className="btn-secondary text-lg"
          >
            {showSwahili ? 'Angalia Matokeo Yangu' : 'View My Results'}
          </button>
        )}
      </div>

      {/* Impact Statistics */}
      <div className="bg-deep-purple/5 rounded-2xl p-6 border border-deep-purple/10">
        <h3 className="text-sm font-semibold text-deep-purple/70 uppercase tracking-wide mb-4">
          {showSwahili ? 'Kwa Nini Hii Ni Muhimu Kenya' : 'Why This Matters in Kenya'}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-deep-purple">60%</div>
            <div className="text-xs text-charcoal/60 mt-1">
              {showSwahili ? 'Wanawake wa Kenya wanaopata unyanyasaji wa mtandaoni' : 'Kenyan women experience online harassment'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sunrise-orange">80%</div>
            <div className="text-xs text-charcoal/60 mt-1">
              {showSwahili ? 'Hawajui jinsi ya kuripoti' : 'Don\'t know how to report'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-deep-purple">100%</div>
            <div className="text-xs text-charcoal/60 mt-1">
              {showSwahili ? 'Faragha - Data haiondoki kifaa chako' : 'Private - Data never leaves your device'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Companion - Highlighted */}
      <div className="pt-4">
        <button
          onClick={() => setCurrentView('companion')}
          className="w-full card bg-gradient-to-r from-deep-purple to-purple-600 text-white p-6
                     hover:shadow-glow hover:scale-[1.01] transition-all duration-300 text-left
                     border-2 border-sunrise-orange/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">💜</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">
                  {showSwahili ? 'Ongea na Mwenzako wa Usalama' : 'Talk to Your Safety Companion'}
                </h3>
                <span className="px-2 py-0.5 bg-sunrise-orange text-white text-xs font-bold rounded-full">
                  NEW
                </span>
              </div>
              <p className="text-white/80 mt-1">
                {showSwahili 
                  ? 'Pata msaada wa kihisia, mwongozo, na mtu wa kuongea naye wakati wowote.'
                  : 'Get emotional support, guidance, and someone to talk to anytime.'}
              </p>
            </div>
            <span className="text-2xl">→</span>
          </div>
        </button>
      </div>

      {/* Feature cards - Main */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <FeatureCard 
          icon="📋"
          title={showSwahili ? "Tathmini ya Faragha" : "Privacy Check"}
          description={showSwahili 
            ? "Tathmini ya haraka ya maswali 10 kutambua udhaifu"
            : "Quick 10-question security assessment"}
          onClick={() => setCurrentView('assessment')}
        />
        <FeatureCard 
          icon="💬"
          title={showSwahili ? "Msaidizi wa Majibu" : "Response Assistant"}
          description={showSwahili 
            ? "Pata violezo 4 vya majibu ya kisheria"
            : "Get 4 legal response templates"}
          onClick={() => setCurrentView('assistant')}
        />
        <FeatureCard 
          icon="🎓"
          title={showSwahili ? "Kituo cha Elimu" : "Digital Literacy Hub"}
          description={showSwahili 
            ? "Mafunzo, majaribio, na miongozo ya usalama"
            : "Tutorials, quizzes, and safety guides"}
          onClick={() => setCurrentView('literacy')}
        />
        <FeatureCard 
          icon="📚"
          title={showSwahili ? "Rasilimali za Kenya" : "Kenya Resources"}
          description={showSwahili 
            ? "Mashirika ya msaada na jinsi ya kuripoti"
            : "Support orgs and reporting guides"}
          onClick={() => setCurrentView('library')}
        />
      </div>

      {/* Feature cards - Additional */}
      <div className="grid md:grid-cols-2 gap-4 pt-2">
        <FeatureCard 
          icon="🏆"
          title={showSwahili ? "Changamoto za Usalama" : "Safety Challenges"}
          description={showSwahili 
            ? "Pata pointi na beji kwa kazi za usalama"
            : "Earn points and badges for safety tasks"}
          onClick={() => setCurrentView('challenges')}
          isNew={true}
        />
        <FeatureCard 
          icon="🧩"
          title={showSwahili ? "Kiendelezi cha Kivinjari" : "Browser Extension Demo"}
          description={showSwahili 
            ? "Angalia dhana ya kiendelezi (maonyesho)"
            : "Preview extension concept (design mockup)"}
          onClick={() => setCurrentView('extension')}
        />
      </div>

      {/* Quick Chat Link */}
      <div className="text-center pt-4">
        <button 
          onClick={() => setCurrentView('companion')}
          className="text-deep-purple hover:text-sunrise-orange text-sm font-medium 
                     transition-colors underline decoration-dotted underline-offset-4"
        >
          💜 {showSwahili ? 'Unahitaji mtu wa kuongea naye sasa? Ongea na AI yetu.' : 'Need someone to talk to? Chat with our AI companion.'}
        </button>
      </div>

      {/* Legal Reference */}
      <div className="bg-light-lilac/50 rounded-2xl p-4 text-left">
        <h4 className="font-semibold text-deep-purple text-sm mb-2">
          ⚖️ {showSwahili ? 'Jua Haki Zako' : 'Know Your Rights'}
        </h4>
        <p className="text-xs text-charcoal/70">
          {showSwahili 
            ? 'Unyanyasaji wa mtandaoni ni kinyume cha sheria Kenya chini ya Sheria ya Computer Misuse and Cybercrimes Act 2018. Unaweza kuripoti kwa DCI Cybercrime Unit (0800 723 253) na kupata msaada wa kisheria bure kutoka FIDA Kenya.'
            : 'Online harassment is illegal in Kenya under the Computer Misuse and Cybercrimes Act 2018. You can report to the DCI Cybercrime Unit (0800 723 253) and get free legal help from FIDA Kenya.'}
        </p>
      </div>

      {/* Trust indicators */}
      <div className="pt-4 border-t border-light-lilac">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-charcoal/60">
          <span className="flex items-center gap-2">
            <span className="text-green-500">✓</span> 
            {showSwahili ? 'Hakuna kuingia kunahitajika' : 'No login required'}
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-500">✓</span> 
            {showSwahili ? 'Data inabaki kifaa chako' : 'Data stays on your device'}
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-500">✓</span> 
            {showSwahili ? 'Bure 100%' : '100% free'}
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-500">✓</span> 
            {showSwahili ? 'Inafanya kazi bila mtandao' : 'Works offline'}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Feature Card Component
 */
function FeatureCard({ icon, title, description, onClick, isNew }) {
  return (
    <button 
      onClick={onClick}
      className="card text-left hover:shadow-medium transition-all duration-300 
                 hover:-translate-y-1 cursor-pointer group relative"
    >
      {isNew && (
        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-sunrise-orange text-white 
                         text-xs font-bold rounded-full animate-pulse">
          NEW
        </span>
      )}
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-deep-purple mb-1">{title}</h3>
      <p className="text-xs text-charcoal/70">{description}</p>
    </button>
  )
}

export default App
