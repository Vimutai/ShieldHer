/**
 * ActionPlan Component
 * Generates personalized action items based on assessment results
 * Includes placeholder screenshots and checklist functionality
 */
import { useState } from 'react'
import { QUESTIONS } from './AssessmentForm'

// Action items mapped to question IDs
// Each action includes steps and placeholder screenshot reference
const ACTION_ITEMS = {
  social_public: {
    title: 'Make Social Media Profiles Private',
    priority: 'high',
    steps: [
      'Go to Settings > Privacy on each platform',
      'Set profile visibility to "Friends Only" or "Private"',
      'Review who can see your posts and stories',
    ],
    screenshot: 'privacy-settings.png',
    platforms: ['Facebook', 'Instagram', 'Twitter/X', 'TikTok'],
  },
  location_sharing: {
    title: 'Disable Location Sharing',
    priority: 'high',
    steps: [
      'Turn off geotagging in your camera app',
      'Disable location for social media apps',
      'Remove location from existing posts if possible',
    ],
    screenshot: 'location-settings.png',
    tip: 'Post vacation photos AFTER you return home',
  },
  real_name: {
    title: 'Consider Using a Pseudonym',
    priority: 'medium',
    steps: [
      'Use a nickname or variation of your name',
      'Keep your legal name only on essential accounts',
      'Use different usernames across platforms',
    ],
    screenshot: 'username-example.png',
  },
  password_reuse: {
    title: 'Use Unique Passwords',
    priority: 'high',
    steps: [
      'Install a password manager (Bitwarden, 1Password)',
      'Generate unique passwords for each account',
      'Start with your most important accounts first',
    ],
    screenshot: 'password-manager.png',
    tools: ['Bitwarden (free)', '1Password', 'LastPass'],
  },
  two_factor: {
    title: 'Enable Two-Factor Authentication',
    priority: 'high',
    steps: [
      'Enable 2FA on email accounts first',
      'Use an authenticator app (not SMS if possible)',
      'Save backup codes in a safe place',
    ],
    screenshot: '2fa-setup.png',
    tools: ['Google Authenticator', 'Authy', 'Microsoft Authenticator'],
  },
  personal_info: {
    title: 'Remove Personal Contact Info',
    priority: 'critical',
    steps: [
      'Remove phone number from social media bios',
      'Use a P.O. Box instead of home address when possible',
      'Check data broker sites and request removal',
    ],
    screenshot: 'remove-info.png',
    dataBrokers: ['Spokeo', 'WhitePages', 'BeenVerified', 'Intelius'],
  },
  photo_sharing: {
    title: 'Be Mindful of Photo Contents',
    priority: 'medium',
    steps: [
      'Check backgrounds for identifying info',
      'Avoid patterns that reveal your routine',
      'Blur or crop sensitive details',
    ],
    screenshot: 'photo-review.png',
  },
  friend_lists: {
    title: 'Hide Friend/Follower Lists',
    priority: 'medium',
    steps: [
      'Set friend list visibility to "Only Me"',
      'Review follower settings on each platform',
    ],
    screenshot: 'friend-list-privacy.png',
  },
  google_yourself: {
    title: 'Regular Self-Search Audit',
    priority: 'low',
    steps: [
      'Google your full name in quotes',
      'Search your email and phone number',
      'Set up Google Alerts for your name',
    ],
    screenshot: 'google-search.png',
    frequency: 'Monthly',
  },
  data_broker: {
    title: 'Opt Out of Data Brokers',
    priority: 'medium',
    steps: [
      'Visit each data broker site',
      'Search for your information',
      'Follow their opt-out process',
    ],
    screenshot: 'data-broker-optout.png',
    tools: ['DeleteMe (paid service)', 'Manual opt-out guides'],
  },
}

