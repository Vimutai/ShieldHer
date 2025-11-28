/**
 * Digital Literacy Hub Component
 * Comprehensive security education with Kenya-specific content
 * Features: Tutorials, Guides, Quizzes, Checklists, Platform Safety
 */
import { useState, useEffect } from 'react'

// ============================================
// CONTENT DATA - All locally stored
// ============================================

// Threat Detection Tutorials
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
            { text: '"KRA: Pay tax arrears of KES 50,000 immediately or face arrest."', isFake: true, explanation: 'KRA sends official letters, not threatening SMS.' },
            { text: '"Your parcel from China is held at customs. Pay KES 3,000 clearance."', isFake: true, explanation: 'Legitimate customs fees are paid at collection.' },
          ]
        },
        {
          title: 'How to Spot Phishing',
          titleSw: 'Jinsi ya Kutambua Phishing',
          points: [
            { text: 'Check the sender - official numbers vs random numbers', tip: 'Safaricom uses short codes like 456, not +254 7XX numbers' },
            { text: 'Look for urgency language - "Act NOW!", "Urgent!", "Last chance!"', tip: 'Scammers create panic so you don\'t think' },
            { text: 'Check for spelling errors and poor grammar', tip: 'Legitimate companies proofread their messages' },
            { text: 'Never click links in SMS - go directly to official app/website', tip: 'Type mpesa.co.ke yourself instead of clicking' },
          ]
        }
      ],
      quiz: [
        { question: 'You receive: "MPESA: Your account locked. Click bit.ly/mpesa-unlock to restore." What do you do?', options: ['Click immediately', 'Call Safaricom 100 to verify', 'Send to a friend'], correct: 1 },
        { question: 'A text says you won a car from a company you\'ve never heard of. This is likely:', options: ['Legitimate', 'A scam', 'Worth investigating'], correct: 1 },
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
            { text: 'Story inconsistencies - job, location, age don\'t match', tip: 'Write down what they tell you and compare' },
            { text: 'They "fall in love" very quickly', tip: 'Real relationships take time to develop' },
            { text: 'They always have excuses not to meet in person', tip: 'After months of chatting, this is a red flag' },
            { text: 'They ask for money - emergencies, tickets to visit you', tip: 'NEVER send money to someone you haven\'t met' },
          ]
        },
        {
          title: 'Kenya-Specific Patterns',
          titleSw: 'Mifumo Maalum ya Kenya',
          points: [
            { text: '"I\'m a UN/NGO worker in Kakuma/Dadaab refugee camp"', tip: 'Common story used to explain why they can\'t meet' },
            { text: '"I\'m a Kenyan diaspora in UK/US wanting to come home"', tip: 'They\'ll eventually ask for money' },
            { text: '"I\'m a rich businessman/woman looking for love"', tip: 'Too good to be true usually is' },
          ]
        }
      ],
      quiz: [
        { question: 'Someone you\'ve chatted with for 2 months asks you to send KES 50,000 for a flight to visit you. What should you do?', options: ['Send it - they\'ll pay you back', 'Ask for a video call first and verify their story', 'Send half now, half later'], correct: 1 },
      ]
    }
  },
  {
    id: 'fake-profiles',
    title: 'Fake Profile Spotting',
    titleSw: 'Kutambua Wasifu Bandia',
    icon: '👤',
    duration: '3 min',
    difficulty: 'Beginner',
    content: {
      intro: "Fake profiles are used for scams, harassment, and gathering personal information. Learning to spot them protects you.",
      introSw: "Wasifu bandia hutumika kwa udanganyifu, unyanyasaji, na kukusanya taarifa za kibinafsi.",
      sections: [
        {
          title: 'Signs of a Fake Profile',
          titleSw: 'Ishara za Wasifu Bandia',
          points: [
            { text: 'Very few posts or photos', tip: 'Real people post over time' },
            { text: 'No tagged photos from friends', tip: 'Real people appear in others\' photos' },
            { text: 'Friends list is all one gender or location', tip: 'Organic friends are diverse' },
            { text: 'Created recently but claims long history', tip: 'Check the "Joined" date' },
            { text: 'Generic or stock profile photo', tip: 'Search the image on Google Images' },
            { text: 'Inconsistent information (different ages, jobs)', tip: 'Check their About section carefully' },
          ]
        }
      ],
      quiz: [
        { question: 'A profile with 3 photos, 10 friends (all men), created last month, and a model-quality profile pic is likely:', options: ['Legitimate', 'Suspicious - investigate more', 'Definitely safe'], correct: 1 },
      ]
    }
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering Awareness',
    titleSw: 'Ufahamu wa Uhandisi wa Kijamii',
    icon: '🧠',
    duration: '6 min',
    difficulty: 'Intermediate',
    content: {
      intro: "Social engineering is psychological manipulation to trick you into giving up information or access. It's not about hacking computers - it's about hacking people.",
      introSw: "Uhandisi wa kijamii ni udanganyifu wa kisaikolojia kukufanya utoe taarifa au ufikiaji.",
      sections: [
        {
          title: 'Common Techniques',
          titleSw: 'Mbinu za Kawaida',
          points: [
            { text: 'Pretexting: Creating a fake scenario ("I\'m from Safaricom IT support")', tip: 'Verify by calling official numbers yourself' },
            { text: 'Baiting: Offering something tempting ("Free iPhone giveaway")', tip: 'If it\'s too good to be true, it is' },
            { text: 'Quid pro quo: "I\'ll help you if you give me your password"', tip: 'Never share passwords, even with "IT support"' },
            { text: 'Tailgating: Following you to restricted areas online/offline', tip: 'Don\'t share your login with anyone' },
          ]
        },
        {
          title: 'Kenya Examples',
          titleSw: 'Mifano ya Kenya',
          points: [
            { text: '"Your M-Pesa PIN has expired, tell me your current one to reset"', tip: 'Safaricom NEVER asks for your PIN' },
            { text: '"I\'m calling from your bank, verify your account number and PIN"', tip: 'Banks never ask for full card details by phone' },
            { text: '"I\'m from NTSA, pay this fine now via M-Pesa or lose your license"', tip: 'Verify fines on eCitizen, not via phone calls' },
          ]
        }
      ],
      quiz: [
        { question: 'Someone calls claiming to be from Safaricom and asks for your M-Pesa PIN to "upgrade your account." You should:', options: ['Give it - they\'re from Safaricom', 'Hang up and call Safaricom 100 directly', 'Ask them to prove they\'re from Safaricom'], correct: 1 },
      ]
    }
  },
]

// Account Safeguarding Guides
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
      { text: 'Use passphrases - memorable sentences', example: 'MtKenya!Is5199meters#Tall' },
      { text: 'Different password for each account', example: 'If one is hacked, others stay safe' },
      { text: 'Use a password manager', example: 'Bitwarden (free), 1Password, LastPass' },
    ],
    localTip: 'Never use your M-Pesa PIN, national ID number, or phone number as passwords!',
    localTipSw: 'Usitumie PIN yako ya M-Pesa, nambari ya kitambulisho, au nambari ya simu kama nywila!',
  },
  {
    id: '2fa',
    title: 'Two-Factor Authentication Setup',
    titleSw: 'Kuweka Uthibitishaji wa Hatua Mbili',
    icon: '🔐',
    platform: 'All',
    steps: [
      { text: 'Download an authenticator app', example: 'Google Authenticator, Microsoft Authenticator, or Authy' },
      { text: 'Go to account Security Settings', example: 'Usually under Settings > Security or Privacy' },
      { text: 'Find "Two-Factor Authentication" or "2FA"', example: 'May also be called "Login verification"' },
      { text: 'Choose "Authenticator App" (not SMS if possible)', example: 'SMS can be intercepted; apps are safer' },
      { text: 'Scan the QR code with your authenticator app', example: 'The app will show a 6-digit code' },
      { text: 'Enter the code to verify setup', example: 'Codes change every 30 seconds' },
      { text: 'SAVE your backup codes somewhere safe', example: 'Write them on paper, store in locked place' },
    ],
    localTip: 'If your phone is stolen, backup codes let you regain access. Keep them offline - not in your phone!',
    localTipSw: 'Kama simu yako ikiibwa, misimbo ya akiba itakusaidia kuingia tena. Iweke nje ya simu!',
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
      { text: 'Set "Who can send you friend requests?" to Friends of Friends', example: 'Reduces random requests' },
      { text: 'Review "Timeline and Tagging" settings', example: 'Enable review of tags before they appear' },
      { text: 'Check "How People Find You" - limit by phone/email', example: 'Prevent strangers finding you' },
      { text: 'Review "Apps and Websites" - remove old apps', example: 'Old apps may still have your data' },
    ],
    localTip: 'In Kenya, scammers often find targets through public Facebook profiles. Lock yours down!',
    localTipSw: 'Kenya, wadanganyifu mara nyingi hupata waathirika kupitia wasifu wa umma wa Facebook.',
  },
  {
    id: 'instagram-privacy',
    title: 'Instagram Privacy Settings',
    titleSw: 'Mipangilio ya Faragha ya Instagram',
    icon: '📸',
    platform: 'Instagram',
    steps: [
      { text: 'Go to Profile > Menu (☰) > Settings and privacy', example: '' },
      { text: 'Under "Who can see your content" set Account to Private', example: 'Only approved followers see posts' },
      { text: 'Turn off "Activity Status"', example: 'People won\'t see when you\'re online' },
      { text: 'Restrict "Message Requests" settings', example: 'Filter DMs from strangers' },
      { text: 'Enable "Hidden Words" to filter offensive DMs', example: 'Auto-hides messages with bad words' },
      { text: 'Check "Tags and Mentions" settings', example: 'Control who can tag you' },
      { text: 'Review "Story" settings - hide from specific people', example: 'Create a Close Friends list' },
    ],
    localTip: 'Instagram DMs are a common harassment method. Use Message Controls to filter unknown accounts.',
    localTipSw: 'DM za Instagram ni njia ya kawaida ya unyanyasaji. Tumia Vidhibiti vya Ujumbe.',
  },
  {
    id: 'whatsapp-privacy',
    title: 'WhatsApp Privacy Settings',
    titleSw: 'Mipangilio ya Faragha ya WhatsApp',
    icon: '💬',
    platform: 'WhatsApp',
    steps: [
      { text: 'Open WhatsApp > Settings (⚙️) > Privacy', example: '' },
      { text: 'Set "Last Seen" to "My Contacts" or "Nobody"', example: 'Strangers won\'t know when you\'re online' },
      { text: 'Set "Profile Photo" to "My Contacts"', example: 'Prevents strangers seeing your photo' },
      { text: 'Set "About" to "My Contacts"', example: '' },
      { text: 'Set "Status" to "My Contacts"', example: '' },
      { text: 'Enable "Groups" - "My Contacts" only', example: 'Prevents being added to random groups' },
      { text: 'Turn ON "Fingerprint Lock" (under Privacy)', example: 'Extra security if phone is borrowed' },
      { text: 'Enable "Two-Step Verification"', example: 'Settings > Account > Two-step verification' },
    ],
    localTip: 'WhatsApp groups are used to spread scams in Kenya. Only let contacts add you to groups!',
    localTipSw: 'Vikundi vya WhatsApp hutumika kusambaza udanganyifu Kenya. Waache tu wawasiliani wakuongeze!',
  },
  {
    id: 'twitter-safety',
    title: 'Twitter/X Safety Settings',
    titleSw: 'Mipangilio ya Usalama ya Twitter/X',
    icon: '🐦',
    platform: 'Twitter/X',
    steps: [
      { text: 'Go to Settings > Privacy and Safety', example: '' },
      { text: 'Enable "Protect your posts" for private account', example: 'Only followers see your tweets' },
      { text: 'Turn off "Discoverability" by email/phone', example: 'People can\'t find you by contact info' },
      { text: 'Enable "Filter" for notifications', example: 'Hides notifications from strangers' },
      { text: 'Set "Direct Messages" to followers only', example: 'Blocks DMs from randoms' },
      { text: 'Use "Mute" liberally for keywords/accounts', example: 'Mute triggering words and trolls' },
      { text: 'Review "Blocked accounts" regularly', example: 'Block harassers immediately' },
    ],
    localTip: 'Kenyan Twitter (KOT) can be harsh. Use mute words to filter out toxicity.',
    localTipSw: 'Twitter ya Kenya (KOT) inaweza kuwa kali. Tumia maneno ya kimya kuchuja sumu.',
  },
]

