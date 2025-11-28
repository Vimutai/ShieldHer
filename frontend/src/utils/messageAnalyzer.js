/**
 * Message Analyzer Utility
 * Analyzes harassment messages and generates response templates
 * ENHANCED: Kenya-specific legal references and Swahili support
 * 
 * This uses keyword-based analysis for offline functionality.
 * For production with AI integration, see commented sections below.
 * 
 * ENVIRONMENT VARIABLES FOR AI INTEGRATION:
 * - VITE_OPENAI_API_KEY: OpenAI API key for GPT models
 * - VITE_ANTHROPIC_API_KEY: Anthropic API key for Claude models
 */

// Keyword patterns for different harassment types
const HARASSMENT_PATTERNS = {
  threats: {
    keywords: ['kill', 'hurt', 'harm', 'attack', 'find you', 'coming for', 'watch out', 
               'destroy', 'ruin', 'end you', 'make you pay', 'regret', 'sorry',
               // Swahili keywords
               'kuua', 'kuumiza', 'kukumaliza', 'nitakupata'],
    weight: 5,
  },
  sexual: {
    keywords: ['sexy', 'nudes', 'naked', 'body', 'send pics', 'hot', 'beautiful body',
               'want you', 'together', 'meet up', 'send photos',
               // Swahili keywords
               'picha zako', 'mwili wako', 'tukutane'],
    weight: 4,
  },
  stalking: {
    keywords: ['watching', 'following', 'know where', 'saw you', 'your house', 
               'your work', 'tracked', 'found your', 'i know where you live',
               'your location', 'your address',
               // Swahili keywords
               'nakufuata', 'najua unaishi', 'nimekuona'],
    weight: 5,
  },
  insults: {
    keywords: ['ugly', 'stupid', 'worthless', 'pathetic', 'loser', 'disgusting',
               'fat', 'dumb', 'idiot', 'trash', 'garbage', 'whore', 'slut',
               'useless', 'nobody', 'waste',
               // Swahili insults
               'mjinga', 'mwizi', 'malaya', 'bure kabisa'],
    weight: 2,
  },
  manipulation: {
    keywords: ['no one will believe', 'your fault', 'you made me', 'if you loved',
               'you owe me', 'after everything', 'you deserve', 'crazy',
               'everyone will know', 'i will tell', "you'll regret",
               // Swahili manipulation
               'kosa lako', 'utajuta', 'nitawaambia watu'],
    weight: 3,
  },
  doxxing: {
    keywords: ['address', 'phone number', 'tell everyone', 'expose', 'share this',
               'post this', 'your family', 'your friends will know', 'screenshot',
               'share your photos', 'leak', 'viral',
               // Swahili keywords
               'nitaweka mtandaoni', 'nitapost', 'familia yako'],
    weight: 4,
  },
  intimate_images: {
    keywords: ['share your photos', 'leak your nudes', 'everyone will see', 
               'post your pictures', 'your photos will', 'video of you',
               'revenge porn', 'intimate images', 'private pictures'],
    weight: 5,
  },
}

// Kenya-specific legal references
const KENYA_LEGAL = {
  cybercrimes: {
    act: 'Computer Misuse and Cybercrimes Act 2018',
    sections: {
      cyberbullying: 'Section 27',
      harassment: 'Section 27',
      threats: 'Section 28',
      false_publications: 'Section 22',
      intimate_images: 'Section 24 & Sexual Offences Act',
    },
  },
  penalties: {
    cyberbullying: 'Fine up to KES 200,000 or 2 years imprisonment',
    threats: 'Fine up to KES 5,000,000 or 10 years imprisonment',
    intimate_images: 'Up to 5 years imprisonment under Sexual Offences Act',
  },
  reporting: {
    dci: '0800 723 253 (toll-free)',
    emergency: '999 / 112',
    gbv_hotline: '1195',
  },
}

/**
 * Analyze a message for harassment patterns
 * @param {string} message - The message to analyze
 * @returns {Object} Analysis result with severity and categories
 */
