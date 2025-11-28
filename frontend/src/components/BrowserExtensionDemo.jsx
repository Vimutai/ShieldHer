/**
 * Browser Extension Demo Component
 * Mock UI design for a browser extension concept
 * This is a design mockup only - no real extension functionality
 */
import { useState } from 'react'

function BrowserExtensionDemo({ showSwahili }) {
  const [activeTab, setActiveTab] = useState('scan')
  const [scanStatus, setScanStatus] = useState('idle') // idle, scanning, complete

  const mockScan = () => {
    setScanStatus('scanning')
    setTimeout(() => setScanStatus('complete'), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-deep-purple/10 text-deep-purple text-xs font-bold rounded-full mb-2">
          {showSwahili ? 'DHANA YA MUUNDO' : 'DESIGN CONCEPT'}
        </span>
        <h2 className="text-2xl font-bold text-deep-purple mb-2">
          🧩 {showSwahili ? 'Kiendelezi cha Kivinjari' : 'Browser Extension'}
        </h2>
        <p className="text-charcoal/70">
          {showSwahili 
            ? 'Angalia jinsi kiendelezi cha kivinjari kingeweza kuonekana (maonyesho tu)'
            : 'Preview how a browser extension could look (design mockup only)'}
        </p>
      </div>

      {/* Browser Frame Mockup */}
      <div className="card p-0 overflow-hidden">
        {/* Browser URL Bar */}
        <div className="bg-charcoal/10 px-4 py-2 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-lg px-3 py-1.5 text-sm text-charcoal/60 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            facebook.com/settings/privacy
          </div>
          {/* Extension icon in toolbar */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-deep-purple to-sunrise-orange flex items-center justify-center">
            <span className="text-white text-sm">🛡️</span>
          </div>
        </div>

        {/* Extension Popup */}
        <div className="p-4 bg-soft-cream">
          <div className="bg-white rounded-xl shadow-lg max-w-xs mx-auto overflow-hidden">
            {/* Extension Header */}
            <div className="bg-gradient-to-r from-deep-purple to-deep-purple/90 text-white p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h3 className="font-bold">Footprint Shield</h3>
                  <p className="text-xs text-white/70">
                    {showSwahili ? 'Kulinda Faragha Yako' : 'Protecting Your Privacy'}
                  </p>
                </div>
              </div>
            </div>

            {/* Extension Tabs */}
            <div className="flex border-b border-light-lilac">
              {[
                { id: 'scan', label: showSwahili ? 'Chunguza' : 'Scan', icon: '🔍' },
                { id: 'alerts', label: showSwahili ? 'Tahadhari' : 'Alerts', icon: '🔔' },
                { id: 'settings', label: showSwahili ? 'Mipangilio' : 'Settings', icon: '⚙️' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors
                    ${activeTab === tab.id 
                      ? 'text-deep-purple border-b-2 border-deep-purple bg-light-lilac/30' 
                      : 'text-charcoal/60 hover:text-charcoal'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'scan' && (
                <div className="space-y-4">
                  {/* Current Page Status */}
                  <div className="flex items-center justify-between p-3 bg-light-lilac/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📘</span>
                      <span className="text-sm font-medium">Facebook</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${scanStatus === 'complete' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                      {scanStatus === 'complete' 
                        ? (showSwahili ? '3 Matatizo' : '3 Issues') 
                        : (showSwahili ? 'Haijachunguzwa' : 'Not Scanned')}
                    </span>
                  </div>

                  {/* Scan Button */}
                  <button
                    onClick={mockScan}
                    disabled={scanStatus === 'scanning'}
                    className="w-full py-3 bg-gradient-to-r from-deep-purple to-sunrise-orange text-white
                               rounded-xl font-medium disabled:opacity-70 transition-all hover:shadow-lg"
                  >
                    {scanStatus === 'scanning' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {showSwahili ? 'Inachunguza...' : 'Scanning...'}
                      </span>
                    ) : (
                      showSwahili ? '🔍 Chunguza Ukurasa Huu' : '🔍 Scan This Page'
                    )}
                  </button>

                  {/* Scan Results */}
                  {scanStatus === 'complete' && (
                    <div className="space-y-2 animate-fade-in">
                      <ScanResult 
                        icon="⚠️" 
                        title={showSwahili ? 'Wasifu wa Umma' : 'Public Profile'}
                        description={showSwahili ? 'Wasifu wako unaonekana kwa wote' : 'Your profile is visible to everyone'}
                        severity="high"
                        showSwahili={showSwahili}
                      />
                      <ScanResult 
                        icon="📍" 
                        title={showSwahili ? 'Eneo Linashirikiwa' : 'Location Sharing'}
                        description={showSwahili ? 'Machapisho yanaonyesha eneo' : 'Posts show your location'}
                        severity="medium"
                        showSwahili={showSwahili}
                      />
                      <ScanResult 
                        icon="👥" 
                        title={showSwahili ? 'Orodha ya Marafiki' : 'Friends List'}
                        description={showSwahili ? 'Inaonekana kwa umma' : 'Visible to public'}
                        severity="low"
                        showSwahili={showSwahili}
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <p className="text-sm font-medium text-red-700">
                      {showSwahili ? '🚨 Tahadhari ya Phishing' : '🚨 Phishing Alert'}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {showSwahili 
                        ? 'Tovuti hii inaweza kuwa ya udanganyifu'
                        : 'This site may be attempting phishing'}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                    <p className="text-sm font-medium text-yellow-700">
                      {showSwahili ? '⚠️ Kumbusho la Faragha' : '⚠️ Privacy Reminder'}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      {showSwahili 
                        ? 'Bado hujaweka wasifu wako kuwa wa faragha'
                        : 'You haven\'t set your profile to private'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-3">
                  <SettingToggle 
                    label={showSwahili ? 'Kuchunguza Otomatiki' : 'Auto-Scan Pages'} 
                    defaultOn={true}
                  />
                  <SettingToggle 
                    label={showSwahili ? 'Tahadhari za Phishing' : 'Phishing Alerts'} 
                    defaultOn={true}
                  />
                  <SettingToggle 
                    label={showSwahili ? 'Arifa za Desktop' : 'Desktop Notifications'} 
                    defaultOn={false}
                  />
                  <SettingToggle 
                    label={showSwahili ? 'Hali ya Giza' : 'Dark Mode'} 
                    defaultOn={false}
                  />
                </div>
              )}
            </div>

            {/* Extension Footer */}
            <div className="px-4 py-3 bg-light-lilac/30 border-t border-light-lilac text-center">
              <a 
                href="#" 
                className="text-xs text-deep-purple hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                {showSwahili ? 'Fungua Dashibodi Kamili →' : 'Open Full Dashboard →'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-4">
        <FeatureHighlight
          icon="🔍"
          title={showSwahili ? 'Uchunguzi wa Haraka' : 'Quick Scan'}
          description={showSwahili 
            ? 'Chunguza mipangilio ya faragha ya ukurasa wowote mara moja'
            : 'Instantly scan privacy settings on any page'}
        />
        <FeatureHighlight
          icon="🚨"
          title={showSwahili ? 'Tahadhari za Wakati Halisi' : 'Real-time Alerts'}
          description={showSwahili 
            ? 'Pata onyo kuhusu tovuti za udanganyifu'
            : 'Get warnings about suspicious sites'}
        />
        <FeatureHighlight
          icon="🔒"
          title={showSwahili ? 'Marekebisho ya Haraka' : 'Quick Fixes'}
          description={showSwahili 
            ? 'Rekebisha matatizo ya faragha kwa kubofya moja'
            : 'Fix privacy issues with one click'}
        />
      </div>

      {/* Disclaimer */}
      <div className="card bg-charcoal/5 text-center">
        <p className="text-sm text-charcoal/60">
          ⚠️ {showSwahili 
            ? 'Hii ni dhana ya muundo tu. Kiendelezi halisi cha kivinjari bado hakijatengenezwa.'
            : 'This is a design concept only. An actual browser extension has not been developed.'}
        </p>
        <p className="text-xs text-charcoal/50 mt-2">
          {showSwahili 
            ? 'Ungependa kiendelezi halisi? Tuambie!'
            : 'Want a real extension? Let us know!'}
        </p>
      </div>
    </div>
  )
}

/**
 * Scan Result Item
 */
function ScanResult({ icon, title, description, severity, showSwahili }) {
  const severityColors = {
    high: 'bg-red-50 border-red-200',
    medium: 'bg-orange-50 border-orange-200',
    low: 'bg-yellow-50 border-yellow-200',
  }

  const severityLabels = {
    high: showSwahili ? 'Hatari' : 'High Risk',
    medium: showSwahili ? 'Wastani' : 'Medium',
    low: showSwahili ? 'Chini' : 'Low',
  }

  return (
    <div className={`p-2 rounded-lg border ${severityColors[severity]} flex items-center gap-2`}>
      <span className="text-lg">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-charcoal truncate">{title}</p>
        <p className="text-xs text-charcoal/60 truncate">{description}</p>
      </div>
      <button className="px-2 py-1 bg-deep-purple text-white text-xs rounded-lg hover:bg-deep-purple/90">
        {showSwahili ? 'Rekebisha' : 'Fix'}
      </button>
    </div>
  )
}

/**
 * Settings Toggle
 */
function SettingToggle({ label, defaultOn }) {
  const [isOn, setIsOn] = useState(defaultOn)

  return (
    <div className="flex items-center justify-between p-2 hover:bg-light-lilac/30 rounded-lg transition-colors">
      <span className="text-sm text-charcoal">{label}</span>
      <button
        onClick={() => setIsOn(!isOn)}
        className={`relative w-10 h-5 rounded-full transition-colors
          ${isOn ? 'bg-deep-purple' : 'bg-charcoal/20'}`}
      >
        <span 
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform
            ${isOn ? 'left-5' : 'left-0.5'}`}
        />
      </button>
    </div>
  )
}

/**
 * Feature Highlight Card
 */
function FeatureHighlight({ icon, title, description }) {
  return (
    <div className="card text-center">
      <span className="text-3xl mb-2 block">{icon}</span>
      <h4 className="font-semibold text-charcoal mb-1">{title}</h4>
      <p className="text-xs text-charcoal/60">{description}</p>
    </div>
  )
}

export default BrowserExtensionDemo

