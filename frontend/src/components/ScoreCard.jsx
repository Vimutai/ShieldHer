import { useState, useEffect } from 'react';

/**
 * Premium ScoreCard Component
 * Standout safety score display with advanced percentage visualization
 */
function ScoreCard({ score, onRetake, onViewDetails }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate score counting up
    let start = 0;
    const duration = 2000;
    const increment = score.overall / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score.overall) {
        setAnimatedScore(score.overall);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start)); // FIXED: was setAnimatedValue
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [score.overall]);

  // Enhanced score levels with premium styling
  const getScoreLevel = (value) => {
    if (value >= 90) return {
      level: 'excellent',
      label: 'Privacy Champion',
      gradient: 'from-emerald-500 via-green-500 to-emerald-400',
      bgGradient: 'bg-gradient-to-br from-emerald-500 to-green-600',
      ring: 'ring-4 ring-emerald-200',
      message: "Exceptional! You're setting the standard for digital safety.",
      icon: '🏆'
    };
    if (value >= 75) return {
      level: 'great', 
      label: 'Very Secure',
      gradient: 'from-blue-500 via-cyan-500 to-blue-400',
      bgGradient: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      ring: 'ring-4 ring-blue-200',
      message: "Excellent work! Your digital footprint is well-protected.",
      icon: '🛡️'
    };
    if (value >= 60) return {
      level: 'good',
      label: 'Good Standing', 
      gradient: 'from-purple-500 via-indigo-500 to-purple-400',
      bgGradient: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      ring: 'ring-4 ring-purple-200',
      message: "Solid foundation! A few enhancements could maximize your safety.",
      icon: '✅'
    };
    if (value >= 45) return {
      level: 'moderate',
      label: 'Needs Improvement',
      gradient: 'from-amber-500 via-yellow-500 to-amber-400',
      bgGradient: 'bg-gradient-to-br from-amber-500 to-yellow-600',
      ring: 'ring-4 ring-amber-200',
      message: "You're on the right track. Let's strengthen your privacy settings.",
      icon: '📈'
    };
    if (value >= 30) return {
      level: 'vulnerable',
      label: 'At Risk',
      gradient: 'from-orange-500 via-red-500 to-orange-400',
      bgGradient: 'bg-gradient-to-br from-orange-500 to-red-600',
      ring: 'ring-4 ring-orange-200',
      message: "Important areas need attention. Follow the action plan below.",
      icon: '⚠️'
    };
    return {
      level: 'critical',
      label: 'High Risk',
      gradient: 'from-red-600 via-rose-500 to-red-500',
      bgGradient: 'bg-gradient-to-br from-red-600 to-rose-700',
      ring: 'ring-4 ring-red-200',
      message: "Immediate action recommended. Your digital safety requires urgent attention.",
      icon: '🚨'
    };
  };

  const scoreInfo = getScoreLevel(score.overall);

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      
      {/* Premium Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-deep-purple to-sunrise-orange rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <span className="text-3xl">🔒</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-deep-purple to-sunrise-orange bg-clip-text text-transparent mb-4">
          Safety Assessment
        </h1>
        <p className="text-charcoal/60 text-lg">
          Completed on {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Premium Score Visualization */}
        <div className="card p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-deep-purple to-sunrise-orange rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-deep-purple to-sunrise-orange rounded-full translate-y-24 -translate-x-24" />
          </div>

          {/* Main Score Circle */}
          <div className="relative z-10">
            <div className="relative w-64 h-64 mx-auto mb-8">
              {/* Outer Glow */}
              <div className={`absolute inset-0 rounded-full ${scoreInfo.ring} opacity-60`} />
              
              {/* Animated Score Ring */}
              <svg className="w-full h-full transform -rotate-90">
                {/* Background track */}
                <circle
                  cx="128"
                  cy="128"
                  r="112"
                  fill="none"
                  stroke="#EDE6F7"
                  strokeWidth="16"
                  strokeDasharray="4 8"
                />
                {/* Animated progress */}
                <circle
                  cx="128"
                  cy="128"
                  r="112"
                  fill="none"
                  stroke="url(#premiumGradient)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={`${(score.overall / 100) * 704} 704`}
                  className="transition-all duration-2000 ease-out"
                />
                <defs>
                  <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4B2E83" />
                    <stop offset="50%" stopColor="#7E57C2" />
                    <stop offset="100%" stopColor="#F79E38" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-black bg-gradient-to-r from-deep-purple to-sunrise-orange bg-clip-text text-transparent mb-2">
                    {animatedScore}
                  </div>
                  <div className="text-lg text-charcoal/60 font-medium">OUT OF 100</div>
                </div>
              </div>

              {/* Percentage Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg border border-white">
                  <div className="text-xs text-charcoal/60 font-semibold">PERCENTILE</div>
                  <div className="text-lg font-bold text-deep-purple">
                    Top {Math.max(1, 100 - score.overall)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Score Badge with Icon */}
            <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold ${scoreInfo.bgGradient} shadow-xl mb-6`}>
              <span className="text-2xl">{scoreInfo.icon}</span>
              <div className="text-center">
                <div className="text-sm opacity-90">YOUR RATING</div>
                <div className="text-xl">{scoreInfo.label}</div>
              </div>
            </div>

            {/* Score Message */}
            <p className="text-charcoal/70 text-center text-lg leading-relaxed mb-8">
              {scoreInfo.message}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onRetake}
                className="btn-secondary flex-1 flex items-center justify-center gap-3 py-4 text-lg font-semibold"
              >
                <span>🔄</span>
                <span>Retake Test</span>
              </button>
              <button
                onClick={onViewDetails}
                className="btn-primary flex-1 flex items-center justify-center gap-3 py-4 text-lg font-semibold"
              >
                <span>📊</span>
                <span>View Details</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Enhanced Breakdown */}
        <div className="space-y-6">
          
          {/* Category Breakdown */}
          <div className="card p-6">
            <h3 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-3">
              <span className="text-2xl">📈</span>
              Category Performance
            </h3>
            <div className="space-y-5">
              {Object.entries(score.categories).map(([category, value]) => (
                <EnhancedCategoryScore key={category} category={category} value={value} />
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          {score.riskAreas && score.riskAreas.length > 0 && (
            <div className="card p-6 bg-gradient-to-br from-red-50/80 to-orange-50/80 border border-red-200/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                Priority Actions
              </h3>
              <div className="space-y-3">
                {score.riskAreas.map((risk, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 bg-white/50 rounded-xl border border-red-200/30">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-charcoal/80 font-medium pt-1">{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="text-2xl font-bold text-deep-purple mb-1">
                {Math.round(score.overall / 20)}/5
              </div>
              <div className="text-xs text-charcoal/60 font-semibold">SAFETY STARS</div>
            </div>
            <div className="card p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-2xl font-bold text-deep-purple mb-1">
                {Object.values(score.categories).filter(v => v >= 70).length}
              </div>
              <div className="text-xs text-charcoal/60 font-semibold">STRONG AREAS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced Category Score Component
 * Premium category breakdown with advanced percentage visualization
 */
function EnhancedCategoryScore({ category, value }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setAnimatedValue(value);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  const getColorConfig = (v) => {
    if (v >= 85) return {
      gradient: 'from-emerald-500 to-green-400',
      bg: 'bg-emerald-500',
      text: 'text-emerald-600'
    };
    if (v >= 70) return {
      gradient: 'from-blue-500 to-cyan-400', 
      bg: 'bg-blue-500',
      text: 'text-blue-600'
    };
    if (v >= 55) return {
      gradient: 'from-purple-500 to-indigo-400',
      bg: 'bg-purple-500',
      text: 'text-purple-600'
    };
    if (v >= 40) return {
      gradient: 'from-amber-500 to-yellow-400',
      bg: 'bg-amber-500',
      text: 'text-amber-600'
    };
    return {
      gradient: 'from-red-500 to-orange-400',
      bg: 'bg-red-500',
      text: 'text-red-600'
    };
  };

  const colorConfig = getColorConfig(value);
  const categoryConfig = {
    visibility: { icon: '👁️', label: 'Profile Visibility', description: 'Social media privacy settings' },
    location: { icon: '📍', label: 'Location Sharing', description: 'GPS and location data' },
    identity: { icon: '🪪', label: 'Identity Protection', description: 'Personal information exposure' },
    security: { icon: '🔐', label: 'Account Security', description: 'Passwords and 2FA' },
    network: { icon: '👥', label: 'Network Privacy', description: 'Friend lists and connections' },
    awareness: { icon: '🧠', label: 'Privacy Awareness', description: 'Monitoring and knowledge' },
  };

  const config = categoryConfig[category] || { icon: '📊', label: category, description: 'Category performance' };

  return (
    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-light-lilac/50 backdrop-blur-sm hover:border-deep-purple/30 transition-all duration-300">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-gradient-to-br from-deep-purple/10 to-sunrise-orange/10 rounded-2xl flex items-center justify-center">
          <span className="text-xl">{config.icon}</span>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-charcoal text-lg">{config.label}</div>
          <div className="text-sm text-charcoal/50">{config.description}</div>
        </div>
      </div>
      
      <div className="text-right ml-4">
        {/* Percentage Display */}
        <div className="text-2xl font-black bg-gradient-to-r from-deep-purple to-sunrise-orange bg-clip-text text-transparent mb-1">
          {animatedValue}%
        </div>
        
        {/* Progress Bar */}
        <div className="w-24 h-2 bg-light-lilac rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colorConfig.gradient} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;