export function analyzeMessage(message) {
  if (!message || typeof message !== 'string') {
    return { severity: 'low', categories: ['unknown'], score: 0 }
  }

  const lowerMessage = message.toLowerCase()
  const detectedCategories = []
  let totalScore = 0

  // Check each pattern category
  Object.entries(HARASSMENT_PATTERNS).forEach(([category, { keywords, weight }]) => {
    const found = keywords.some(keyword => lowerMessage.includes(keyword))
    if (found) {
      detectedCategories.push(category)
      totalScore += weight
    }
  })

  // Determine severity based on total score
  let severity = 'low'
  if (totalScore >= 8) severity = 'severe'
  else if (totalScore >= 5) severity = 'high'
  else if (totalScore >= 2) severity = 'medium'

  // Determine applicable Kenyan laws
  const applicableLaws = getApplicableLaws(detectedCategories)

  return {
    severity,
    categories: detectedCategories.length > 0 ? detectedCategories : ['general harassment'],
    score: totalScore,
    applicableLaws,
  }
}

/**
 * Get applicable Kenyan laws based on harassment categories
 */
function getApplicableLaws(categories) {
  const laws = []
  
  if (categories.includes('threats') || categories.includes('stalking')) {
    laws.push({
      name: 'Computer Misuse and Cybercrimes Act - Section 28',
      description: 'Cyber threats - up to 10 years imprisonment',
    })
  }
  
  if (categories.includes('insults') || categories.includes('manipulation')) {
    laws.push({
      name: 'Computer Misuse and Cybercrimes Act - Section 27',
      description: 'Cyberbullying - fine or up to 2 years imprisonment',
    })
  }
  
  if (categories.includes('intimate_images') || categories.includes('doxxing')) {
    laws.push({
      name: 'Sexual Offences Act - Section 24',
      description: 'Sharing intimate images - up to 5 years imprisonment',
    })
  }
  
  if (categories.includes('sexual')) {
    laws.push({
      name: 'Sexual Offences Act',
      description: 'Sexual harassment - criminal offense in Kenya',
    })
  }
  
  return laws
}

/**
 * Generate 4 response templates based on the message analysis
 * @param {string} originalMessage - The original harassment message
 * @param {Object} analysis - Analysis result from analyzeMessage
 * @returns {Array} Array of 4 response templates
 */
export function generateResponses(originalMessage, analysis) {
  const { severity, categories } = analysis

  // Base response templates - enhanced with Kenya context
  const templates = [
    // CALM: De-escalation focused
    {
      type: 'calm',
      text: generateCalmResponse(severity, categories),
      textSw: generateCalmResponseSwahili(severity, categories),
      note: 'Use this to maintain composure and not escalate the situation.',
      noteSw: 'Tumia hii kudumisha utulivu bila kuongeza hali.',
    },
    // LEGAL: Kenya law-focused formal response
    {
      type: 'legal',
      text: generateLegalResponse(severity, categories),
      textSw: generateLegalResponseSwahili(severity, categories),
      note: 'References Kenyan law. Use if you may involve authorities.',
      noteSw: 'Inarejelea sheria za Kenya. Tumia ukitaka kushirikisha mamlaka.',
    },
    // SUPPORTIVE: For sharing with allies
    {
      type: 'supportive',
      text: generateSupportiveResponse(severity, categories),
      textSw: generateSupportiveResponseSwahili(severity, categories),
      note: 'Use when communicating with friends/family about the situation.',
      noteSw: 'Tumia unapowasiliana na marafiki/familia kuhusu hali.',
    },
    // REPORT: Platform + Kenya authorities reporting template
    {
      type: 'report',
      text: generateReportTemplate(severity, categories),
      textSw: generateReportTemplateSwahili(severity, categories),
      note: 'Template for reporting to platform AND Kenya DCI Cybercrime Unit.',
      noteSw: 'Kiolezo cha kuripoti kwenye jukwaa NA DCI Kenya.',
    },
  ]

  return templates
}

/**
 * Generate calm, de-escalation response
 */
function generateCalmResponse(severity, categories) {
  if (severity === 'severe' || categories.includes('threats')) {
    return "I'm not going to engage with this type of communication. I am documenting this message and will not respond further. Your behavior is being recorded."
  }
  
  if (categories.includes('manipulation')) {
    return "I understand you're upset, but I won't accept responsibility for your behavior. I'm choosing not to continue this conversation in this way. Please respect my boundaries."
  }

  if (categories.includes('sexual')) {
    return "This message is inappropriate and unwelcome. I do not consent to this type of communication. Please stop contacting me in this manner."
  }

  return "I've received your message. I don't believe this type of communication is helpful for either of us. If you'd like to have a respectful conversation, I'm open to that. Otherwise, I won't be responding further."
}