// Interactive Quiz Data
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
    explanation: 'Safaricom never sends links via SMS. They use USSD codes (*334#) for all M-Pesa operations. The fake domain "safaricom-verify.co.ke" is designed to steal your credentials.',
    explanationSw: 'Safaricom haitumi viungo kupitia SMS. Wanatumia USSD (*334#) kwa shughuli zote za M-Pesa.',
  },
  {
    id: 2,
    scenario: 'A Facebook friend you\'ve never met says: "I\'m stuck in Mombasa, my wallet was stolen. Send me KES 5,000 via M-Pesa and I\'ll pay you back Monday."',
    scenarioSw: 'Rafiki wa Facebook ambaye hujawahi kukutana naye anasema: "Nimekwama Mombasa, pochi yangu iliibwa. Nitumie KES 5,000 kwa M-Pesa na nitakulipa Jumatatu."',
    options: [
      { text: 'Send the money - they\'re a friend', correct: false },
      { text: 'Ask them to video call to verify identity', correct: true },
      { text: 'Send half now, half later', correct: false },
    ],
    explanation: 'Their account may be hacked, or it\'s a scammer. Always verify through video call or by asking a question only the real person would know.',
    explanationSw: 'Akaunti yao inaweza kuwa imehakiwa, au ni mdanganyifu. Thibitisha kupitia simu ya video.',
  },
  {
    id: 3,
    scenario: 'You receive a call: "This is Kenya Revenue Authority. You owe KES 150,000 in taxes. Pay now via M-Pesa to 0722-XXX-XXX or police will arrest you today."',
    scenarioSw: 'Unapokea simu: "Hii ni Kenya Revenue Authority. Unadaiwa KES 150,000 ya kodi. Lipa sasa kwa M-Pesa 0722-XXX-XXX au polisi watakukamata leo."',
    options: [
      { text: 'Pay immediately to avoid arrest', correct: false },
      { text: 'Hang up and check iTax/eCitizen for any real tax issues', correct: true },
      { text: 'Negotiate a lower amount', correct: false },
    ],
    explanation: 'KRA does not call demanding immediate payment to personal M-Pesa numbers. Check your iTax account directly or visit a KRA office.',
    explanationSw: 'KRA haipigi simu kudai malipo ya haraka kwa nambari za M-Pesa za kibinafsi. Angalia akaunti yako ya iTax moja kwa moja.',
  },
  {
    id: 4,
    scenario: 'Someone on a dating app says they\'re a UN doctor in Dadaab. After 2 weeks of chatting, they ask for KES 30,000 to fix their "broken laptop" so they can video call you.',
    scenarioSw: 'Mtu kwenye programu ya uchumba anasema ni daktari wa UN Dadaab. Baada ya wiki 2 za kuongea, anaomba KES 30,000 kurekebisha "laptop yake iliyovunjika" ili aweze kukupigia simu ya video.',
    options: [
      { text: 'Send the money - they seem genuine', correct: false },
      { text: 'Recognize this as a classic romance scam and block them', correct: true },
      { text: 'Ask for their UN employee ID first', correct: false },
    ],
    explanation: 'This is a classic romance scam pattern: exotic job, refugee camp location (hard to visit), then money requests. UN workers don\'t ask matches for money.',
    explanationSw: 'Hii ni mfumo wa kawaida wa udanganyifu wa mapenzi: kazi ya kigeni, mahali pa kambi ya wakimbizi, kisha maombi ya pesa.',
  },
  {
    id: 5,
    scenario: 'You win "KES 1,000,000 Safaricom Promotion" via SMS. To claim, they say you must send KES 2,500 "processing fee" to a till number.',
    scenarioSw: 'Unashinda "KES 1,000,000 Safaricom Promotion" kwa SMS. Kudai, wanasema lazima utume KES 2,500 "ada ya usindikaji" kwa nambari ya till.',
    options: [
      { text: 'Pay the fee - it\'s small compared to the prize', correct: false },
      { text: 'Ignore - legitimate promotions never require upfront payment', correct: true },
      { text: 'Call the number to verify', correct: false },
    ],
    explanation: 'Legitimate lottery/promotions NEVER require payment to claim winnings. This is a classic advance-fee scam.',
    explanationSw: 'Promosheni halali HAZIHITAJI malipo kudai tuzo. Huu ni udanganyifu wa kawaida wa ada ya mapema.',
  },
]

// Security Checklist Items
const SECURITY_CHECKLIST = [
  { id: 'password-unique', text: 'Use unique passwords for each account', textSw: 'Tumia nywila tofauti kwa kila akaunti', category: 'passwords' },
  { id: 'password-strong', text: 'All passwords are 12+ characters', textSw: 'Nywila zote zina herufi 12+', category: 'passwords' },
  { id: '2fa-email', text: 'Enabled 2FA on email accounts', textSw: 'Umewasha 2FA kwenye akaunti za barua pepe', category: '2fa' },
  { id: '2fa-social', text: 'Enabled 2FA on social media', textSw: 'Umewasha 2FA kwenye mitandao ya kijamii', category: '2fa' },
  { id: '2fa-banking', text: 'Enabled 2FA on banking/M-Pesa', textSw: 'Umewasha 2FA kwenye benki/M-Pesa', category: '2fa' },
  { id: 'fb-private', text: 'Facebook profile set to Friends only', textSw: 'Wasifu wa Facebook umewekwa Marafiki pekee', category: 'facebook' },
  { id: 'fb-tags', text: 'Facebook tag review enabled', textSw: 'Ukaguzi wa lebo za Facebook umewashwa', category: 'facebook' },
  { id: 'ig-private', text: 'Instagram account set to Private', textSw: 'Akaunti ya Instagram imewekwa Faragha', category: 'instagram' },
  { id: 'ig-messages', text: 'Instagram message filtering enabled', textSw: 'Uchujaji wa ujumbe wa Instagram umewashwa', category: 'instagram' },
  { id: 'wa-groups', text: 'WhatsApp groups set to Contacts only', textSw: 'Vikundi vya WhatsApp vimewekwa Wawasiliani pekee', category: 'whatsapp' },
  { id: 'wa-2step', text: 'WhatsApp two-step verification enabled', textSw: 'Uthibitishaji wa hatua mbili wa WhatsApp umewashwa', category: 'whatsapp' },
  { id: 'google-yourself', text: 'Googled yourself in last 30 days', textSw: 'Umejitafuta Google siku 30 zilizopita', category: 'awareness' },
  { id: 'backup-codes', text: 'Saved 2FA backup codes offline', textSw: 'Umehifadhi misimbo ya akiba ya 2FA nje ya mtandao', category: '2fa' },
]

// Quick Fix Actions
const QUICK_FIXES = [
  {
    id: 'lockdown-fb',
    title: 'Lock Down Facebook Now',
    titleSw: 'Funga Facebook Sasa',
    icon: '📘',
    url: 'https://www.facebook.com/privacy/checkup',
    description: 'Opens Facebook Privacy Checkup',
    descriptionSw: 'Inafungua Ukaguzi wa Faragha wa Facebook',
  },
  {
    id: 'lockdown-google',
    title: 'Secure Google Account',
    titleSw: 'Linda Akaunti ya Google',
    icon: '🔍',
    url: 'https://myaccount.google.com/security-checkup',
    description: 'Opens Google Security Checkup',
    descriptionSw: 'Inafungua Ukaguzi wa Usalama wa Google',
  },
  {
    id: 'lockdown-ig',
    title: 'Make Instagram Private',
    titleSw: 'Fanya Instagram Faragha',
    icon: '📸',
    url: 'https://www.instagram.com/accounts/privacy_and_security/',
    description: 'Opens Instagram Privacy Settings',
    descriptionSw: 'Inafungua Mipangilio ya Faragha ya Instagram',
  },
  {
    id: 'check-breach',
    title: 'Check Data Breaches',
    titleSw: 'Angalia Uvujaji wa Data',
    icon: '🔓',
    url: 'https://haveibeenpwned.com',
    description: 'Check if your email was leaked',
    descriptionSw: 'Angalia kama barua pepe yako imevuja',
  },
]

