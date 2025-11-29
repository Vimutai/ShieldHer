/**
 * Complete Digital Literacy Component
 * Everything included - no additional imports needed
 */
import { useState, useEffect } from 'react'

function DigitalLiteracyHub() {
  const [activeSection, setActiveSection] = useState('resources')
  const [showSwahili, setShowSwahili] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [completedItems, setCompletedItems] = useState({})
  const [expandedCategory, setExpandedCategory] = useState(0)
  const [activeTutorial, setActiveTutorial] = useState(null)
  const [activeGuide, setActiveGuide] = useState(null)
  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    answers: {},
    showResult: false,
    quizComplete: false
  })

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('dfs_literacy_progress', JSON.stringify(completedItems))
  }, [completedItems])

  // Emergency contacts
  const KENYA_EMERGENCY = {
    title: '🇰🇪 Kenya Emergency Contacts',
    contacts: [
      { name: 'Police Emergency', number: '999 / 112', description: 'National emergency line' },
      { name: 'Gender Violence Hotline', number: '1195', description: 'Free 24/7 GBV support' },
      { name: 'Childline Kenya', number: '116', description: 'Child protection services' },
      { name: 'DCI Cybercrime Unit', number: '+254 800 723 253', description: 'Report cybercrimes' },
    ],
  }

  // Quick safety tips
  const QUICK_TIPS = [
    {
      title: 'Screenshot Everything',
      titleSw: 'Piga Picha ya Skrini',
      icon: '📸',
      content: 'Always screenshot harassment before blocking. Include timestamps, usernames, and the full context. This is evidence for police reports.',
      contentSw: 'Piga picha za skrini za unyanyasaji kabla ya kuzuia. Hii ni ushahidi.',
    },
    {
      title: 'Report to DCI',
      titleSw: 'Ripoti kwa DCI',
      icon: '🚔',
      content: 'Cybercrime is illegal in Kenya. The DCI Cybercrime Unit can investigate. Call 0800 723 253 (toll-free).',
      contentSw: 'Uhalifu wa mtandao ni kinyume cha sheria Kenya. Piga simu 0800 723 253.',
    },
    {
      title: "Don't Engage",
      titleSw: 'Usijibu',
      icon: '🚫',
      content: 'Responding often escalates harassment. Use our Response Assistant to craft professional replies if needed.',
      contentSw: 'Kujibu kunaweza kuongeza unyanyasaji. Tumia Response Assistant yetu.',
    },
    {
      title: 'Secure Your Accounts',
      titleSw: 'Linda Akaunti Zako',
      icon: '🔒',
      content: 'Enable 2FA, use unique passwords, and review login activity. Safaricom M-Pesa can also be secured with a PIN.',
      contentSw: 'Weka 2FA, tumia nywila tofauti, kagua shughuli za kuingia.',
    },
    {
      title: 'Tell Someone',
      titleSw: 'Mwambie Mtu',
      icon: '💜',
      content: "Share what's happening with a trusted friend, family member, or counselor. Call 1195 for free support.",
      contentSw: 'Shiriki na rafiki, familia, au piga simu 1195 kwa msaada bure.',
    },
    {
      title: 'Know Your Rights',
      titleSw: 'Jua Haki Zako',
      icon: '⚖️',
      content: "Kenya's Computer Misuse Act protects you. Cyberbullying, threats, and sharing intimate images without consent are crimes.",
      contentSw: 'Sheria ya Kenya inakuhudia. Unyanyasaji wa mtandao ni uhalifu.',
    },
  ]

  // Resource categories
  const RESOURCES = [
    {
      category: 'Kenyan Support Organizations',
      icon: '🇰🇪',
      priority: true,
      items: [
        {
          title: 'FIDA Kenya',
          description: 'Free legal aid for women - Nairobi, Mombasa, Kisumu offices',
          phone: '+254 20 271 5808',
          url: 'https://fidakenya.org',
          swahili: 'Msaada wa kisheria bure kwa wanawake',
        },
        {
          title: 'Gender Violence Recovery Centre (GVRC)',
          description: 'Medical care, counseling, and legal support at Kenyatta National Hospital',
          phone: '+254 20 272 6300',
          url: 'https://gfrn.co.ke',
          swahili: 'Huduma za afya na ushauri',
        },
      ],
    },
    {
      category: 'Kenyan Legal Resources',
      icon: '⚖️',
      items: [
        {
          title: 'Computer Misuse and Cybercrimes Act 2018',
          description: 'Know your rights - cyberbullying, harassment, and intimate image abuse are criminal offenses',
          url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/ComputerMisuseandCybercrimesActNo5of2018.pdf',
          swahili: 'Sheria ya makosa ya mtandao',
        },
        {
          title: 'How to Report Cybercrime to DCI',
          description: 'Step-by-step guide to filing a report with the Directorate of Criminal Investigations',
          url: 'https://www.dci.go.ke/report-crime',
        },
      ],
    },
  ]

  // Tutorials data
  const THREAT_TUTORIALS = [
    {
      id: 'phishing',
      title: 'Phishing Identification',
      titleSw: 'Kutambua Udanganyifu wa Phishing',
      icon: '🎣',
      duration: '5 min',
      difficulty: 'Beginner',
      content: {
        intro: "Phishing is when scammers pretend to be trusted organizations to steal your information. In Kenya, this often happens via SMS (smishing) and email.",
        introSw: "Phishing ni wakati wadanganyifu wanajifanya kuwa mashirika ya kuaminika ili kuiba taarifa zako. Kenya, hii mara nyingi hutokea kupitia SMS na barua pepe.",
        sections: [
          {
            title: 'Common Kenya SMS Scams',
            titleSw: 'Udanganyifu wa SMS wa Kawaida Kenya',
            points: [
              { text: '"Congratulations! You won KES 500,000 in Safaricom promotion. Send 1000 to claim."', isFake: true, explanation: 'Safaricom never asks you to pay to receive winnings.' },
              { text: '"Your M-Pesa account will be suspended. Click link to verify."', isFake: true, explanation: 'M-Pesa never sends links. They use *334# menus.' },
            ]
          },
        ],
        quiz: [
          { question: 'You receive: "MPESA: Your account locked. Click bit.ly/mpesa-unlock to restore." What do you do?', options: ['Click immediately', 'Call Safaricom 100 to verify', 'Send to a friend'], correct: 1 },
        ]
      }
    },
    {
      id: 'catfishing',
      title: 'Catfishing Red Flags',
      titleSw: 'Ishara za Hatari za Catfishing',
      icon: '🐱',
      duration: '4 min',
      difficulty: 'Beginner',
      content: {
        intro: "Catfishing is when someone creates a fake online identity to deceive you, often for romance scams or fraud.",
        introSw: "Catfishing ni wakati mtu anaunda utambulisho bandia wa mtandaoni kukudanganya, mara nyingi kwa udanganyifu wa mapenzi au ulaghai.",
        sections: [
          {
            title: 'Warning Signs',
            titleSw: 'Ishara za Onyo',
            points: [
              { text: 'Profile photos look too perfect or like a model', tip: 'Do a reverse image search on Google' },
              { text: 'They refuse video calls but are always texting', tip: 'Real people will video chat eventually' },
            ]
          },
        ],
        quiz: [
          { question: 'Someone you\'ve chatted with for 2 months asks for money for a flight to visit you. What should you do?', options: ['Send it', 'Ask for a video call first', 'Send half now'], correct: 1 },
        ]
      }
    },
  ]

  // Safeguarding guides
  const SAFEGUARDING_GUIDES = [
    {
      id: 'passwords',
      title: 'Strong Password Creation',
      titleSw: 'Kuunda Nywila Imara',
      icon: '🔑',
      platform: 'All',
      steps: [
        { text: 'Use at least 12 characters', example: 'Longer is stronger!' },
        { text: 'Mix uppercase, lowercase, numbers, symbols', example: 'NairobiSunrise@2024!' },
        { text: 'Avoid personal info (birthday, name, phone)', example: 'Don\'t use: Kenya1990 or your M-Pesa PIN' },
      ],
      localTip: 'Never use your M-Pesa PIN, national ID number, or phone number as passwords!',
      localTipSw: 'Usitumie PIN yako ya M-Pesa, nambari ya kitambulisho, au nambari ya simu kama nywila!',
    },
    {
      id: 'facebook-privacy',
      title: 'Facebook Privacy Settings',
      titleSw: 'Mipangilio ya Faragha ya Facebook',
      icon: '📘',
      platform: 'Facebook',
      steps: [
        { text: 'Open Facebook > Menu (☰) > Settings & Privacy > Settings', example: '' },
        { text: 'Go to "Privacy" section', example: '' },
        { text: 'Set "Who can see your future posts?" to Friends', example: 'Never leave it on Public' },
      ],
      localTip: 'In Kenya, scammers often find targets through public Facebook profiles. Lock yours down!',
      localTipSw: 'Kenya, wadanganyifu mara nyingi hupata waathirika kupitia wasifu wa umma wa Facebook.',
    },
  ]

  // Quiz data
  const SCAM_QUIZ = [
    {
      id: 1,
      scenario: 'You receive an SMS: "SAFARICOM: Your M-Pesa acc will be blocked in 24hrs. Click www.safaricom-verify.co.ke to verify."',
      scenarioSw: 'Unapokea SMS: "SAFARICOM: Akaunti yako ya M-Pesa itafungwa masaa 24. Bonyeza www.safaricom-verify.co.ke kuthibitisha."',
      options: [
        { text: 'Click the link immediately', correct: false },
        { text: 'Ignore it - Safaricom uses *334#, not links', correct: true },
        { text: 'Forward to friends to warn them', correct: false },
      ],
      explanation: 'Safaricom never sends links via SMS. They use USSD codes (*334#) for all M-Pesa operations.',
      explanationSw: 'Safaricom haitumi viungo kupitia SMS. Wanatumia USSD (*334#) kwa shughuli zote za M-Pesa.',
    },
    {
      id: 2,
      scenario: 'A Facebook friend you\'ve never met says: "I\'m stuck in Mombasa, send me KES 5,000 via M-Pesa and I\'ll pay you back Monday."',
      scenarioSw: 'Rafiki wa Facebook ambaye hujawahi kukutana naye anasema: "Nimekwama Mombasa, nitumie KES 5,000 kwa M-Pesa na nitakulipa Jumatatu."',
      options: [
        { text: 'Send the money - they\'re a friend', correct: false },
        { text: 'Ask them to video call to verify identity', correct: true },
        { text: 'Send half now, half later', correct: false },
      ],
      explanation: 'Their account may be hacked, or it\'s a scammer. Always verify through video call.',
      explanationSw: 'Akaunti yao inaweza kuwa imehakiwa, au ni mdanganyifu. Thibitisha kupitia simu ya video.',
    },
  ]

  // Security checklist
  const SECURITY_CHECKLIST = [
    { id: 'password-unique', text: 'Use unique passwords for each account', textSw: 'Tumia nywila tofauti kwa kila akaunti', category: 'passwords' },
    { id: 'password-strong', text: 'All passwords are 12+ characters', textSw: 'Nywila zote zina herufi 12+', category: 'passwords' },
    { id: '2fa-email', text: 'Enabled 2FA on email accounts', textSw: 'Umewasha 2FA kwenye akaunti za barua pepe', category: '2fa' },
    { id: 'fb-private', text: 'Facebook profile set to Friends only', textSw: 'Wasifu wa Facebook umewekwa Marafiki pekee', category: 'facebook' },
  ]

  // Challenges data
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
  ]

  // Navigation sections
  const sections = [
    { id: 'resources', label: showSwahili ? '🆘 Rasilimali' : '🆘 Resources', icon: '🆘' },
    { id: 'tutorials', label: showSwahili ? '🎓 Mafunzo' : '🎓 Tutorials', icon: '🎓' },
    { id: 'guides', label: showSwahili ? '📖 Miongozo' : '📖 Guides', icon: '📖' },
    { id: 'checklist', label: showSwahili ? '✅ Orodha' : '✅ Checklist', icon: '✅' },
    { id: 'challenges', label: showSwahili ? '🏆 Changamoto' : '🏆 Challenges', icon: '🏆' },
  ]

  // Progress calculation
  const totalItems = SECURITY_CHECKLIST.length + THREAT_TUTORIALS.length + SAFEGUARDING_GUIDES.length
  const completedCount = Object.values(completedItems).filter(Boolean).length
  const progressPercent = Math.round((completedCount / totalItems) * 100)

  // Filter resources based on search
  const filteredResources = RESOURCES.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.swahili && item.swahili.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter(category => category.items.length > 0)

  // Quiz handlers
  const handleQuizAnswer = (optionIndex) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [prev.currentQuestion]: optionIndex },
      showResult: true
    }))
  }

  const nextQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      showResult: false,
      currentQuestion: prev.currentQuestion + 1,
      quizComplete: prev.currentQuestion >= SCAM_QUIZ.length - 1
    }))
  }

  const resetQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      answers: {},
      showResult: false,
      quizComplete: false
    })
  }

  // Mark items complete
  const markComplete = (type, id) => {
    setCompletedItems(prev => ({
      ...prev,
      [`${type}_${id}`]: true
    }))
  }

  // Current quiz question
  const currentQuiz = SCAM_QUIZ[quizState.currentQuestion]
  const correctCount = Object.entries(quizState.answers).filter(([qIdx, aIdx]) => 
    SCAM_QUIZ[parseInt(qIdx)].options[aIdx].correct
  ).length

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up p-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-deep-purple mb-2">
          {showSwahili ? '🎓 Kituo cha Elimu ya Usalama' : '🎓 Digital Safety Hub'}
        </h2>
        <p className="text-charcoal/70">
          {showSwahili 
            ? 'Rasilimali za dharura, mafunzo, na zana za kulinda usalama wako wa mtandaoni'
            : 'Emergency resources, tutorials, and tools to protect your online safety'}
        </p>
        
        {/* Language toggle */}
        <button
          onClick={() => setShowSwahili(!showSwahili)}
          className="mt-3 px-4 py-1.5 rounded-full text-sm font-medium
                     bg-light-lilac text-deep-purple hover:bg-deep-purple hover:text-white
                     transition-all"
        >
          {showSwahili ? '🇬🇧 English' : '🇰🇪 Kiswahili'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="card bg-gradient-to-r from-deep-purple/5 to-sunrise-orange/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-charcoal">
            {showSwahili ? 'Maendeleo Yako' : 'Your Progress'}
          </span>
          <span className="text-sm font-bold text-deep-purple">{progressPercent}%</span>
        </div>
        <div className="h-3 bg-light-lilac rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-deep-purple to-sunrise-orange transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-charcoal/60 mt-2">
          {completedCount} / {totalItems} {showSwahili ? 'vipengele vimekamilika' : 'items completed'}
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
        <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
          <span>🆘</span> 
          {showSwahili ? 'Nambari za Dharura Kenya' : 'Kenya Emergency Numbers'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {KENYA_EMERGENCY.contacts.map((contact, index) => (
            <a
              key={index}
              href={`tel:${contact.number.replace(/\s/g, '')}`}
              className="flex flex-col p-3 bg-white rounded-xl hover:shadow-md 
                         transition-all border border-red-100"
            >
              <span className="text-lg font-bold text-deep-purple">
                {contact.number}
              </span>
              <span className="text-sm font-medium text-charcoal">
                {contact.name}
              </span>
              <span className="text-xs text-charcoal/60">
                {contact.description}
              </span>
            </a>
          ))}
        </div>
        <p className="text-xs text-red-600 mt-3 text-center">
          {showSwahili 
            ? '⚠️ Hatari ya haraka? Piga simu 999 au 112 mara moja.'
            : '⚠️ In immediate danger? Call 999 or 112 now.'}
        </p>
      </div>

      {/* Quick Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold text-deep-purple mb-4 flex items-center gap-2">
          <span>💡</span> 
          {showSwahili ? 'Vidokezo vya Haraka' : 'Quick Safety Tips'}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_TIPS.map((tip, index) => (
            <div 
              key={index}
              className="p-3 bg-light-lilac/30 rounded-xl hover:bg-light-lilac/50 transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="text-xl">{tip.icon}</span>
                <div>
                  <h4 className="font-semibold text-charcoal text-sm">
                    {showSwahili ? tip.titleSw : tip.title}
                  </h4>
                  <p className="text-xs text-charcoal/70 mt-1">
                    {showSwahili ? tip.contentSw : tip.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSection(section.id)
              setActiveTutorial(null)
              setActiveGuide(null)
              if (section.id !== 'quiz') resetQuiz()
            }}
            className={`px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2
              ${activeSection === section.id 
                ? 'bg-deep-purple text-white shadow-md' 
                : 'bg-light-lilac text-deep-purple hover:bg-deep-purple/10'}`}
          >
            <span className="text-base">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      {(activeSection === 'resources' || activeSection === 'tutorials' || activeSection === 'guides') && (
        <div className="relative">
          <input
            type="text"
            placeholder={showSwahili ? "Tafuta..." : "Search..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded-xl border border-light-lilac focus:border-deep-purple focus:ring-2 focus:ring-deep-purple/20 transition-all"
          />
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Section Content */}
      <div className="min-h-[500px]">
        {/* Resources Section */}
        {activeSection === 'resources' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-deep-purple">
              {showSwahili ? '📚 Rasilimali za Usalama' : '📚 Safety Resources'}
            </h3>
            
            <div className="space-y-4">
              {filteredResources.map((category, index) => (
                <div key={index} className={`card overflow-hidden ${category.priority ? 'border-2 border-sunrise-orange/50' : ''}`}>
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold text-deep-purple">{category.category}</h3>
                        <p className="text-xs text-charcoal/50">
                          {category.items.length} {showSwahili ? 'rasilimali' : 'resources'}
                        </p>
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-charcoal/50 transition-transform ${expandedCategory === index ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedCategory === index && (
                    <div className="mt-4 pt-4 border-t border-light-lilac space-y-3 animate-fade-in">
                      {category.items.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 bg-light-lilac/30 rounded-xl hover:bg-light-lilac/50 transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold text-charcoal group-hover:text-deep-purple">
                                {item.title}
                              </h4>
                              <p className="text-sm text-charcoal/70 mt-1">
                                {showSwahili && item.swahili ? item.swahili : item.description}
                              </p>
                              {item.phone && (
                                <a 
                                  href={`tel:${item.phone.replace(/\s/g, '')}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-sm text-sunrise-orange font-semibold mt-1 hover:underline"
                                >
                                  📞 {item.phone}
                                </a>
                              )}
                            </div>
                            <svg 
                              className="w-4 h-4 text-charcoal/30 group-hover:text-deep-purple flex-shrink-0 mt-1"
                              fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredResources.length === 0 && searchQuery && (
              <div className="text-center py-8 text-charcoal/50">
                <p>
                  {showSwahili 
                    ? `Hakuna rasilimali zilizopatikana kwa "${searchQuery}"`
                    : `No resources found for "${searchQuery}"`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tutorials Section */}
        {activeSection === 'tutorials' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-deep-purple">
              {showSwahili ? '🎣 Mafunzo ya Kutambua Vitisho' : '🎣 Threat Detection Tutorials'}
            </h3>
            
            {activeTutorial ? (
              <TutorialDetail 
                tutorial={THREAT_TUTORIALS.find(t => t.id === activeTutorial)}
                showSwahili={showSwahili}
                onBack={() => setActiveTutorial(null)}
                onComplete={() => markComplete('tutorial', activeTutorial)}
                isCompleted={completedItems[`tutorial_${activeTutorial}`]}
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {THREAT_TUTORIALS.map(tutorial => (
                  <button
                    key={tutorial.id}
                    onClick={() => setActiveTutorial(tutorial.id)}
                    className={`card text-left hover:shadow-medium transition-all group p-4
                      ${completedItems[`tutorial_${tutorial.id}`] ? 'border-2 border-green-300 bg-green-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{tutorial.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-charcoal group-hover:text-deep-purple">
                            {showSwahili ? tutorial.titleSw : tutorial.title}
                          </h4>
                          {completedItems[`tutorial_${tutorial.id}`] && (
                            <span className="text-green-500">✓</span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-light-lilac rounded-full">
                            {tutorial.duration}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-light-lilac rounded-full">
                            {tutorial.difficulty}
                          </span>
                        </div>
                      </div>
                      <span className="text-charcoal/30 group-hover:text-deep-purple">→</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quiz Section */}
        {activeSection === 'quiz' && (
          <QuizSection 
            showSwahili={showSwahili}
            quizState={quizState}
            currentQuiz={currentQuiz}
            correctCount={correctCount}
            handleQuizAnswer={handleQuizAnswer}
            nextQuestion={nextQuestion}
            resetQuiz={resetQuiz}
          />
        )}

        {/* Challenges Section */}
        {activeSection === 'challenges' && (
          <ChallengesSection 
            showSwahili={showSwahili}
            completedItems={completedItems}
            challenges={CHALLENGES}
          />
        )}
      </div>
    </div>
  )
}

// Sub-components
function TutorialDetail({ tutorial, showSwahili, onBack, onComplete, isCompleted }) {
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const handleQuizAnswer = (questionIndex, optionIndex) => {
    setQuizAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }))
  }

  const checkQuiz = () => {
    setShowResults(true)
    const allCorrect = tutorial.content.quiz?.every((q, i) => quizAnswers[i] === q.correct)
    if (allCorrect) onComplete()
  }

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-deep-purple hover:underline flex items-center gap-1">
          ← {showSwahili ? 'Rudi' : 'Back'}
        </button>
        {isCompleted && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            ✓ {showSwahili ? 'Imekamilika' : 'Completed'}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-deep-purple flex items-center gap-2">
          <span>{tutorial.icon}</span>
          {showSwahili ? tutorial.titleSw : tutorial.title}
        </h3>
        <p className="text-charcoal/70 mt-2">
          {showSwahili ? tutorial.content.introSw : tutorial.content.intro}
        </p>
      </div>

      {tutorial.content.quiz && (
        <div className="border-t border-light-lilac pt-6">
          <h4 className="font-semibold text-deep-purple mb-4">
            🧪 {showSwahili ? 'Jaribio la Haraka' : 'Quick Quiz'}
          </h4>
          {tutorial.content.quiz.map((q, qidx) => (
            <div key={qidx} className="mb-4 p-4 bg-light-lilac/20 rounded-xl">
              <p className="font-medium text-charcoal mb-3">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oidx) => (
                  <button
                    key={oidx}
                    onClick={() => handleQuizAnswer(qidx, oidx)}
                    disabled={showResults}
                    className={`w-full text-left p-3 rounded-lg transition-all text-sm
                      ${quizAnswers[qidx] === oidx 
                        ? showResults 
                          ? oidx === q.correct ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                          : 'bg-deep-purple text-white'
                        : 'bg-white border border-light-lilac hover:border-deep-purple'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          {!showResults ? (
            <button
              onClick={checkQuiz}
              disabled={Object.keys(quizAnswers).length < tutorial.content.quiz.length}
              className="w-full p-3 bg-deep-purple text-white rounded-xl hover:bg-deep-purple/90 disabled:opacity-50"
            >
              {showSwahili ? 'Angalia Majibu' : 'Check Answers'}
            </button>
          ) : (
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-green-700 font-medium">
                {isCompleted 
                  ? (showSwahili ? '🎉 Umefaulu! Tutorial imekamilika.' : '🎉 Great job! Tutorial completed.')
                  : (showSwahili ? 'Jaribu tena kupata majibu yote sahihi.' : 'Try again to get all answers correct.')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function QuizSection({ showSwahili, quizState, currentQuiz, correctCount, handleQuizAnswer, nextQuestion, resetQuiz }) {
  if (quizState.quizComplete) {
    const percentage = Math.round((correctCount / SCAM_QUIZ.length) * 100)
    return (
      <div className="card text-center space-y-6">
        <div className="text-6xl">
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '📚'}
        </div>
        <h3 className="text-xl font-bold text-deep-purple">
          {showSwahili ? 'Matokeo ya Jaribio' : 'Quiz Results'}
        </h3>
        <div className="text-4xl font-bold text-sunrise-orange">
          {correctCount} / {SCAM_QUIZ.length}
        </div>
        <p className="text-charcoal/70">
          {percentage >= 80 
            ? (showSwahili ? 'Bora sana! Unajua kutambua udanganyifu.' : 'Excellent! You know how to spot scams.')
            : percentage >= 60
            ? (showSwahili ? 'Vizuri! Endelea kujifunza.' : 'Good job! Keep learning.')
            : (showSwahili ? 'Soma tena mafunzo na ujaribu tena.' : 'Review the tutorials and try again.')}
        </p>
        <button onClick={resetQuiz} className="w-full p-3 bg-deep-purple text-white rounded-xl hover:bg-deep-purple/90">
          {showSwahili ? 'Jaribu Tena' : 'Try Again'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-deep-purple">
          ❓ {showSwahili ? 'Unaweza Kutambua Udanganyifu?' : 'Can You Spot the Scam?'}
        </h3>
        <span className="text-sm text-charcoal/60">
          {quizState.currentQuestion + 1} / {SCAM_QUIZ.length}
        </span>
      </div>

      <div className="h-2 bg-light-lilac rounded-full overflow-hidden">
        <div 
          className="h-full bg-deep-purple transition-all duration-300"
          style={{ width: `${((quizState.currentQuestion + 1) / SCAM_QUIZ.length) * 100}%` }}
        />
      </div>

      <div className="card">
        <div className="p-4 bg-charcoal/5 rounded-xl mb-4">
          <p className="text-sm text-charcoal font-medium">
            📱 {showSwahili ? 'Hali:' : 'Scenario:'}
          </p>
          <p className="text-charcoal mt-2 italic">
            "{showSwahili ? currentQuiz.scenarioSw : currentQuiz.scenario}"
          </p>
        </div>

        <p className="font-medium text-charcoal mb-4">
          {showSwahili ? 'Unafanya nini?' : 'What do you do?'}
        </p>

        <div className="space-y-2">
          {currentQuiz.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleQuizAnswer(idx)}
              disabled={quizState.showResult}
              className={`w-full text-left p-4 rounded-xl transition-all border-2
                ${quizState.showResult 
                  ? option.correct 
                    ? 'bg-green-100 border-green-500'
                    : quizState.answers[quizState.currentQuestion] === idx
                    ? 'bg-red-100 border-red-500'
                    : 'border-light-lilac'
                  : 'border-light-lilac hover:border-deep-purple hover:bg-light-lilac/30'}`}
            >
              <span className="flex items-center gap-2">
                {quizState.showResult && option.correct && <span className="text-green-500">✓</span>}
                {quizState.showResult && quizState.answers[quizState.currentQuestion] === idx && !option.correct && <span className="text-red-500">✗</span>}
                {option.text}
              </span>
            </button>
          ))}
        </div>

        {quizState.showResult && (
          <>
            <div className="mt-4 p-4 bg-sunrise-orange/10 rounded-xl animate-fade-in">
              <p className="text-sm text-charcoal">
                <span className="font-bold">💡 {showSwahili ? 'Maelezo' : 'Explanation'}: </span>
                {showSwahili ? currentQuiz.explanationSw : currentQuiz.explanation}
              </p>
            </div>
            <button onClick={nextQuestion} className="w-full p-3 bg-deep-purple text-white rounded-xl hover:bg-deep-purple/90 mt-4">
              {quizState.currentQuestion < SCAM_QUIZ.length - 1 
                ? (showSwahili ? 'Swali Lifuatalo →' : 'Next Question →')
                : (showSwahili ? 'Angalia Matokeo' : 'See Results')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function ChallengesSection({ showSwahili, completedItems, challenges }) {
  const completedChallenges = challenges.filter(c => completedItems[`challenge_${c.id}`])
  const totalPoints = completedChallenges.reduce((sum, c) => sum + c.points, 0)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-deep-purple">
        🏆 {showSwahili ? 'Changamoto za Usalama' : 'Safety Challenges'}
      </h3>

      <div className="card bg-gradient-to-r from-deep-purple to-deep-purple/80 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm">{showSwahili ? 'Pointi Zako' : 'Your Points'}</p>
            <h3 className="text-3xl font-bold">{totalPoints}</h3>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-sm">{showSwahili ? 'Beji Zilizopatikana' : 'Badges Earned'}</p>
            <div className="flex gap-1">
              {completedChallenges.map(c => (
                <span key={c.id} className="text-2xl" title={showSwahili ? c.titleSw : c.title}>
                  {c.badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {challenges.map(challenge => (
          <div 
            key={challenge.id}
            className={`card flex items-center gap-4 transition-all
              ${completedItems[`challenge_${challenge.id}`] ? 'border-2 border-green-300 bg-green-50' : ''}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
              ${completedItems[`challenge_${challenge.id}`] ? 'bg-green-100' : 'bg-light-lilac'}`}>
              {challenge.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className={`font-semibold ${completedItems[`challenge_${challenge.id}`] ? 'text-green-700' : 'text-charcoal'}`}>
                  {showSwahili ? challenge.titleSw : challenge.title}
                </h4>
                {completedItems[`challenge_${challenge.id}`] && <span className="text-green-500">✓</span>}
              </div>
              <p className="text-sm text-charcoal/60">
                {showSwahili ? challenge.descriptionSw : challenge.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl">{challenge.badge}</span>
              <p className={`text-sm font-bold ${completedItems[`challenge_${challenge.id}`] ? 'text-green-600' : 'text-sunrise-orange'}`}>
                +{challenge.points} pts
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DigitalLiteracyHub