function generateCalmResponseSwahili(severity, categories) {
  if (severity === 'severe' || categories.includes('threats')) {
    return "Sitashiriki katika mawasiliano ya aina hii. Ninahifadhi ujumbe huu kama ushahidi na sitajibu tena. Tabia yako inarekodiwa."
  }
  
  if (categories.includes('manipulation')) {
    return "Naelewa umekasirika, lakini sitakubali lawama kwa tabia yako. Tafadhali heshimu mipaka yangu."
  }

  return "Nimepokea ujumbe wako. Sioni mawasiliano ya aina hii kuwa na manufaa. Tafadhali wasiliana nami kwa heshima au sitajibu."
}

/**
 * Generate Kenya law-focused legal response
 */
function generateLegalResponse(severity, categories) {
  const date = new Date().toLocaleDateString('en-KE')
  
  if (severity === 'severe' || categories.includes('threats') || categories.includes('stalking')) {
    return `This message, received on ${date}, constitutes a criminal offense under Kenya's Computer Misuse and Cybercrimes Act 2018, Section 28 (Cyber Threats). I am documenting all evidence and will report to the DCI Cybercrime Unit (0800 723 253). Continued contact may result in prosecution with penalties up to 10 years imprisonment. This is your formal notice to cease all contact.`
  }

  if (categories.includes('intimate_images') || categories.includes('doxxing')) {
    return `This message, received on ${date}, violates Kenya's Sexual Offences Act Section 24 and the Computer Misuse and Cybercrimes Act 2018. Sharing intimate images without consent is a criminal offense punishable by up to 5 years imprisonment. I am preserving this evidence for legal action. Cease all contact immediately.`
  }

  if (categories.includes('sexual')) {
    return `This message constitutes sexual harassment under Kenyan law. I am documenting this communication dated ${date} and may report to authorities. Your continued contact is unwanted and may result in legal consequences under the Sexual Offences Act.`
  }

  return `I am formally requesting that you cease this type of communication. This message has been documented as of ${date}. Under Kenya's Computer Misuse and Cybercrimes Act 2018, cyberbullying and harassment are criminal offenses (Section 27). Continued unwanted contact may be reported to the DCI Cybercrime Unit.`
}

function generateLegalResponseSwahili(severity, categories) {
  const date = new Date().toLocaleDateString('sw-KE')

  if (severity === 'severe' || categories.includes('threats')) {
    return `Ujumbe huu, uliopokelewa ${date}, ni kosa la jinai chini ya Sheria ya Computer Misuse and Cybercrimes Act 2018 ya Kenya, Kifungu 28. Ninahifadhi ushahidi wote na nitaripoti kwa DCI Cybercrime Unit (0800 723 253). Kuendelea kuwasiliana kunaweza kusababisha mashtaka na adhabu ya hadi miaka 10 jela.`
  }

  return `Ninaomba rasmi usimamishe mawasiliano ya aina hii. Ujumbe huu umerekodiwa tarehe ${date}. Chini ya Sheria ya Kenya, unyanyasaji wa mtandao ni kosa la jinai. Kuendelea kunaweza kuripotiwa kwa DCI.`
}

/**
 * Generate supportive response (for sharing with allies)
 */
function generateSupportiveResponse(severity, categories) {
  const categoryStr = categories.join(' and ')
  
  if (severity === 'severe') {
    return `I need to share something serious with you. I've been receiving harassing messages that include ${categoryStr}. I've been documenting everything with screenshots and dates. I may need support in reporting to the DCI Cybercrime Unit (0800 723 253) or FIDA Kenya for legal help. Can we talk about this?`
  }

  if (categories.includes('manipulation')) {
    return `I wanted to let you know I've been dealing with some manipulative messages. The person is trying to make me feel responsible for their behavior. I'm not engaging, but it helps to have someone I trust know what's happening. The GBV hotline (1195) says this is a common tactic.`
  }

  return `I've been receiving some uncomfortable messages online and wanted to share this with you. I'm handling it by documenting everything and not responding. It helps to have someone know what's going on. If it escalates, I know I can report to the DCI at 0800 723 253.`
}

function generateSupportiveResponseSwahili(severity, categories) {
  if (severity === 'severe') {
    return `Ninahitaji kukushirikisha jambo zito. Nimekuwa nikipokea ujumbe wa unyanyasaji. Nimekuwa nikihifadhi ushahidi wote. Ninahitaji msaada wako kuripoti kwa DCI (0800 723 253) au FIDA Kenya. Tunaweza kuongea?`
  }

  return `Nimekuwa nikipokea ujumbe usio wa kawaida mtandaoni na nilitaka kukuambia. Ninadhibiti hali kwa kuhifadhi ushahidi na kutokujibu. Inasaidia kuwa na mtu anayejua kinachoendelea.`
}

