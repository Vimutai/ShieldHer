/**
 * Results Component
 * Displays assessment results and recommendations
 */
import { useState, useEffect } from 'react'

function Results({ showSwahili, assessmentData }) {
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Mock results data - replace with actual assessment data
  const mockResults = {
    overallScore: 72,
    riskLevel: showSwahili ? 'Wastani' : 'Medium',
    lastUpdated: new Date().toLocaleDateString(),
    categories: [
      {
        name: showSwahili ? 'Faragha ya Mtandao' : 'Online Privacy',
        score: 65,
        icon: '👁️',
        recommendations: [
          showSwahili ? 'Weka wasifu wako kuwa wa faragha' : 'Set your profiles to private',
          showSwahili ? 'Tengeneza nywila imara' : 'Create strong passwords',
          showSwahili ? 'Zima ufuatiliaji wa eneo' : 'Turn off location tracking'
        ]
      },
      {
        name: showSwahili ? 'Usalama wa Akaunti' : 'Account Security',
        score: 80,
        icon: '🔐',
        recommendations: [
          showSwahili ? 'Washa uthibitishaji wa hatua mbili' : 'Enable two-factor authentication',
          showSwahili ? 'Kagua programu zilizounganishwa' : 'Review connected apps'
        ]
      },
      {
        name: showSwahili ? 'Ufahamu wa Udanganyifu' : 'Scam Awareness',
        score: 70,
        icon: '🎣',
        recommendations: [
          showSwahili ? 'Jifunze kutambua udanganyifu wa phishing' : 'Learn to spot phishing scams',
          showSwahili ? 'Kamata ushahidi wa unyanyasaji' : 'Document harassment evidence'
        ]
      }
    ],
    urgentActions: [
      {
        title: showSwahili ? 'Badilisha Nywila' : 'Change Passwords',
        description: showSwahili ? 'Nywila 3 zimeonekana kwenye uvujaji wa data' : '3 passwords appeared in data breaches',
        priority: 'high',
        icon: '🔑'
      },
      {
        title: showSwahili ? 'Funga Akaunti ya Facebook' : 'Secure Facebook Account',
        description: showSwahili ? 'Mipangilio ya faragha haijawekwa vizuri' : 'Privacy settings not properly configured',
        priority: 'medium',
        icon: '📘'
      }
    ]
  }

  useEffect(() => {
    // Use actual assessment data if available, otherwise use mock data
    setResults(assessmentData || mockResults)
  }, [assessmentData])

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-purple mx-auto mb-4"></div>
          <p className="text-charcoal/60">
            {showSwahili ? 'Inapakua matokeo...' : 'Loading results...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-deep-purple mb-2">
          {showSwahili ? '📊 Matokeo Yangu' : '📊 My Results'}
        </h1>
        <p className="text-charcoal/70">
          {showSwahili 
            ? 'Mapendekezo ya kibinafsi ya kukuza usalama wako wa mtandaoni'
            : 'Personalized recommendations to improve your online safety'}
        </p>
      </div>

      {/* Overall Score Card */}
      <div className="card bg-gradient-to-r from-deep-purple to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">
              {showSwahili ? 'Alama Yako ya Jumla' : 'Your Overall Score'}
            </h2>
            <p className="text-sm opacity-90">
              {showSwahili 
                ? `Kiwango cha Hatari: ${results.riskLevel}`
                : `Risk Level: ${results.riskLevel}`}
            </p>
            <p className="text-xs opacity-70 mt-1">
              {showSwahili 
                ? `Imehakikiwa: ${results.lastUpdated}`
                : `Last assessed: ${results.lastUpdated}`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{results.overallScore}%</div>
            <div className="text-sm opacity-90">
              {showSwahili ? 'Ya usalama' : 'Safety score'}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-sunrise-orange transition-all duration-1000"
            style={{ width: `${results.overallScore}%` }}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {[
          { id: 'overview', label: showSwahili ? 'Maelezo' : 'Overview', icon: '📈' },
          { id: 'actions', label: showSwahili ? 'Vitendo' : 'Actions', icon: '✅' },
          { id: 'progress', label: showSwahili ? 'Maendeleo' : 'Progress', icon: '📊' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2
              ${activeTab === tab.id 
                ? 'bg-deep-purple text-white' 
                : 'bg-light-lilac text-deep-purple hover:bg-deep-purple/10'}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-deep-purple">
              {showSwahili ? 'Vipengele vya Usalama' : 'Security Categories'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {results.categories.map((category, index) => (
                <div key={index} className="card">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h4 className="font-semibold text-charcoal">{category.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-light-lilac rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-deep-purple transition-all duration-1000"
                            style={{ width: `${category.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-deep-purple">
                          {category.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {category.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-charcoal/70 flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-deep-purple">
              {showSwahili ? 'Vitendo Muhimu' : 'Urgent Actions'}
            </h3>
            <div className="space-y-3">
              {results.urgentActions.map((action, index) => (
                <div 
                  key={index}
                  className={`card border-l-4 ${
                    action.priority === 'high' 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-orange-500 bg-orange-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{action.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-charcoal">{action.title}</h4>
                      <p className="text-sm text-charcoal/70">{action.description}</p>
                    </div>
                    <button className="px-4 py-2 bg-deep-purple text-white rounded-xl text-sm hover:bg-deep-purple/90 transition-colors">
                      {showSwahili ? 'Fanya' : 'Take Action'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Safety Tips */}
            <div className="card bg-light-lilac/30">
              <h4 className="font-semibold text-deep-purple mb-3">
                {showSwahili ? '🔒 Vidokezo vya Usalama' : '🔒 Safety Tips'}
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  showSwahili ? 'Kamata picha za skrini za unyanyasaji' : 'Screenshot harassment evidence',
                  showSwahili ? 'Ripoti kwa DCI kwa uhalifu wa mtandao' : 'Report cybercrime to DCI',
                  showSwahili ? 'Tumia nywila tofauti kwa akaunti zote' : 'Use unique passwords for all accounts',
                  showSwahili ? 'Washa uthibitishaji wa hatua mbili' : 'Enable two-factor authentication'
                ].map((tip, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-charcoal/70">
                    <span className="text-green-500">✓</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-deep-purple">
              {showSwahili ? 'Kufuatilia Maendeleo' : 'Progress Tracking'}
            </h3>
            <div className="card text-center py-8">
              <div className="text-6xl mb-4">📈</div>
              <h4 className="font-semibold text-charcoal mb-2">
                {showSwahili ? 'Kufuatilia Maendeleo' : 'Progress Tracking'}
              </h4>
              <p className="text-charcoal/70">
                {showSwahili 
                  ? 'Angalia mabadiliko ya usalama wako wakati unavyochukua hatua'
                  : 'Watch your safety score improve as you take action'}
              </p>
              <button className="mt-4 px-6 py-2 bg-deep-purple text-white rounded-xl hover:bg-deep-purple/90 transition-colors">
                {showSwahili ? 'Anza Kufuatilia' : 'Start Tracking'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Resources */}
      <div className="card bg-red-50 border-2 border-red-200">
        <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
          🆘 {showSwahili ? 'Rasilimali za Dharura' : 'Emergency Resources'}
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <a href="tel:1195" className="p-3 bg-white rounded-xl text-center hover:shadow-md transition-all">
            <div className="text-lg font-bold text-red-600">1195</div>
            <div className="text-sm text-charcoal/70">
              {showSwahili ? 'Mstari wa Misada wa GBV' : 'GBV Support Line'}
            </div>
          </a>
          <a href="tel:999" className="p-3 bg-white rounded-xl text-center hover:shadow-md transition-all">
            <div className="text-lg font-bold text-red-600">999</div>
            <div className="text-sm text-charcoal/70">
              {showSwahili ? 'Polisi Kenya' : 'Kenya Police'}
            </div>
          </a>
          <a href="tel:0800723253" className="p-3 bg-white rounded-xl text-center hover:shadow-md transition-all">
            <div className="text-lg font-bold text-red-600">0800 723 253</div>
            <div className="text-sm text-charcoal/70">DCI Cybercrime</div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Results