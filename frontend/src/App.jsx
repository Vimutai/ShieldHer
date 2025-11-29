import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import AssessmentForm from './components/AssessmentForm'
import ScoreCard from './components/ScoreCard'
import ActionPlan from './components/ActionPlan'
import HershieldImporter from './components/HershieldImporter.jsx'
import ResponseAssistant from './components/ResponseAssistant'
import PrivacyNotice from './components/PrivacyNotice'
import Footer from './components/Footer'
import DigitalLiteracyHub from './components/DigitalLiteracyHub'
import AICompanion from './components/AICompanion'

function App() {
  const [assessment, setAssessment] = useState(() => 
    JSON.parse(localStorage.getItem('dfs_assessment')) || null
  )
  const [score, setScore] = useState(() => 
    JSON.parse(localStorage.getItem('dfs_score')) || null
  )
  const [hersheidEvidence, setHershieldEvidence] = useState(() => 
    JSON.parse(localStorage.getItem('dfs_hersheid_evidence')) || []
  )
  const [currentView, setCurrentView] = useState('home')
  const [showSwahili, setShowSwahili] = useState(false)
  const [showAICompanion, setShowAICompanion] = useState(false)

  // Handle evidence import from extension
  const handleHershieldImport = (evidence) => {
    console.log('🔍 RAW EVIDENCE FROM EXTENSION:', evidence);
    
    setHershieldEvidence(prev => [...prev, {
      ...evidence,
      importedAt: new Date().toISOString(),
      id: Date.now()
    }])
  }

  // ✅ FIXED: Check for URL evidence when app loads AND when navigating to hersheid
  useEffect(() => {
    const checkForURLEvidence = () => {
      console.log('🔍 Checking URL for evidence...', window.location.href);
      
      // Get evidence from URL parameters - check BOTH search and hash
      const urlParams = new URLSearchParams(window.location.search);
      let evidenceParam = urlParams.get('evidence');
      
      // Also check hash parameters (fallback)
      if (!evidenceParam && window.location.hash.includes('evidence=')) {
        const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
        evidenceParam = hashParams.get('evidence');
      }
      
      console.log('📦 Evidence param found:', !!evidenceParam);
      
      if (evidenceParam) {
        try {
          let evidence;
          try {
            evidence = JSON.parse(decodeURIComponent(evidenceParam));
          } catch (parseError) {
            console.error('Failed to parse evidence:', parseError);
            evidence = { 
              evidence: { 
                commentCount: 1, 
                platforms: ['unknown'],
                importedFrom: 'url_fallback'
              } 
            };
          }
          
          console.log('🎯 Evidence from URL:', evidence);
          
          // Import the evidence
          handleHershieldImport(evidence);
          
          // Clean the URL (remove evidence parameter)
          window.history.replaceState({}, '', window.location.pathname + '#hersheid');
          
          // Navigate to hersheid view to show the imported evidence
          setCurrentView('hersheid');
          
          // Show success message
          setTimeout(() => {
            const commentCount = evidence.evidence?.commentCount || 1;
            alert(`✅ ${commentCount} comments imported from Hershield!`);
          }, 500);
          
        } catch (error) {
          console.error('Failed to process evidence from URL:', error);
        }
      }
    };

    // Check immediately when component mounts (app loads)
    checkForURLEvidence();
    
    // Also check when navigating to hersheid view
    if (currentView === 'hersheid') {
      const interval = setInterval(checkForURLEvidence, 2000);
      return () => clearInterval(interval);
    }
  }, [currentView]);

  // Persist data
  useEffect(() => {
    if (assessment) localStorage.setItem('dfs_assessment', JSON.stringify(assessment))
    if (score) localStorage.setItem('dfs_score', JSON.stringify(score))
    if (hersheidEvidence.length) localStorage.setItem('dfs_hersheid_evidence', JSON.stringify(hersheidEvidence))
  }, [assessment, score, hersheidEvidence])

  const handleClearData = () => {
    if (confirm(showSwahili ? 'Futa data yako?' : 'Clear your data?')) {
      localStorage.clear()
      setAssessment(null)
      setScore(null)
      setHershieldEvidence([])
      setCurrentView('home')
    }
  }

  const handleAssessmentComplete = (answers, newScore) => {
    setAssessment(answers)
    setScore(newScore)
    setCurrentView('results')
  }

  const handleDownloadReport = () => {
    alert('Downloading your safety report...')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        hasResults={!!score}
        onClearData={handleClearData}
        showSwahili={showSwahili}
      />

      <PrivacyNotice isSwahili={showSwahili} variant="banner" />

      <main className="container mx-auto px-4 py-6 max-w-4xl flex-1">
        {/* Current View */}
        {currentView === 'home' && (
          <HomePage 
            setCurrentView={setCurrentView} 
            hasResults={!!score}
            showSwahili={showSwahili}
            setShowSwahili={setShowSwahili}
          />
        )}
        {currentView === 'assessment' && (
          <AssessmentForm onComplete={handleAssessmentComplete} />
        )}
        {currentView === 'results' && score && (
          <div className="space-y-6">
            <EnhancedScoreCard 
              score={score}
              onAddEvidence={(threatType) => setCurrentView('hersheid')}
              onDownloadReport={handleDownloadReport}
              showSwahili={showSwahili}
            />
            <ActionPlan answers={assessment} score={score} />
          </div>
        )}
        {currentView === 'hersheid' && (
          <HershieldImporter 
            onEvidenceImport={handleHershieldImport}
            showSwahili={showSwahili}
            hersheidEvidence={hersheidEvidence}
            onAnalyzeEvidence={(analysisResult, evidence) => {
              if (evidence) {
                setHershieldEvidence(evidence);
              }
              setCurrentView('assistant');
            }}
          />
        )}
        
        {currentView === 'assistant' && (
          <ResponseAssistant 
            importedEvidence={hersheidEvidence}
            showSwahili={showSwahili}
            onBack={() => setCurrentView('hersheid')}
          />
        )}
        {currentView === 'Digitalliteracy' && (
          <DigitalLiteracyHub showSwahili={showSwahili} />
        )}
      </main>

      <Footer isSwahili={showSwahili} />

      {/* FLOATING AI COMPANION BUTTON */}
      <button
        onClick={() => setShowAICompanion(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center z-40 animate-bounce"
        title={showSwahili ? 'Msaidizi wa Usalama' : 'Safety Companion'}
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* AI COMPANION COMPONENT */}
      <AICompanion 
        isOpen={showAICompanion}
        onClose={() => setShowAICompanion(false)}
        showSwahili={showSwahili}
      />
    </div>
  )
}

// EnhancedScoreCard Component (was missing)
function EnhancedScoreCard({ score, onAddEvidence, onDownloadReport, showSwahili }) {
  const getSeverityColor = (score) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getSeverityText = (score) => {
    if (score >= 70) return showSwahili ? 'HATARI KUBWA' : 'HIGH RISK';
    if (score >= 40) return showSwahili ? 'HATARI WASTANI' : 'MEDIUM RISK';
    return showSwahili ? 'HATARI NDOGO' : 'LOW RISK';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {showSwahili ? 'Matokeo ya Tathmini Yako' : 'Your Assessment Results'}
        </h2>
        <div className={`px-4 py-2 ${getSeverityColor(score)} text-white rounded-full font-bold`}>
          {getSeverityText(score)}
        </div>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gray-800 mb-2">{score}%</div>
        <p className="text-gray-600">
          {showSwahili 
            ? 'Kiwango cha hatari ya unyanyasaji mtandaoni'
            : 'Online harassment risk level'
          }
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onAddEvidence}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          {showSwahili ? '➕ Ongeza Ushahidi' : '➕ Add Evidence'}
        </button>
        <button
          onClick={onDownloadReport}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          {showSwahili ? '📥 Pakua Ripoti' : '📥 Download Report'}
        </button>
      </div>
    </div>
  );
}

// HomePage component
function HomePage({ setCurrentView, hasResults, showSwahili, setShowSwahili }) {
  const features = [
    { id: 'assessment', icon: '📋', label: showSwahili ? 'Tathmini' : 'Assessment' },
    { id: 'hersheid', icon: '🛡️', label: 'Hershield' },
    { id: 'assistant', icon: '💬', label: showSwahili ? 'Msaidizi' : 'Helper' },
    { id: 'Digitalliteracy', icon: '📚', label: showSwahili ? 'Rasilimali' : 'Resources' },
  ]

  return (
    <div className="text-center space-y-6">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="text-6xl mb-2">🛡️</div>
        <h1 className="text-4xl font-bold text-gray-800">
          {showSwahili ? 'ShieldHer' : 'ShieldHer'}
        </h1>
        <p className="text-2xl font-semibold text-purple-600 bg-purple-50 py-2 rounded-lg">
          {showSwahili 
            ? 'TUKOMEZE UNYANYASAJI MTANDAONI' 
            : 'END ONLINE GBV'
          }
        </p>
        <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          {showSwahili 
            ? 'Wanawake wote wanastahili kujisikia salama mtandaoni. Tunapambana na unyanyasaji wa kijinsia mtandaoni kwa pamoja.'
            : 'All women deserve to feel safe online. We fight online gender-based violence together.'
          }
        </p>
      </div>

      {/* Safety Message */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg">
        <div className="text-3xl mb-3">💜</div>
        <h2 className="text-xl font-bold mb-2">
          {showSwahili ? 'Usalama Wako Ni Haki Yako' : 'Your Safety Is Your Right'}
        </h2>
        <p className="text-sm opacity-90">
          {showSwahili 
            ? 'Tunakupa vyombo vya kujilinda dhidi ya unyanyasaji wowote mtandaoni'
            : 'We give you tools to protect yourself against any online harassment'
          }
        </p>
      </div>

      {/* Language Toggle */}
      <button
        onClick={() => setShowSwahili(!showSwahili)}
        className="px-6 py-3 bg-purple-100 text-purple-700 rounded-full font-medium hover:bg-purple-200 transition-colors"
      >
        {showSwahili ? '🇬🇧 Switch to English' : '🇰🇪 Badilisha kwa Kiswahili'}
      </button>

      {/* EMERGENCY - More balanced size */}
      <div className="bg-red-500 text-white rounded-xl p-5 shadow-lg">
        <div className="text-2xl mb-2">🚨</div>
        <p className="text-2xl font-bold mb-1">
          1195
        </p>
        <p className="font-semibold mb-2">
          {showSwahili ? 'Nambari ya Dharura' : 'Emergency Hotline'}
        </p>
        <p className="text-sm opacity-90">
          {showSwahili 
            ? 'Unanyanyaswa mtandaoni? Piga simu sasa!'
            : 'Being harassed online? Call now!'
          }
        </p>
      </div>

      {/* Main CTA */}
      <button 
        onClick={() => setCurrentView('assessment')}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all transform hover:scale-105"
      >
        {hasResults 
          ? (showSwahili ? 'Fanya Upya Tathmini Yako' : 'Retake Your Assessment')
          : (showSwahili ? 'ANZA KUJILINDA SASA' : 'START PROTECTING YOURSELF NOW')
        }
      </button>

      {/* Empowerment Message */}
      <div className="bg-white rounded-xl p-5 border-2 border-purple-200">
        <div className="text-2xl mb-2">🌟</div>
        <h3 className="font-bold text-gray-800 mb-2">
          {showSwahili ? 'Umekuja Mahali Sahihi' : 'You Came to the Right Place'}
        </h3>
        <p className="text-sm text-gray-600">
          {showSwahili 
            ? 'ShieldHer inakupa nguvu ya kukabiliana na unyanyasaji mtandaoni kwa majibu salama, ushauri wa kisheria, na rasilimali za kukujenga'
            : 'ShieldHer empowers you to confront online harassment with safe responses, legal advice, and resources to rebuild your confidence'
          }
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-4">
        {features.map(feature => (
          <button
            key={feature.id}
            onClick={() => setCurrentView(feature.id)}
            className="p-4 bg-white rounded-xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{feature.icon}</div>
            <div className="font-semibold text-gray-800 text-sm">{feature.label}</div>
          </button>
        ))}
      </div>

      {/* Final Encouragement */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-green-800 font-medium">
          {showSwahili 
            ? '🔥 Usikubali unyanyasaji. Unastahili heshima na usalama mtandaoni.'
            : '🔥 Don\'t accept harassment. You deserve respect and safety online.'
          }
        </p>
      </div>
    </div>
  )
}

export default App