/**
 * Generate Kenya-specific platform report template
 */
function generateReportTemplate(severity, categories) {
  const categoryList = categories.join(', ')
  const date = new Date().toLocaleDateString('en-KE')
  
  return `PLATFORM REPORT:
I am reporting a user for harassment and abuse. On ${date}, I received message(s) containing: ${categoryList}.

This communication was unwanted, makes me feel unsafe, and violates community guidelines. I am attaching screenshots as evidence. I request that:
1. This content be removed immediately
2. The user account be investigated
3. Appropriate action be taken per your terms of service

KENYA DCI REPORT (if filing):
- Offense: Cybercrime under Computer Misuse and Cybercrimes Act 2018
- Categories: ${categoryList}
- Date of incident: ${date}
- Evidence: Screenshots attached
- DCI Cybercrime Unit: 0800 723 253

I have preserved all evidence and am prepared to cooperate with any investigation.`
}

function generateReportTemplateSwahili(severity, categories) {
  const categoryList = categories.join(', ')
  const date = new Date().toLocaleDateString('sw-KE')
  
  return `RIPOTI YA JUKWAA:
Ninawaripoti mtumiaji kwa unyanyasaji. Tarehe ${date}, nilipokea ujumbe wenye: ${categoryList}.

Mawasiliano haya hayakuombwa na yananifanya nijisikie siko salama.

RIPOTI YA DCI KENYA:
- Kosa: Uhalifu wa mtandao chini ya Sheria ya 2018
- Aina: ${categoryList}
- Tarehe: ${date}
- Ushahidi: Picha za skrini zimeambatanishwa
- DCI: 0800 723 253

Nimehifadhi ushahidi wote.`
}

/* ============================================
 * AI INTEGRATION HOOKS (Commented for offline use)
 * ============================================
 * 
 * To enable AI-powered analysis, uncomment the code below
 * and set the appropriate environment variables.
 * 
 * OPENAI INTEGRATION:
 * -------------------
 * async function analyzeWithOpenAI(message) {
 *   const apiKey = import.meta.env.VITE_OPENAI_API_KEY
 *   if (!apiKey) return null
 *   
 *   const response = await fetch('https://api.openai.com/v1/chat/completions', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${apiKey}`,
 *     },
 *     body: JSON.stringify({
 *       model: 'gpt-3.5-turbo',
 *       messages: [
 *         {
 *           role: 'system',
 *           content: 'You are a helpful assistant that analyzes messages for harassment patterns in Kenya context. Reference Kenyan laws like Computer Misuse and Cybercrimes Act 2018. Be sensitive and supportive.'
 *         },
 *         {
 *           role: 'user',
 *           content: `Analyze this message for harassment: "${message}". Return JSON with severity (low/medium/high/severe), categories (array), applicableLaws (array of Kenya laws), and 4 response templates.`
 *         }
 *       ],
 *       temperature: 0.7,
 *     }),
 *   })
 *   
 *   const data = await response.json()
 *   return JSON.parse(data.choices[0].message.content)
 * }
 * 
 * ANTHROPIC (CLAUDE) INTEGRATION:
 * -------------------------------
 * async function analyzeWithAnthropic(message) {
 *   const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
 *   if (!apiKey) return null
 *   
 *   const response = await fetch('https://api.anthropic.com/v1/messages', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'x-api-key': apiKey,
 *       'anthropic-version': '2023-06-01',
 *     },
 *     body: JSON.stringify({
 *       model: 'claude-3-haiku-20240307',
 *       max_tokens: 1024,
 *       messages: [
 *         {
 *           role: 'user',
 *           content: `As a supportive assistant for Kenya, analyze this harassment message. Reference Kenya's Computer Misuse and Cybercrimes Act 2018. Provide: 1) severity level, 2) harassment categories, 3) applicable Kenyan laws, 4) four response templates (calm, legal with Kenya law references, supportive, report). Message: "${message}"`
 *         }
 *       ],
 *     }),
 *   })
 *   
 *   const data = await response.json()
 *   return parseAnthropicResponse(data.content[0].text)
 * }
 */

export default { analyzeMessage, generateResponses }