// Swahili Safety Terms Glossary
const SWAHILI_GLOSSARY = [
  { term: 'Phishing', swahili: 'Ulaghai wa Phishing', definition: 'Fake messages pretending to be from trusted sources' },
  { term: 'Password', swahili: 'Nywila', definition: 'Secret word/phrase to access accounts' },
  { term: 'Two-Factor Authentication', swahili: 'Uthibitishaji wa Hatua Mbili', definition: 'Extra security step beyond password' },
  { term: 'Scam', swahili: 'Ulaghai / Udanganyifu', definition: 'Trick to steal money or information' },
  { term: 'Privacy', swahili: 'Faragha', definition: 'Keeping your information private' },
  { term: 'Harassment', swahili: 'Unyanyasaji', definition: 'Unwanted, aggressive behavior' },
  { term: 'Block', swahili: 'Zuia / Funga', definition: 'Prevent someone from contacting you' },
  { term: 'Report', swahili: 'Ripoti', definition: 'Tell the platform about bad behavior' },
  { term: 'Screenshot', swahili: 'Picha ya Skrini', definition: 'Picture of what\'s on your screen' },
  { term: 'Account', swahili: 'Akaunti', definition: 'Your personal profile on a service' },
]

// ============================================
// MAIN COMPONENT
// ============================================

function LiteracyHub() {
  const [activeTab, setActiveTab] = useState('tutorials')
  const [showSwahili, setShowSwahili] = useState(false)
  const [completedItems, setCompletedItems] = useState(() => {
    const saved = localStorage.getItem('dfs_literacy_progress')
    return saved ? JSON.parse(saved) : {}
  })

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('dfs_literacy_progress', JSON.stringify(completedItems))
  }, [completedItems])

  // Calculate overall progress
  const totalItems = SECURITY_CHECKLIST.length + THREAT_TUTORIALS.length + SAFEGUARDING_GUIDES.length
  const completedCount = Object.values(completedItems).filter(Boolean).length
  const progressPercent = Math.round((completedCount / totalItems) * 100)

  const tabs = [
    { id: 'tutorials', label: showSwahili ? 'Mafunzo' : 'Tutorials', icon: '🎓' },
    { id: 'guides', label: showSwahili ? 'Miongozo' : 'Guides', icon: '📖' },
    { id: 'quiz', label: showSwahili ? 'Jaribio' : 'Quiz', icon: '❓' },
    { id: 'checklist', label: showSwahili ? 'Orodha' : 'Checklist', icon: '✅' },
    { id: 'glossary', label: showSwahili ? 'Istilahi' : 'Glossary', icon: '📚' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-deep-purple mb-2">
          {showSwahili ? '🎓 Kituo cha Elimu ya Kidijitali' : '🎓 Digital Literacy Hub'}
        </h2>
        <p className="text-charcoal/70">
          {showSwahili 
            ? 'Jifunze kulinda usalama wako wa mtandaoni na mafunzo ya vitendo.'
            : 'Learn to protect yourself online with practical tutorials.'}
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

      {/* Quick Fixes */}
      <div className="card">
        <h3 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
          <span>⚡</span>
          {showSwahili ? 'Marekebisho ya Haraka' : 'Quick Privacy Fixes'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {QUICK_FIXES.map(fix => (
            <a
              key={fix.id}
              href={fix.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-3 bg-light-lilac/50 rounded-xl
                         hover:bg-deep-purple hover:text-white transition-all text-center group"
            >
              <span className="text-2xl mb-1">{fix.icon}</span>
              <span className="text-xs font-medium">
                {showSwahili ? fix.titleSw : fix.title}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              ${activeTab === tab.id 
                ? 'bg-deep-purple text-white' 
                : 'bg-light-lilac text-deep-purple hover:bg-deep-purple/10'}`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'tutorials' && (
          <TutorialsSection 
            showSwahili={showSwahili} 
            completedItems={completedItems}
            setCompletedItems={setCompletedItems}
          />
        )}
        {activeTab === 'guides' && (
          <GuidesSection 
            showSwahili={showSwahili}
            completedItems={completedItems}
            setCompletedItems={setCompletedItems}
          />
        )}
        {activeTab === 'quiz' && (
          <QuizSection showSwahili={showSwahili} />
        )}
        {activeTab === 'checklist' && (
          <ChecklistSection 
            showSwahili={showSwahili}
            completedItems={completedItems}
            setCompletedItems={setCompletedItems}
          />
        )}
        {activeTab === 'glossary' && (
          <GlossarySection showSwahili={showSwahili} />
        )}
      </div>
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function TutorialsSection({ showSwahili, completedItems, setCompletedItems }) {
  const [activeTutorial, setActiveTutorial] = useState(null)

  const markComplete = (tutorialId) => {
    setCompletedItems(prev => ({
      ...prev,
      [`tutorial_${tutorialId}`]: true
    }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-deep-purple">
        {showSwahili ? '🎣 Mafunzo ya Kutambua Vitisho' : '🎣 Threat Detection Tutorials'}
      </h3>
      
      {activeTutorial ? (
        <TutorialDetail 
          tutorial={THREAT_TUTORIALS.find(t => t.id === activeTutorial)}
          showSwahili={showSwahili}
          onBack={() => setActiveTutorial(null)}
          onComplete={() => markComplete(activeTutorial)}
          isCompleted={completedItems[`tutorial_${activeTutorial}`]}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {THREAT_TUTORIALS.map(tutorial => (
            <button
              key={tutorial.id}
              onClick={() => setActiveTutorial(tutorial.id)}
              className={`card text-left hover:shadow-medium transition-all group
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
  )
}

function TutorialDetail({ tutorial, showSwahili, onBack, onComplete, isCompleted }) {
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const handleQuizAnswer = (questionIndex, optionIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }))
  }

  const checkQuiz = () => {
    setShowResults(true)
    const allCorrect = tutorial.content.quiz?.every((q, i) => quizAnswers[i] === q.correct)
    if (allCorrect) {
      onComplete()
    }
  }

  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-deep-purple hover:underline flex items-center gap-1"
        >
          ← {showSwahili ? 'Rudi' : 'Back'}
        </button>
        {isCompleted && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            ✓ {showSwahili ? 'Imekamilika' : 'Completed'}
          </span>
        )}
      </div>

      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-deep-purple flex items-center gap-2">
          <span>{tutorial.icon}</span>
          {showSwahili ? tutorial.titleSw : tutorial.title}
        </h3>
        <p className="text-charcoal/70 mt-2">
          {showSwahili ? tutorial.content.introSw : tutorial.content.intro}
        </p>
      </div>

      {/* Sections */}
      {tutorial.content.sections.map((section, idx) => (
        <div key={idx} className="space-y-3">
          <h4 className="font-semibold text-charcoal border-b border-light-lilac pb-2">
            {showSwahili ? section.titleSw : section.title}
          </h4>
          <div className="space-y-2">
            {section.points.map((point, pidx) => (
              <div 
                key={pidx} 
                className={`p-3 rounded-xl ${point.isFake ? 'bg-red-50 border border-red-200' : 'bg-light-lilac/30'}`}
              >
                <p className={`text-sm ${point.isFake ? 'text-red-700' : 'text-charcoal'}`}>
                  {point.isFake && <span className="font-bold">🚨 SCAM: </span>}
                  {point.text}
                </p>
                {(point.tip || point.explanation) && (
                  <p className="text-xs text-charcoal/60 mt-1 italic">
                    💡 {point.tip || point.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Quiz */}
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
                        : 'bg-white border border-light-lilac hover:border-deep-purple'}
                      ${showResults && oidx === q.correct ? 'bg-green-100 border-2 border-green-500' : ''}`}
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
              className="btn-primary w-full disabled:opacity-50"
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

function GuidesSection({ showSwahili, completedItems, setCompletedItems }) {
  const [activeGuide, setActiveGuide] = useState(null)

  const markComplete = (guideId) => {
    setCompletedItems(prev => ({
      ...prev,
      [`guide_${guideId}`]: true
    }))
  }

  const groupedGuides = {
    'All Platforms': SAFEGUARDING_GUIDES.filter(g => g.platform === 'All'),
    'Social Media': SAFEGUARDING_GUIDES.filter(g => ['Facebook', 'Instagram', 'Twitter/X'].includes(g.platform)),
    'Messaging': SAFEGUARDING_GUIDES.filter(g => g.platform === 'WhatsApp'),
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-deep-purple">
        {showSwahili ? '🔐 Miongozo ya Kulinda Akaunti' : '🔐 Account Safeguarding Guides'}
      </h3>

      {activeGuide ? (
        <GuideDetail 
          guide={SAFEGUARDING_GUIDES.find(g => g.id === activeGuide)}
          showSwahili={showSwahili}
          onBack={() => setActiveGuide(null)}
          onComplete={() => markComplete(activeGuide)}
          isCompleted={completedItems[`guide_${activeGuide}`]}
        />
      ) : (
        Object.entries(groupedGuides).map(([category, guides]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-charcoal/60 uppercase tracking-wide mb-3">
              {category}
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {guides.map(guide => (
                <button
                  key={guide.id}
                  onClick={() => setActiveGuide(guide.id)}
                  className={`card text-left hover:shadow-medium transition-all group p-4
                    ${completedItems[`guide_${guide.id}`] ? 'border-2 border-green-300 bg-green-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{guide.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-charcoal group-hover:text-deep-purple">
                          {showSwahili ? guide.titleSw : guide.title}
                        </h4>
                        {completedItems[`guide_${guide.id}`] && (
                          <span className="text-green-500 text-sm">✓</span>
                        )}
                      </div>
                      <span className="text-xs text-charcoal/50">{guide.platform}</span>
                    </div>
                    <span className="text-charcoal/30 group-hover:text-deep-purple">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function GuideDetail({ guide, showSwahili, onBack, onComplete, isCompleted }) {
  const [checkedSteps, setCheckedSteps] = useState([])

  const toggleStep = (index) => {
    setCheckedSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const allStepsComplete = checkedSteps.length === guide.steps.length

  useEffect(() => {
    if (allStepsComplete && !isCompleted) {
      onComplete()
    }
  }, [allStepsComplete])

  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-deep-purple hover:underline flex items-center gap-1"
        >
          ← {showSwahili ? 'Rudi' : 'Back'}
        </button>
        {isCompleted && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            ✓ {showSwahili ? 'Imekamilika' : 'Completed'}
          </span>
        )}
      </div>

      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-deep-purple flex items-center gap-2">
          <span>{guide.icon}</span>
          {showSwahili ? guide.titleSw : guide.title}
        </h3>
        <span className="text-sm text-charcoal/60">{guide.platform}</span>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {guide.steps.map((step, idx) => (
          <div 
            key={idx}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer
              ${checkedSteps.includes(idx) ? 'bg-green-50' : 'bg-light-lilac/30 hover:bg-light-lilac/50'}`}
            onClick={() => toggleStep(idx)}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
              ${checkedSteps.includes(idx) ? 'bg-green-500 border-green-500 text-white' : 'border-charcoal/30'}`}>
              {checkedSteps.includes(idx) && '✓'}
            </div>
            <div>
              <p className={`text-sm font-medium ${checkedSteps.includes(idx) ? 'line-through text-charcoal/50' : 'text-charcoal'}`}>
                <span className="text-deep-purple font-bold mr-2">{idx + 1}.</span>
                {step.text}
              </p>
              {step.example && (
                <p className="text-xs text-charcoal/60 mt-1 italic">
                  {step.example}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Local Tip */}
      {guide.localTip && (
        <div className="p-4 bg-sunrise-orange/10 rounded-xl border-l-4 border-sunrise-orange">
          <p className="text-sm text-charcoal">
            <span className="font-bold">🇰🇪 Kenya Tip: </span>
            {showSwahili ? guide.localTipSw : guide.localTip}
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="text-center pt-4 border-t border-light-lilac">
        <p className="text-sm text-charcoal/60">
          {checkedSteps.length} / {guide.steps.length} {showSwahili ? 'hatua zimekamilika' : 'steps completed'}
        </p>
        {allStepsComplete && (
          <p className="text-green-600 font-medium mt-2">
            🎉 {showSwahili ? 'Mwongozo umekamilika!' : 'Guide completed!'}
          </p>
        )}
      </div>
    </div>
  )
}

function QuizSection({ showSwahili }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)

  const question = SCAM_QUIZ[currentQuestion]
  const totalQuestions = SCAM_QUIZ.length

  const handleAnswer = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }))
    setShowResult(true)
  }

  const nextQuestion = () => {
    setShowResult(false)
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setQuizComplete(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
    setQuizComplete(false)
  }

  const correctCount = Object.entries(answers).filter(([qIdx, aIdx]) => 
    SCAM_QUIZ[parseInt(qIdx)].options[aIdx].correct
  ).length

  if (quizComplete) {
    const percentage = Math.round((correctCount / totalQuestions) * 100)
    return (
      <div className="card text-center space-y-6">
        <div className="text-6xl">
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '📚'}
        </div>
        <h3 className="text-xl font-bold text-deep-purple">
          {showSwahili ? 'Matokeo ya Jaribio' : 'Quiz Results'}
        </h3>
        <div className="text-4xl font-bold text-sunrise-orange">
          {correctCount} / {totalQuestions}
        </div>
        <p className="text-charcoal/70">
          {percentage >= 80 
            ? (showSwahili ? 'Bora sana! Unajua kutambua udanganyifu.' : 'Excellent! You know how to spot scams.')
            : percentage >= 60
            ? (showSwahili ? 'Vizuri! Endelea kujifunza.' : 'Good job! Keep learning.')
            : (showSwahili ? 'Soma tena mafunzo na ujaribu tena.' : 'Review the tutorials and try again.')}
        </p>
        <button onClick={resetQuiz} className="btn-primary">
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
          {currentQuestion + 1} / {totalQuestions}
        </span>
      </div>

      {/* Progress */}
      <div className="h-2 bg-light-lilac rounded-full overflow-hidden">
        <div 
          className="h-full bg-deep-purple transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="card">
        <div className="p-4 bg-charcoal/5 rounded-xl mb-4">
          <p className="text-sm text-charcoal font-medium">
            📱 {showSwahili ? 'Hali:' : 'Scenario:'}
          </p>
          <p className="text-charcoal mt-2 italic">
            "{showSwahili ? question.scenarioSw : question.scenario}"
          </p>
        </div>

        <p className="font-medium text-charcoal mb-4">
          {showSwahili ? 'Unafanya nini?' : 'What do you do?'}
        </p>

        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl transition-all border-2
                ${showResult 
                  ? option.correct 
                    ? 'bg-green-100 border-green-500'
                    : answers[currentQuestion] === idx
                    ? 'bg-red-100 border-red-500'
                    : 'border-light-lilac'
                  : 'border-light-lilac hover:border-deep-purple hover:bg-light-lilac/30'}`}
            >
              <span className="flex items-center gap-2">
                {showResult && option.correct && <span className="text-green-500">✓</span>}
                {showResult && answers[currentQuestion] === idx && !option.correct && <span className="text-red-500">✗</span>}
                {option.text}
              </span>
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-4 p-4 bg-sunrise-orange/10 rounded-xl animate-fade-in">
            <p className="text-sm text-charcoal">
              <span className="font-bold">💡 {showSwahili ? 'Maelezo' : 'Explanation'}: </span>
              {showSwahili ? question.explanationSw : question.explanation}
            </p>
          </div>
        )}

        {showResult && (
          <button onClick={nextQuestion} className="btn-primary w-full mt-4">
            {currentQuestion < totalQuestions - 1 
              ? (showSwahili ? 'Swali Lifuatalo →' : 'Next Question →')
              : (showSwahili ? 'Angalia Matokeo' : 'See Results')}
          </button>
        )}
      </div>
    </div>
  )
}

function ChecklistSection({ showSwahili, completedItems, setCompletedItems }) {
  const toggleItem = (itemId) => {
    setCompletedItems(prev => ({
      ...prev,
      [`checklist_${itemId}`]: !prev[`checklist_${itemId}`]
    }))
  }

  const categories = {
    passwords: { label: showSwahili ? '🔑 Nywila' : '🔑 Passwords', items: SECURITY_CHECKLIST.filter(i => i.category === 'passwords') },
    '2fa': { label: showSwahili ? '🔐 Uthibitishaji wa 2FA' : '🔐 Two-Factor Auth', items: SECURITY_CHECKLIST.filter(i => i.category === '2fa') },
    facebook: { label: '📘 Facebook', items: SECURITY_CHECKLIST.filter(i => i.category === 'facebook') },
    instagram: { label: '📸 Instagram', items: SECURITY_CHECKLIST.filter(i => i.category === 'instagram') },
    whatsapp: { label: '💬 WhatsApp', items: SECURITY_CHECKLIST.filter(i => i.category === 'whatsapp') },
    awareness: { label: showSwahili ? '🧠 Ufahamu' : '🧠 Awareness', items: SECURITY_CHECKLIST.filter(i => i.category === 'awareness') },
  }

  const completedCount = SECURITY_CHECKLIST.filter(i => completedItems[`checklist_${i.id}`]).length
  const totalCount = SECURITY_CHECKLIST.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-deep-purple">
          ✅ {showSwahili ? 'Orodha ya Ukaguzi wa Usalama' : 'Security Checklist'}
        </h3>
        <span className="text-sm font-medium text-charcoal/60">
          {completedCount} / {totalCount}
        </span>
      </div>

      {/* Overall Progress */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E7EB" strokeWidth="6" />
              <circle 
                cx="32" cy="32" r="28" fill="none" stroke="#10B981" strokeWidth="6"
                strokeDasharray={`${(completedCount / totalCount) * 176} 176`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-green-600">
              {Math.round((completedCount / totalCount) * 100)}%
            </span>
          </div>
          <div>
            <p className="font-semibold text-charcoal">
              {completedCount === totalCount 
                ? (showSwahili ? '🎉 Hongera! Uko salama!' : '🎉 Congrats! You\'re secure!')
                : (showSwahili ? 'Kamilisha orodha kuimarisha usalama wako' : 'Complete the list to strengthen your security')}
            </p>
            <p className="text-sm text-charcoal/60">
              {totalCount - completedCount} {showSwahili ? 'vitu vilivyobaki' : 'items remaining'}
            </p>
          </div>
        </div>
      </div>

      {/* Checklist by Category */}
      {Object.entries(categories).map(([catId, category]) => (
        <div key={catId} className="card">
          <h4 className="font-semibold text-charcoal mb-3">{category.label}</h4>
          <div className="space-y-2">
            {category.items.map(item => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                  ${completedItems[`checklist_${item.id}`] 
                    ? 'bg-green-50' 
                    : 'bg-light-lilac/30 hover:bg-light-lilac/50'}`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                  ${completedItems[`checklist_${item.id}`] 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-charcoal/30'}`}>
                  {completedItems[`checklist_${item.id}`] && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${completedItems[`checklist_${item.id}`] ? 'line-through text-charcoal/50' : 'text-charcoal'}`}>
                  {showSwahili ? item.textSw : item.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function GlossarySection({ showSwahili }) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredTerms = SWAHILI_GLOSSARY.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.swahili.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-deep-purple">
        📚 {showSwahili ? 'Istilahi za Usalama wa Kidijitali' : 'Digital Safety Glossary'}
      </h3>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={showSwahili ? "Tafuta neno..." : "Search term..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Terms Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTerms.map((item, idx) => (
          <div key={idx} className="card p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-bold text-deep-purple">{item.term}</h4>
              <span className="text-xs px-2 py-1 bg-sunrise-orange/20 text-sunrise-orange rounded-full whitespace-nowrap">
                🇰🇪 {item.swahili}
              </span>
            </div>
            <p className="text-sm text-charcoal/70">{item.definition}</p>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <p className="text-center text-charcoal/50 py-8">
          {showSwahili ? 'Hakuna matokeo yaliyopatikana' : 'No results found'}
        </p>
      )}

      {/* Download Cheat Sheet */}
      <div className="card bg-gradient-to-r from-deep-purple/5 to-sunrise-orange/5 text-center">
        <h4 className="font-semibold text-charcoal mb-2">
          📥 {showSwahili ? 'Pakua Kadi ya Marejeleo' : 'Download Cheat Sheet'}
        </h4>
        <p className="text-sm text-charcoal/60 mb-4">
          {showSwahili 
            ? 'Pata PDF ya istilahi na vidokezo vya usalama'
            : 'Get a PDF with all terms and safety tips'}
        </p>
        <button 
          onClick={() => alert('PDF download feature - implement with jsPDF for production')}
          className="btn-secondary"
        >
          {showSwahili ? 'Pakua PDF' : 'Download PDF'}
        </button>
      </div>
    </div>
  )
}

export default LiteracyHub

