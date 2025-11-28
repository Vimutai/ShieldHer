/**
 * Mock Browser Extension UI Component
 * Design demo showing how a browser extension would look
 * This is a visual mockup only - not a real extension
 */
import { useState } from 'react'

function MockExtension({ showSwahili = false }) {
  const [activeTab, setActiveTab] = useState('quick-check')
  const [mockScanResult, setMockScanResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  // Simulate a page scan
  const handleScan = () => {
    setIsScanning(true)
    setMockScanResult(null)
    
    setTimeout(() => {
      setIsScanning(false)
      setMockScanResult({
        safe: Math.random() > 0.3,
        issues: [
          { type: 'privacy', text: showSwahili ? 'Tovuti inakusanya vidakuzi' : 'Site collects cookies' },
          { type: 'tracker', text: showSwahili ? 'Vifuatiliaji 3 vimegunduliwa' : '3 trackers detected' },
        ],
        score: Math.floor(Math.random() * 40) + 60,
      })
    }, 1500)
  }

  return (
    <div className="max-w-md mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 
                         text-xs font-bold rounded-full mb-2">
          {showSwahili ? 'ONYESHO LA MUUNDO' : 'DESIGN MOCKUP'}
        </span>
        <h2 className="text-2xl font-bold text-deep-purple mb-2">
          {showSwahili ? '🧩 Kiendelezi cha Kivinjari' : '🧩 Browser Extension'}
        </h2>
        <p className="text-charcoal/70 text-sm">
          {showSwahili 
            ? 'Hii ni onyesho la jinsi kiendelezi cha kivinjari kingeonekana.'
            : 'This is a mockup of how a browser extension would look.'}
        </p>
      </div>

      {/* Extension Popup Mockup */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-charcoal/10 max-w-[360px] mx-auto">
        {/* Extension Header */}
        <div className="bg-deep-purple text-white px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            🛡️
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Footprint Shield</h3>
            <p className="text-xs text-white/60">v1.0.0</p>
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-white/10 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-light-lilac">
          <button
            onClick={() => setActiveTab('quick-check')}
            className={`flex-1 py-2 text-xs font-medium transition-colors
              ${activeTab === 'quick-check' 
                ? 'text-deep-purple border-b-2 border-deep-purple' 
                : 'text-charcoal/50 hover:text-charcoal'}`}
          >
            {showSwahili ? 'Ukaguzi' : 'Quick Check'}
          </button>
          <button
            onClick={() => setActiveTab('protection')}
            className={`flex-1 py-2 text-xs font-medium transition-colors
              ${activeTab === 'protection' 
                ? 'text-deep-purple border-b-2 border-deep-purple' 
                : 'text-charcoal/50 hover:text-charcoal'}`}
          >
            {showSwahili ? 'Ulinzi' : 'Protection'}
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-2 text-xs font-medium transition-colors
              ${activeTab === 'alerts' 
                ? 'text-deep-purple border-b-2 border-deep-purple' 
                : 'text-charcoal/50 hover:text-charcoal'}`}
          >
            {showSwahili ? 'Arifa' : 'Alerts'}
            <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">2</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'quick-check' && (
            <div className="space-y-4">
              {/* Current Page Status */}
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-light-lilac flex items-center justify-center">
                  {isScanning ? (
                    <svg className="w-8 h-8 text-deep-purple animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : mockScanResult ? (
                    <span className="text-3xl">{mockScanResult.safe ? '✅' : '⚠️'}</span>
                  ) : (
                    <span className="text-3xl">🔍</span>
                  )}
                </div>
                
                {mockScanResult ? (
                  <>
                    <p className={`font-semibold ${mockScanResult.safe ? 'text-green-600' : 'text-orange-600'}`}>
                      {mockScanResult.safe 
                        ? (showSwahili ? 'Ukurasa Uko Salama' : 'Page Looks Safe')
                        : (showSwahili ? 'Matatizo Yamegunduliwa' : 'Issues Found')}
                    </p>
                    <p className="text-xs text-charcoal/50 mt-1">
                      {showSwahili ? 'Alama ya Usalama' : 'Safety Score'}: {mockScanResult.score}/100
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-charcoal/60">
                    {isScanning 
                      ? (showSwahili ? 'Inakagua ukurasa...' : 'Scanning page...')
                      : (showSwahili ? 'Bonyeza kukagua ukurasa huu' : 'Click to scan this page')}
                  </p>
                )}
              </div>

              {/* Scan Button */}
              {!isScanning && (
                <button
                  onClick={handleScan}
                  className="w-full py-2.5 bg-deep-purple text-white text-sm font-medium rounded-xl
                             hover:bg-deep-purple/90 transition-colors"
                >
                  {mockScanResult 
                    ? (showSwahili ? 'Kagua Tena' : 'Scan Again')
                    : (showSwahili ? 'Kagua Ukurasa' : 'Scan Page')}
                </button>
              )}

              {/* Issues List */}
              {mockScanResult && mockScanResult.issues.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-charcoal/60">
                    {showSwahili ? 'Matatizo Yaliyogunduliwa:' : 'Issues Found:'}
                  </p>
                  {mockScanResult.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                      <span className="text-orange-500">⚠️</span>
                      <span className="text-xs text-charcoal">{issue.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'protection' && (
            <div className="space-y-3">
              <ProtectionToggle 
                label={showSwahili ? 'Zuia Vifuatiliaji' : 'Block Trackers'} 
                enabled={true} 
              />
              <ProtectionToggle 
                label={showSwahili ? 'Onya Tovuti za Phishing' : 'Warn Phishing Sites'} 
                enabled={true} 
              />
              <ProtectionToggle 
                label={showSwahili ? 'Ficha Barua Pepe' : 'Hide Email Address'} 
                enabled={false} 
              />
              <ProtectionToggle 
                label={showSwahili ? 'Zuia Vidakuzi vya Watu Wengine' : 'Block Third-Party Cookies'} 
                enabled={true} 
              />
              <ProtectionToggle 
                label={showSwahili ? 'Hali ya HTTPS tu' : 'HTTPS-Only Mode'} 
                enabled={false} 
              />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-3">
              <AlertItem 
                icon="🚨"
                title={showSwahili ? 'Uvujaji wa Data Umegunduliwa' : 'Data Breach Detected'}
                description={showSwahili ? 'Barua pepe yako imo katika uvujaji wa hivi karibuni' : 'Your email was in a recent breach'}
                time="2h ago"
                isNew={true}
              />
              <AlertItem 
                icon="⚠️"
                title={showSwahili ? 'Kuingia kwa Tuhuma' : 'Suspicious Login'}
                description={showSwahili ? 'Kuingia mpya kutoka Mombasa' : 'New login from Mombasa'}
                time="1d ago"
                isNew={true}
              />
              <AlertItem 
                icon="✅"
                title={showSwahili ? 'Nywila Imebadilishwa' : 'Password Changed'}
                description={showSwahili ? 'Akaunti ya Gmail' : 'Gmail account'}
                time="3d ago"
                isNew={false}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-light-lilac/30 border-t border-light-lilac">
          <button className="w-full text-xs text-deep-purple hover:underline">
            {showSwahili ? 'Fungua Dashibodi Kamili →' : 'Open Full Dashboard →'}
          </button>
        </div>
      </div>

      {/* Notice */}
      <div className="text-center p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-700">
          ℹ️ {showSwahili 
            ? 'Hii ni muundo wa kielelezo tu. Kiendelezi halisi cha kivinjari kitapatikana baadaye.'
            : 'This is a design mockup only. An actual browser extension will be available in a future release.'}
        </p>
      </div>
    </div>
  )
}

// Protection Toggle Component
function ProtectionToggle({ label, enabled }) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  
  return (
    <div className="flex items-center justify-between p-2 bg-light-lilac/30 rounded-lg">
      <span className="text-sm text-charcoal">{label}</span>
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`relative w-10 h-5 rounded-full transition-colors
          ${isEnabled ? 'bg-green-500' : 'bg-charcoal/30'}`}
      >
        <span 
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow
            ${isEnabled ? 'left-5' : 'left-0.5'}`}
        />
      </button>
    </div>
  )
}

// Alert Item Component
function AlertItem({ icon, title, description, time, isNew }) {
  return (
    <div className={`p-3 rounded-lg ${isNew ? 'bg-red-50 border border-red-100' : 'bg-light-lilac/30'}`}>
      <div className="flex items-start gap-2">
        <span className="text-lg">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-charcoal truncate">{title}</p>
            {isNew && (
              <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">NEW</span>
            )}
          </div>
          <p className="text-xs text-charcoal/60">{description}</p>
          <p className="text-xs text-charcoal/40 mt-1">{time}</p>
        </div>
      </div>
    </div>
  )
}

export default MockExtension

