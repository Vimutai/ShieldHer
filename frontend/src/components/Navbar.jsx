/**
 * Navbar Component
 * Mobile-first responsive navigation with Kenya branding
 * Enhanced with better accessibility and performance
 */
import { useState, useEffect } from 'react'

function Navbar({ currentView, setCurrentView, hasResults, onClearData, showSwahili }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: showSwahili ? 'Nyumbani' : 'Home', icon: '🏠' },
    { id: 'assessment', label: showSwahili ? 'Tathmini' : 'Assessment', icon: '📋' },
    { id: 'hersheid', label: showSwahili ? 'Hershield' : 'Hershield', icon: '🛡️' },
    { id: 'assistant', label: showSwahili ? 'Msaidizi' : 'Response Helper', icon: '💬' },
    { id: 'Digitalliteracy', label: showSwahili ? 'Mafunzo' : 'LearnHub', icon: '🎓' },
  ]

  // Add results to nav if assessment completed
  

  const handleNavClick = (viewId) => {
    setCurrentView(viewId)
    setMobileMenuOpen(false)
  }

  const emergencyContacts = [
    { number: '999', label: showSwahili ? 'Polisi' : 'Police' },
    { number: '1195', label: 'GBV' },
    { number: '0800723253', label: showSwahili ? 'DCI Mitandao' : 'DCI Cyber' },
  ]

  return (
    <nav className={`bg-deep-purple text-white sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-2xl bg-deep-purple/95 backdrop-blur-sm' : 'shadow-medium'
    }`}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 font-heading font-bold text-lg hover:text-sunrise-orange transition-colors group"
            aria-label={showSwahili ? "Kurudi nyumbani" : "Return to home"}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🛡️</span>
            <span className="hidden sm:inline bg-gradient-to-r from-white to-sunrise-orange bg-clip-text text-transparent">
              ShieldHer
            </span>
            <span className="text-xs hidden md:inline opacity-70 animate-pulse">🇰🇪</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 group relative
                  ${currentView === item.id 
                    ? 'bg-sunrise-orange text-white shadow-lg transform scale-105' 
                    : 'hover:bg-white/10 hover:scale-105'}`}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                <span>{item.label}</span>
                
                {/* Active indicator */}
                {currentView === item.id && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                )}
              </button>
            ))}
            
            {/* Emergency button */}
            <a
              href="tel:1195"
              className="ml-2 px-3 py-2 rounded-xl text-sm bg-red-500 hover:bg-red-600 transition-all flex items-center gap-1 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              title={showSwahili ? "Piga simu ya dharura" : "Emergency hotline"}
              aria-label={showSwahili ? "Piga nambari ya dharura 1195" : "Call emergency hotline 1195"}
            >
              🆘 <span className="hidden lg:inline">1195</span>
            </a>
            
            {/* Clear data button */}
            {hasResults && (
              <button
                onClick={onClearData}
                className="ml-2 px-3 py-2 rounded-xl text-sm bg-white/10 hover:bg-red-500/40 transition-all hover:scale-105"
                title={showSwahili ? "Futa data yangu yote" : "Clear all my data"}
                aria-label={showSwahili ? "Futa data" : "Clear data"}
              >
                🗑️
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Emergency quick dial */}
            <a
              href="tel:1195"
              className="p-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors shadow-lg"
              aria-label="Emergency"
            >
              <span className="flex items-center gap-1 text-sm font-semibold">
                🆘
              </span>
            </a>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={showSwahili ? "Fungua menyu" : "Toggle menu"}
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 animate-fade-in bg-deep-purple/95 backdrop-blur-sm">
            {/* Emergency contacts banner */}
            <div className="mb-4 p-3 bg-red-500/20 rounded-xl border border-red-400/30">
              <p className="text-xs font-semibold mb-2 flex items-center gap-2">
                🆘 <span>{showSwahili ? 'Nambari za Dharura' : 'Emergency Contacts'}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {emergencyContacts.map(contact => (
                  <a 
                    key={contact.number}
                    href={`tel:${contact.number}`} 
                    className="px-3 py-1 bg-white/20 rounded-full text-xs hover:bg-white/30 transition-colors flex items-center gap-1"
                  >
                    <span className="font-mono">{contact.number}</span>
                    <span>{contact.label}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-3 rounded-xl text-left font-medium transition-all flex items-center gap-3 group
                    ${currentView === item.id 
                      ? 'bg-sunrise-orange text-white shadow-inner' 
                      : 'hover:bg-white/10'}`}
                  aria-current={currentView === item.id ? 'page' : undefined}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {currentView === item.id && (
                    <span className="text-sm opacity-70">←</span>
                  )}
                </button>
              ))}
              
              {/* Clear data button (mobile) */}
              {hasResults && (
                <button
                  onClick={onClearData}
                  className="px-4 py-3 rounded-xl text-left text-red-300 hover:bg-red-500/20 transition-all mt-2 flex items-center gap-3 border border-red-400/30"
                >
                  <span>🗑️</span>
                  <span className="flex-1">{showSwahili ? 'Futa Data Yangu' : 'Clear My Data'}</span>
                </button>
              )}
            </div>

            {/* Mobile footer */}
            <div className="mt-4 pt-4 border-t border-white/20 text-center">
              <p className="text-xs opacity-70">
                {showSwahili ? 'Imara kama Shujaa' : 'Strong as a Shujaa'} 💪
              </p>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar