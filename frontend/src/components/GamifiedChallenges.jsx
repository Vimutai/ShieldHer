/**
 * Gamified Challenges Component
 * Optional feature - stub for gamification elements
 * Encourages users to complete safety tasks through rewards/badges
 */
import { useState, useEffect } from 'react'

// Challenge definitions
const CHALLENGES = [
  {
    id: 'assessment',
    title: 'Safety Scout',
    titleSw: 'Mchunguzi wa Usalama',
    description: 'Complete the Privacy Assessment',
    descriptionSw: 'Kamilisha Tathmini ya Faragha',
    icon: '🔍',
    points: 50,
    badge: '🛡️',
    category: 'starter',
  },
  {
    id: '2fa_enabled',
    title: '2FA Champion',
    titleSw: 'Bingwa wa 2FA',
    description: 'Enable two-factor authentication on 3 accounts',
    descriptionSw: 'Washa 2FA kwenye akaunti 3',
    icon: '🔐',
    points: 100,
    badge: '🏆',
    category: 'security',
  },
  {
    id: 'privacy_lockdown',
    title: 'Privacy Pro',
    titleSw: 'Mtaalamu wa Faragha',
    description: 'Set all social media profiles to private',
    descriptionSw: 'Weka wasifu wote kuwa wa faragha',
    icon: '👁️',
    points: 75,
    badge: '🔒',
    category: 'privacy',
  },
  {
    id: 'password_strength',
    title: 'Password Guardian',
    titleSw: 'Mlinzi wa Nywila',
    description: 'Create unique passwords for 5 accounts',
    descriptionSw: 'Unda nywila tofauti kwa akaunti 5',
    icon: '🔑',
    points: 100,
    badge: '💪',
    category: 'security',
  },
  {
    id: 'literacy_learner',
    title: 'Digital Scholar',
    titleSw: 'Mwanafunzi wa Kidijitali',
    description: 'Complete 3 tutorials in the Literacy Hub',
    descriptionSw: 'Kamilisha mafunzo 3 kwenye Kituo cha Elimu',
    icon: '📚',
    points: 75,
    badge: '🎓',
    category: 'learning',
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    titleSw: 'Bwana wa Majaribio',
    description: 'Score 100% on the scam detection quiz',
    descriptionSw: 'Pata 100% kwenye jaribio la kutambua udanganyifu',
    icon: '❓',
    points: 50,
    badge: '🧠',
    category: 'learning',
  },
  {
    id: 'weekly_checkup',
    title: 'Vigilant Guardian',
    titleSw: 'Mlinzi Makini',
    description: 'Complete weekly security checkup for 4 weeks',
    descriptionSw: 'Kamilisha ukaguzi wa wiki kwa wiki 4',
    icon: '📅',
    points: 200,
    badge: '⭐',
    category: 'advanced',
  },
  {
    id: 'help_others',
    title: 'Community Champion',
    titleSw: 'Bingwa wa Jamii',
    description: 'Share safety tips with 3 friends',
    descriptionSw: 'Shiriki vidokezo vya usalama na marafiki 3',
    icon: '🤝',
    points: 100,
    badge: '💜',
    category: 'community',
  },
]

// Badge levels
const LEVELS = [
  { name: 'Beginner', nameSw: 'Mwanzilishi', minPoints: 0, icon: '🌱' },
  { name: 'Learner', nameSw: 'Mwanafunzi', minPoints: 100, icon: '📖' },
  { name: 'Protector', nameSw: 'Mlinzi', minPoints: 250, icon: '🛡️' },
  { name: 'Guardian', nameSw: 'Msimamizi', minPoints: 500, icon: '⚔️' },
  { name: 'Champion', nameSw: 'Bingwa', minPoints: 750, icon: '👑' },
]

function GamifiedChallenges({ showSwahili }) {
  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem('dfs_challenges')
    return saved ? JSON.parse(saved) : []
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('dfs_challenges', JSON.stringify(completedChallenges))
  }, [completedChallenges])

  // Calculate total points
  const totalPoints = CHALLENGES
    .filter(c => completedChallenges.includes(c.id))
    .reduce((sum, c) => sum + c.points, 0)

  // Get current level
  const currentLevel = [...LEVELS].reverse().find(l => totalPoints >= l.minPoints) || LEVELS[0]
  const nextLevel = LEVELS.find(l => l.minPoints > totalPoints)
  const progressToNext = nextLevel 
    ? ((totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100

  // Toggle challenge completion (for demo purposes)
  const toggleChallenge = (challengeId) => {
    setCompletedChallenges(prev => 
      prev.includes(challengeId)
        ? prev.filter(id => id !== challengeId)
        : [...prev, challengeId]
    )
  }

  // Group challenges by category
  const categories = {
    starter: { label: showSwahili ? '🌟 Kuanza' : '🌟 Getting Started', challenges: [] },
    security: { label: showSwahili ? '🔐 Usalama' : '🔐 Security', challenges: [] },
    privacy: { label: showSwahili ? '👁️ Faragha' : '👁️ Privacy', challenges: [] },
    learning: { label: showSwahili ? '📚 Kujifunza' : '📚 Learning', challenges: [] },
    advanced: { label: showSwahili ? '⭐ Maalumu' : '⭐ Advanced', challenges: [] },
    community: { label: showSwahili ? '🤝 Jamii' : '🤝 Community', challenges: [] },
  }

  CHALLENGES.forEach(c => {
    if (categories[c.category]) {
      categories[c.category].challenges.push(c)
    }
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-sunrise-orange/20 text-sunrise-orange text-xs font-bold rounded-full mb-2">
          {showSwahili ? 'KIPENGELE CHA HIARI' : 'OPTIONAL FEATURE'}
        </span>
        <h2 className="text-2xl font-bold text-deep-purple mb-2">
          🏆 {showSwahili ? 'Changamoto za Usalama' : 'Safety Challenges'}
        </h2>
        <p className="text-charcoal/70">
          {showSwahili 
            ? 'Pata pointi na beji kwa kukamilisha kazi za usalama!'
            : 'Earn points and badges by completing safety tasks!'}
        </p>
      </div>

      {/* Level Card */}
      <div className="card bg-gradient-to-r from-deep-purple to-deep-purple/80 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentLevel.icon}</span>
            <div>
              <p className="text-white/70 text-sm">
                {showSwahili ? 'Kiwango Chako' : 'Your Level'}
              </p>
              <h3 className="text-xl font-bold">
                {showSwahili ? currentLevel.nameSw : currentLevel.name}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{totalPoints}</p>
            <p className="text-white/70 text-sm">
              {showSwahili ? 'pointi' : 'points'}
            </p>
          </div>
        </div>

        {/* Progress to next level */}
        {nextLevel && (
          <div>
            <div className="flex justify-between text-sm text-white/70 mb-1">
              <span>{showSwahili ? 'Kiwango kifuatacho' : 'Next level'}:</span>
              <span>{showSwahili ? nextLevel.nameSw : nextLevel.name} ({nextLevel.minPoints} pts)</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sunrise-orange transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}

        {/* Earned badges */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-white/70 mb-2">
            {showSwahili ? 'Beji Zilizopatikana' : 'Earned Badges'}:
          </p>
          <div className="flex gap-2 flex-wrap">
            {completedChallenges.length > 0 ? (
              CHALLENGES
                .filter(c => completedChallenges.includes(c.id))
                .map(c => (
                  <span 
                    key={c.id} 
                    className="text-2xl"
                    title={showSwahili ? c.titleSw : c.title}
                  >
                    {c.badge}
                  </span>
                ))
            ) : (
              <span className="text-white/50 text-sm">
                {showSwahili ? 'Kamilisha changamoto kupata beji!' : 'Complete challenges to earn badges!'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Challenges by Category */}
      {Object.entries(categories).map(([catId, category]) => (
        category.challenges.length > 0 && (
          <div key={catId} className="space-y-3">
            <h3 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wide">
              {category.label}
            </h3>
            {category.challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isCompleted={completedChallenges.includes(challenge.id)}
                onToggle={() => toggleChallenge(challenge.id)}
                showSwahili={showSwahili}
              />
            ))}
          </div>
        )
      ))}

      {/* Info Note */}
      <div className="card bg-light-lilac/30 text-center">
        <p className="text-sm text-charcoal/70">
          💡 {showSwahili 
            ? 'Hii ni kipengele cha maonyesho. Katika toleo kamili, changamoto zitafuatiliwa kiotomatiki.'
            : 'This is a demo feature. In the full version, challenges would be tracked automatically.'}
        </p>
      </div>
    </div>
  )
}

/**
 * Individual Challenge Card
 */
function ChallengeCard({ challenge, isCompleted, onToggle, showSwahili }) {
  return (
    <div 
      className={`card flex items-center gap-4 cursor-pointer transition-all
        ${isCompleted ? 'bg-green-50 border-2 border-green-300' : 'hover:shadow-medium'}`}
      onClick={onToggle}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
        ${isCompleted ? 'bg-green-100' : 'bg-light-lilac'}`}>
        {challenge.icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className={`font-semibold ${isCompleted ? 'text-green-700' : 'text-charcoal'}`}>
            {showSwahili ? challenge.titleSw : challenge.title}
          </h4>
          {isCompleted && <span className="text-green-500">✓</span>}
        </div>
        <p className="text-sm text-charcoal/60">
          {showSwahili ? challenge.descriptionSw : challenge.description}
        </p>
      </div>

      {/* Points/Badge */}
      <div className="text-right">
        <span className="text-2xl">{challenge.badge}</span>
        <p className={`text-sm font-bold ${isCompleted ? 'text-green-600' : 'text-sunrise-orange'}`}>
          +{challenge.points} pts
        </p>
      </div>
    </div>
  )
}

export default GamifiedChallenges