function ActionPlan({ answers, score }) {
  // Track completed items
  const [completedItems, setCompletedItems] = useState(() => {
    const saved = localStorage.getItem('dfs_completed_actions')
    return saved ? JSON.parse(saved) : []
  })

  // Generate action items based on "risky" answers
  const generateActions = () => {
    const actions = []
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = QUESTIONS.find(q => q.id === questionId)
      if (!question) return

      // Determine if this answer indicates a risk
      const isRisky = question.invertScore ? !answer : answer
      
      if (isRisky && ACTION_ITEMS[questionId]) {
        actions.push({
          ...ACTION_ITEMS[questionId],
          questionId,
          question: question.text,
        })
      }
    })

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  const actions = generateActions()

  // Toggle completion
  const toggleComplete = (questionId) => {
    setCompletedItems(prev => {
      const updated = prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
      localStorage.setItem('dfs_completed_actions', JSON.stringify(updated))
      return updated
    })
  }

  // Calculate progress
  const completedCount = actions.filter(a => completedItems.includes(a.questionId)).length
  const progress = actions.length > 0 ? (completedCount / actions.length) * 100 : 100

  if (actions.length === 0) {
    return (
      <div className="card text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-deep-purple mb-2">
          Excellent Work!
        </h3>
        <p className="text-charcoal/70">
          Based on your assessment, you're already following great security practices.
          Keep it up!
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-deep-purple">
            Your Action Plan
          </h3>
          <p className="text-sm text-charcoal/60">
            {actions.length} items to improve your safety
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-deep-purple">
            {completedCount}/{actions.length}
          </div>
          <div className="text-xs text-charcoal/60">completed</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-light-lilac rounded-full overflow-hidden mb-6">
        <div 
          className="h-full bg-gradient-to-r from-sunrise-orange to-green-500 
                     transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Action items */}
      <div className="space-y-4">
        {actions.map((action, index) => (
          <ActionItem
            key={action.questionId}
            action={action}
            index={index}
            isCompleted={completedItems.includes(action.questionId)}
            onToggle={() => toggleComplete(action.questionId)}
          />
        ))}
      </div>

      {/* Export button */}
      <div className="mt-6 pt-6 border-t border-light-lilac text-center">
        <button 
          onClick={() => alert('PDF export coming soon!')}
          className="btn-secondary"
        >
          📄 Export as PDF
        </button>
      </div>
    </div>
  )
}

/**
 * Individual Action Item Component
 */
function ActionItem({ action, index, isCompleted, onToggle }) {
  const [expanded, setExpanded] = useState(false)

  const priorityColors = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  }

  return (
    <div 
      className={`border rounded-xl overflow-hidden transition-all
        ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-light-lilac'}`}
    >
      {/* Header row */}
      <div 
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Checkbox */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                      transition-all flex-shrink-0
            ${isCompleted 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-charcoal/30 hover:border-deep-purple'}`}
        >
          {isCompleted && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[action.priority]}`}>
              {action.priority}
            </span>
            <h4 className={`font-semibold ${isCompleted ? 'line-through text-charcoal/50' : 'text-charcoal'}`}>
              {action.title}
            </h4>
          </div>
        </div>

        {/* Expand icon */}
        <svg 
          className={`w-5 h-5 text-charcoal/50 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-light-lilac/50 animate-fade-in">
          {/* Steps */}
          <div className="mt-4">
            <h5 className="text-sm font-semibold text-charcoal mb-2">Steps:</h5>
            <ol className="text-sm text-charcoal/70 space-y-1 list-decimal list-inside">
              {action.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Tip if available */}
          {action.tip && (
            <div className="mt-3 p-3 bg-sunrise-orange/10 rounded-lg">
              <p className="text-sm text-charcoal/80">
                💡 <strong>Tip:</strong> {action.tip}
              </p>
            </div>
          )}

          {/* Tools if available */}
          {action.tools && (
            <div className="mt-3">
              <h5 className="text-sm font-semibold text-charcoal mb-1">Recommended tools:</h5>
              <div className="flex flex-wrap gap-2">
                {action.tools.map((tool, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-light-lilac rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder screenshot area */}
          <div className="mt-4 p-4 bg-light-lilac/30 rounded-lg border-2 border-dashed border-light-lilac text-center">
            <div className="text-3xl mb-2">📸</div>
            <p className="text-sm text-charcoal/50">
              Screenshot guide: {action.screenshot}
            </p>
            <p className="text-xs text-charcoal/40 mt-1">
              (Add platform-specific screenshots here)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActionPlan
