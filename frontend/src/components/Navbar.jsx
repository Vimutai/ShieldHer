/**
 * Navbar Component
 * Mobile-first responsive navigation with brand styling
 * ENHANCED: Kenya branding and Swahili labels
 */
import { useState } from 'react'

function Navbar({ currentView, setCurrentView, hasResults, onClearData, showSwahili }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: showSwahili ? 'Nyumbani' : 'Home', icon: '🏠' },
    { id: 'assessment', label: showSwahili ? 'Tathmini' : 'Assessment', icon: '📋' },
    { id: 'assistant', label: showSwahili ? 'Msaidizi' : 'Response Helper', icon: '💬' },
    { id: 'companion', label: showSwahili ? 'Ongea' : 'Talk', icon: '💜', special: true },
    { id: 'literacy', label: showSwahili ? 'Mafunzo' : 'Learn', icon: '🎓' },
    { id: 'library', label: showSwahili ? 'Rasilimali' : 'Resources', icon: '📚' },
  ]

  // Add results tab if user has completed assessment
  if (hasResults) {
    navItems.splice(2, 0, { 
      id: 'results', 
      label: showSwahili ? 'Matokeo' : 'My Results', 
      icon: '📊' 
    })
  }

  const handleNavClick = (viewId) => {
    setCurrentView(viewId)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-deep-purple text-white sticky top-0 z-50 shadow-medium">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Kenya flag */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 font-heading font-bold text-lg
                       hover:text-sunrise-orange transition-colors"
          >
            <span className="text-2xl">🛡️</span>
            <span className="hidden sm:inline">Footprint Shield</span>
            <span className="text-xs hidden md:inline opacity-70">🇰🇪</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${currentView === item.id 
                    ? 'bg-sunrise-orange text-white' 
                    : 'hover:bg-white/10'}`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </button>
            ))}
            
            {/* Emergency button */}
            <a
              href="tel:1195"
              className="ml-2 px-3 py-2 rounded-xl text-sm bg-red-500/20 
                         hover:bg-red-500/40 transition-all flex items-center gap-1"
              title={showSwahili ? "Piga simu ya dharura" : "Emergency hotline"}
            >
              🆘 1195
            </a>
            
            {/* Clear data button */}
            {hasResults && (
              <button
                onClick={onClearData}
                className="ml-2 px-3 py-2 rounded-xl text-sm opacity-70 
                           hover:opacity-100 hover:bg-red-500/20 transition-all"
                title={showSwahili ? "Futa data yangu yote" : "Clear all my data"}
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
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-colors"
              aria-label="Emergency"
            >
              🆘
            </a>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
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
          <div className="md:hidden py-4 border-t border-white/20 animate-fade-in">
            {/* Emergency contacts banner */}
            <div className="mb-4 p-3 bg-red-500/20 rounded-xl">
              <p className="text-xs font-semibold mb-2">
                🆘 {showSwahili ? 'Dharura' : 'Emergency'}
              </p>
              <div className="flex gap-2 flex-wrap">
                <a href="tel:999" className="px-3 py-1 bg-white/20 rounded-full text-xs">
                  999 Police
                </a>
                <a href="tel:1195" className="px-3 py-1 bg-white/20 rounded-full text-xs">
                  1195 GBV
                </a>
                <a href="tel:0800723253" className="px-3 py-1 bg-white/20 rounded-full text-xs">
                  DCI Cyber
                </a>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-3 rounded-xl text-left font-medium transition-all
                    ${currentView === item.id 
                      ? 'bg-sunrise-orange text-white' 
                      : 'hover:bg-white/10'}`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              
              {/* Clear data button (mobile) */}
              {hasResults && (
                <button
                  onClick={onClearData}
                  className="px-4 py-3 rounded-xl text-left text-red-300 
                             hover:bg-red-500/20 transition-all mt-2"
                >
                  🗑️ {showSwahili ? 'Futa Data Yangu' : 'Clear My Data'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
