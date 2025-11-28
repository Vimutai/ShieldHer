/**
 * AI Companion Component - Enhanced Offline Mode (Perfect for Hackathon)
 * No API keys needed - completely self-contained
 */
import { useState, useRef, useEffect } from 'react'

// Enhanced response database
const COMPANION_RESPONSES = {
  greeting: {
    responses: [
      "Hello! I'm your Digital Safety Companion. 💜 I'm here to support you with online safety, privacy settings, and dealing with harassment. What's on your mind?",
      "Hi there! I'm your digital safety assistant. I can help with privacy settings, reporting harassment, or general online safety tips. How can I assist you today? 💜",
      "Jambo! I'm here to help you stay safe online. You can ask me about privacy settings, reporting issues, or digital safety advice. What would you like to know? 💜"
    ],
    responsesSw: [
      "Habari! Mimi ni Msaidizi wako wa Usalama wa Kidijitali. 💜 Niko hapa kukusaidia kwa usalama mtandaoni, mipangilio ya faragha, na kukabiliana na unyanyasaji. Kuna nini unaweza kuniambia?",
      "Hujambo! Niko hapa kukusaidia kukaa salama mtandaoni. Unaweza kuniuliza kuhusu mipangilio ya faragha, kuripoti matatizo, au ushauri wa usalama wa kidijitali. Ungependa kujua nini? 💜",
      "Karibu! Mimi ni msaidizi wako wa usalama. Niko tayari kukupa ushauri kuhusu usalama wa kidijitali, faragha, na kukabiliana na matatizo mtandaoni. 💜"
    ]
  },
  harassment: {
    responses: [
      "I'm sorry you're experiencing this. Your safety matters. Here's what I suggest:\n\n• **Document everything** - Take screenshots before blocking\n• **Don't engage** - Responding often escalates the situation\n• **Report to the platform** using their report features\n• **Consider reporting to DCI Cybercrime**: 0800 723 253 (toll-free)\n\nWould you like help with any of these steps?",
      "That sounds really difficult. Remember you're not alone in this. Quick safety steps:\n\n📱 **Immediate actions**:\n• Block the person\n• Save all evidence\n• Adjust privacy settings\n\n🚔 **Legal support**: DCI Cybercrime Unit: 0800 723 253\n💜 **Emotional support**: GBV Hotline: 1195",
      "I understand this is stressful. Here's a clear action plan:\n\n1. **Preserve evidence** - screenshots with timestamps\n2. **Secure your accounts** - check privacy settings\n3. **Report appropriately** - platform first, then authorities if needed\n4. **Seek support** - don't hesitate to call 1195 for counseling"
    ],
    responsesSw: [
      "Pole sana unakabiliwa na hili. Usalama wako ni muhimu. Hapa kuna mapendekezo:\n\n• **Hifadhi ushahidi wote** - Piga picha za skrini kabla ya kuzuia\n• **Usijibu** - Kujibu kunaweza kuongeza tatizo\n• **Ripoti kwenye jukwaa** - Tumia vitufe vya kuripoti\n• **Fikiria kuripoti kwa DCI**: 0800 723 253 (bure)\n\nUnahitaji msaada na hatua yoyote?",
      "Hiyo inasikika kuwa ngumu. Kumbuka huko peke yako. Hatua za usalama za haraka:\n\n📱 **Hatua za haraka**:\n• Zuia mtu huyo\n• Hifadhi ushahidi wote\n• Rekebisha mipangilio ya faragha\n\n🚔 **Msaada wa kisheria**: DCI Cybercrime: 0800 723 253\n💜 **Msaada wa kihemko**: GBV Hotline: 1195",
      "Naelewa hii inakuvutia. Hapa kuna mpango wa hatua wazi:\n\n1. **Hifadhi ushahidi** - picha za skrini zikiwa na tarehe\n2. **Linda akaunti zako** - angalia mipangilio ya faragha\n3. **Ripoti kwa usahihi** - jukwaa kwanza, kisha mamlaka ikiwa inahitajika\n4. **Tafuta msaada** - usisite kupiga 1195 kwa ushauri"
    ]
  },
  privacy: {
    responses: [
      "Great question about privacy! Here are quick wins for major platforms:\n\n🔒 **Facebook Privacy**:\n• Settings → Privacy → Limit past posts to 'Friends'\n• Settings → Profile → Review what others see\n• Settings → Blocking → Manage blocked list\n\n📸 **Instagram Security**:\n• Settings → Privacy → Private account (ON)\n• Settings → Privacy → Story controls\n• Settings → Security → Two-factor authentication\n\n💬 **WhatsApp Safety**:\n• Settings → Account → Privacy → Last seen, Profile photo\n• Settings → Privacy → Groups → 'My contacts'\n• Settings → Security → Show security notifications",
      "Let me help you lock down your digital presence:\n\n**Immediate privacy checklist**:\n✓ Set all social media to private\n✓ Review tagged photos and posts\n✓ Remove personal info from public profiles\n✓ Use unique passwords for each platform\n✓ Enable two-factor authentication\n\n**Advanced tips**:\n• Google yourself to see what's public\n• Use privacy-focused browsers like Firefox\n• Be careful with location sharing",
      "Digital privacy is crucial! Here's your action plan:\n\n🛡️ **This Week**:\n- Audit all social media privacy settings\n- Remove old posts with personal info\n- Check app permissions on your phone\n\n🔐 **This Month**:\n- Set up password manager\n- Review connected apps & services\n- Educate family about privacy settings"
    ],
    responsesSw: [
      "Swali zuri kuhusu faragha! Hapa kuna hatua za haraka kwa majukwaa makuu:\n\n🔒 **Faragha ya Facebook**:\n• Mipangilio → Faragha → Weka machapisho ya zamani kwa 'Marafiki'\n• Mipangilio → Profaili → Hakiki kinachoonwa na wengine\n• Mipangilio → Kuzuia → Dhibiti orodha ya waliozuiwa\n\n📸 **Usalama wa Instagram**:\n• Mipangilio → Faragha → Akaunti ya faragha (WASHA)\n• Mipangilio → Faragha → Vidhibiti vya hadithi\n• Mipangilio → Usalama → Uthibitishaji wa hatua mbili\n\n💬 **Usalama wa WhatsApp**:\n• Mipangilio → Akaunti → Faragha → Mwisho kuonekana, Picha ya wasifu\n• Mipangilio → Faragha → Vikundi → 'Anwani zangu'\n• Mipangilio → Usalama → Onyesha arifa za usalama",
      "Nikusaidie kulinda uwepo wako wa kidijitali:\n\n**Orodha ya haraka ya faragha**:\n✓ Weka mitandao yote ya kijamii kuwa ya faragha\n✓ Hakiki picha na machapisho yaliyowekwa alama\n✓ Ondoa maelezo ya kibinafsi kwenye wasifu wa umma\n✓ Tumia nywila tofauti kwa kila jukwaa\n✓ Wezesha uthibitishaji wa hatua mbili\n\n**Vidokezo vya hali ya juu**:\n• Jitafutie kwenye Google ili kuona kinachochapishwa\n• Tumia vivinjari vilivyolenga faragha kama Firefox\n• Kuwa mwangalifu na kugawana eneo",
      "Faragha ya kidijitali ni muhimu! Hapa kuna mpango wako wa hatua:\n\n🛡️ **Wiki Hii**:\n- Hakiki mipangilio yote ya faragha ya mitandao ya kijamii\n- Ondoa machapisho ya zamani yaliyo na maelezo ya kibinafsi\n- Hakiki idhini za programu kwenye simu yako\n\n🔐 **Mwezi Huu**:\n- Weka msimamizi wa nywila\n- Hakiki programu na huduma zilizounganishwa\n- Wafundishe familia kuhusu mipangilio ya faragha"
    ]
  },
  scared: {
    responses: [
      "I hear you, and your feelings are completely valid. 💜\n\nYou're taking the right step by seeking help. Remember:\n\n• **You are not alone** - many people face similar situations\n• **It's not your fault** - harassers are responsible for their actions\n• **Help is available 24/7** - call 1195 (GBV Hotline), it's free and confidential\n\n**Immediate safety steps**:\n1. If you feel in immediate danger, leave the area\n2. Contact someone you trust\n3. Call 1195 for professional support\n\nWould you like me to guide you through documenting what's happening?",
      "Your safety is the most important thing right now. 💜\n\n**If you're in immediate danger**:\n🚨 Call 999 (Emergency Services)\n🚨 Go to a public place\n🚨 Contact a trusted friend or family member\n\n**For emotional support**:\n💜 GBV Hotline: 1195 (24/7, free)\n💜 Counseling and legal advice available\n\n**Remember**: Trust your instincts - if something feels wrong, it probably is.",
      "I understand this is frightening. Let's focus on your safety:\n\n🏠 **If at home**:\n• Ensure doors and windows are secure\n• Have phone charged and accessible\n• Know your nearest safe location\n\n📞 **Support network**:\n• GBV Hotline: 1195\n• DCI Cybercrime: 0800 723 253\n• FIDA Kenya (Legal): +254 20 271 5808\n\nYou're being very brave by reaching out. Let's work through this together."
    ],
    responsesSw: [
      "Nakusikia, na hisia zako ni halali kabisa. 💜\n\nUnachukua hatua sahihi kutafuta msaada. Kumbuka:\n\n• **Huko peke yako** - watu wengi wanakabiliana na hali kama hizi\n• **Si kosa lako** - wanyanyasaji wanawajibika kwa vitendo vyao\n• **Msaada unapatikana masaa 24** - piga 1195 (GBV Hotline), ni bure na siri\n\n**Hatua za usalama za haraka**:\n1. Ikiwa unajihisi kwenye hatari ya haraka, ondoka eneo hilo\n2. Wasiliana na mtu unaemuamini\n3. Piga 1195 kwa msaada wa kitaalamu\n\nUngependa nikiongoze kwenye kuhifadhi kinachotokea?",
      "Usalama wako ndio jambo muhimu zaidi sasa hivi. 💜\n\n**Ikiwa uko katika hatari ya haraka**:\n🚨 Piga 999 (Huduma za Dharura)\n🚨 Nenda mahali pa umma\n🚨 Wasiliana na rafiki au mtu wa familia unaemuamini\n\n**Kwa msaada wa kihemko**:\n💜 GBV Hotline: 1195 (masaa 24, bure)\n💜 Ushauri na ushauri wa kisheria unapatikana\n\n**Kumbuka**: Amini instinct zako - ikiwa kuna kitu kinahisiwa vibaya, labda ni hivyo.",
      "Naeleua hii inatisha. Tulenge usalama wako:\n\n🏠 **Ikiwa uko nyumbani**:\n• Hakikisha milango na madirisha yamefungwa\n• Weka simu imechajiwa betri na inapatikana\n• Jua eneo lako la karibu salama\n\n📞 **Mtandao wa msaada**:\n• GBV Hotline: 1195\n• DCI Cybercrime: 0800 723 253\n• FIDA Kenya (Kisheria): +254 20 271 5808\n\nUnaonesha ujasiri mkubwa kwa kuwasiliana. Tufanye kazi kwa pamoja kupitia hili."
    ]
  },
  report: {
    responses: [
      "Here's your complete guide to reporting in Kenya:\n\n🚔 **DCI Cybercrime Unit**: 0800 723 253 (toll-free)\n• Specializes in online harassment, threats, and digital crimes\n• Can track anonymous harassers\n• Provides legal guidance\n\n📱 **Platform Reporting**:\n• Use built-in report buttons on all social media\n• Take screenshots as evidence before reporting\n• Follow up if no response within 48 hours\n\n⚖️ **Legal Support**:\n• FIDA Kenya: +254 20 271 5808 (free for women)\n• Legal advice and representation\n• Understanding your rights under the Computer Misuse Act\n\n📋 **Evidence Collection**:\n• Screenshots with dates and URLs\n• Save all messages and emails\n• Record times and patterns of harassment",
      "Reporting digital harassment in Kenya - step by step:\n\n**Step 1: Document Everything**\n• Screenshot all messages, posts, and comments\n• Note dates, times, and usernames\n• Save URLs and profile links\n\n**Step 2: Platform Reporting**\n• Report through the platform's official channels\n• Use 'harassment' or 'threatening behavior' categories\n• Keep records of your reports\n\n**Step 3: Legal Reporting**\n• DCI Cybercrime: 0800 723 253\n• Provide all collected evidence\n• Ask for a case number for follow-up\n\n**Remember**: The Computer Misuse and Cybercrimes Act 2018 protects you!",
      "You have legal rights and support available:\n\n🛡️ **Immediate Actions**:\n1. **Preserve evidence** - don't delete anything\n2. **Platform report** - use official reporting tools\n3. **Legal report** - contact DCI Cybercrime\n4. **Get support** - call 1195 for counseling\n\n⚖️ **Your Legal Rights**:\n• Online harassment is a criminal offense\n• You have the right to privacy and safety\n• The law protects you from cyberstalking\n• You can get protection orders if needed\n\n💪 **You're not alone in this** - help is available every step of the way."
    ],
    responsesSw: [
      "Hapa kuna mwongozo wako kamili wa kuripoti Kenya:\n\n🚔 **DCI Cybercrime Unit**: 0800 723 253 (bure)\n• Mtaalamu wa unyanyasaji mtandaoni, vitisho, na jinai za kidijitali\n• Anaweza kufuatilia wanyanyasaji wasiojulikana\n• Hutoa mwongozo wa kisheria\n\n📱 **Ripoti ya Jukwaa**:\n• Tumia vitufe vya kuripoti kwenye mitandao yote ya kijamii\n• Piga picha za skrini kama ushahidi kabla ya kuripoti\n• Fuatilia ikiwa hakuna majibu ndani ya masaa 48\n\n⚖️ **Msaada wa Kisheria**:\n• FIDA Kenya: +254 20 271 5808 (bure kwa wanawake)\n• Ushauri wa kisheria na uwakilishi\n• Kuelewa haki zako chini ya Sheria ya Matumizi Mabaya ya Kompyuta\n\n📋 **Ukusanyaji wa Ushahidi**:\n• Picha za skrini zikiwa na tarehe na URL\n• Hifadhi ujumbe wote na barua pepe\n• Rekodi nyakati na muundo wa unyanyasaji",
      "Kuripoti unyanyasaji wa kidijitali Kenya - hatua kwa hatua:\n\n**Hatua ya 1: Hifadhi Kila Kitu**\n• Piga picha za skrini za ujumbe wote, machapisho, na maoni\n• Andika tarehe, nyakati, na majina ya watumiaji\n• Hifadhi URL na viungo vya wasifu\n\n**Hatua ya 2: Ripoti ya Jukwaa**\n• Ripoti kupitia njia rasmi za jukwaa\n• Tumia jamii za 'unyanyasaji' au 'tabia ya kutishia'\n• Weka kumbukumbu za ripoti zako\n\n**Hatua ya 3: Ripoti ya Kisheria**\n• DCI Cybercrime: 0800 723 253\n• Toa ushahidi wote uliokusanywa\n• Omba nambari ya kesi kwa ufuatiliaji\n\n**Kumbuka**: Sheria ya Matumizi Mabaya ya Kompyuta na Cybercrimes 2018 inakulinda!",
      "Una haki za kisheria na msaada unapatikana:\n\n🛡️ **Vitendo vya Haraka**:\n1. **Hifadhi ushahidi** - usifute chochote\n2. **Ripoti ya jukwaa** - tumia zana za kuripoti\n3. **Ripoti ya kisheria** - wasiliana na DCI Cybercrime\n4. **Pata msaada** - piga 1195 kwa ushauri\n\n⚖️ **Haki Zako za Kisheria**:\n• Unyanyasaji mtandaoni ni kosa la jinai\n• Una haki ya faragha na usalama\n• Sheria inakulinda dhidi ya kufuatiliwa mtandaoni\n• Unaweza kupata amri za ulinzi ikiwa inahitajika\n\n💪 **Huko peke yako** - msaada unapatikana kila hatua."
    ]
  },
  general: {
    responses: [
      "I'm here to help you with digital safety and online wellbeing. 💜 Whether it's privacy settings, dealing with harassment, or general safety tips, I've got your back. What specific concern would you like to discuss?",
      "Digital safety can feel overwhelming, but you're taking great steps by seeking information. I can help with privacy settings, reporting tools, safety planning, or emotional support. What would be most helpful for you right now?",
      "I understand that navigating online spaces can be challenging. Remember that you have rights and there are systems in place to protect you. How can I assist you with your digital safety concerns today?"
    ],
    responsesSw: [
      "Niko hapa kukusaidia kwa usalama wa kidijitali na ustawi mtandaoni. 💜 Ikiwa ni mipangilio ya faragha, kukabiliana na unyanyasaji, au vidokezo vya usalama kwa ujumla, niko nyuma yako. Je, ni wasiwasi gani maalum ungependa kujadili?",
      "Usalama wa kidijitali unaweza kusikika kuwa wa kuzidi, lakini unachukua hatua nzuri kwa kutafuta taarifa. Ninaweza kusaidia kwa mipangilio ya faragha, zana za kuripoti, upangaji usalama, au msaada wa kihemko. Je, ni nini kingekuwa muhimu zaidi kwako sasa hivi?",
      "Naeleua kuwa usafiri wa nafasi za mtandaoni unaweza kuwa changamoto. Kumbuka kuwa una haki na kuna mifumo iliyowekwa ili kukulinda. Je, nawezaje kukusaidia kuhusu wasiwasi wako wa usalama wa kidijitali leo?"
    ]
  }
}

const QUICK_ACTIONS = [
  { text: "I'm being harassed", textSw: "Ninanyanyaswa", topic: 'harassment' },
  { text: "Privacy settings help", textSw: "Msaada wa mipangilio", topic: 'privacy' },
  { text: "I feel scared/unsafe", textSw: "Ninaogopa/sijisikii salama", topic: 'scared' },
  { text: "How to report someone", textSw: "Namrudishia mtu vipi", topic: 'report' },
]

function AICompanion({ isOpen, onClose, showSwahili = false }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: showSwahili 
        ? "Jambo! Mimi ni Msaidizi wako wa Usalama wa Kidijitali. 💜 Niko hapa kukusaidia kwa usalama mtandaoni, mipangilio ya faragha, na kukabiliana na unyanyasaji. Unaweza kuniambia chochote."
        : "Hello! I'm your Digital Safety Companion. 💜 I'm here to support you with online safety, privacy settings, and dealing with harassment. What's on your mind?",
      timestamp: new Date(),
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [aiMode, setAiMode] = useState(false) // Simple toggle for future AI integration
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) 
  }, [messages])
  
  useEffect(() => { 
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100) 
  }, [isOpen])

  // --- ENHANCED OFFLINE RESPONSE GENERATOR ---
  const getEnhancedResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced topic detection with more patterns
    const topicPatterns = {
      greeting: ['hello', 'hi', 'hey', 'jambo', 'mambo', 'habari', 'niaje', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo'],
      harassment: ['harass', 'bully', 'threat', 'abuse', 'stalk', 'unyanyasaji', 'vitisho', 'annoy', 'bother', 'toxic', 'mean', 'nasty', 'hate', 'attack'],
      privacy: ['privacy', 'private', 'settings', 'faragha', 'mipangilio', 'secure', 'protect', 'hide', 'ficha', 'password', 'account', 'profile', 'security'],
      scared: ['scared', 'afraid', 'fear', 'anxious', 'worried', 'naogopa', 'wasiwasi', 'help me', 'emergency', 'danger', 'unsafe', 'threaten', 'panic'],
      report: ['report', 'police', 'dci', 'legal', 'law', 'ripoti', 'polisi', 'sheria', 'sue', 'case', 'complaint', 'authorities', 'cybercrime'],
      social: ['facebook', 'instagram', 'whatsapp', 'twitter', 'tiktok', 'social media', 'account', 'profile', 'post', 'message', 'dm', 'direct message'],
      general: ['help', 'msaada', 'advice', 'ushauri', 'how', 'what', 'where', 'when', 'why', 'can you', 'tell me', 'explain', 'information']
    };

    // Calculate message similarity score for each topic
    const topicScores = {};
    Object.entries(topicPatterns).forEach(([topic, patterns]) => {
      topicScores[topic] = patterns.reduce((score, pattern) => {
        return score + (lowerMessage.includes(pattern) ? 1 : 0);
      }, 0);
    });

    // Find the topic with highest score
    const bestTopic = Object.keys(topicScores).reduce((best, current) => {
      return topicScores[current] > topicScores[best] ? current : best;
    }, 'general');

    // Get appropriate responses
    const responses = showSwahili 
      ? COMPANION_RESPONSES[bestTopic]?.responsesSw || COMPANION_RESPONSES.general.responsesSw
      : COMPANION_RESPONSES[bestTopic]?.responses || COMPANION_RESPONSES.general.responses;

    // Return random response from the selected topic
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // --- HANDLE SEND ---
  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || inputText.trim();
    if (!textToSend) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Natural typing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const responseText = getEnhancedResponse(textToSend);

    const assistantMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      text: responseText,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  }

  const handleQuickAction = (topic) => {
    const action = QUICK_ACTIONS.find(a => a.topic === topic);
    const text = showSwahili ? action.textSw : action.text;
    handleSend(text);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'assistant',
        text: showSwahili 
          ? "Mazungumzo yamefutwa. 💜 Niko hapa tena kukusaidia kwa usalama wako wa kidijitali."
          : "Chat cleared. 💜 I'm here to help you with your digital safety again.",
        timestamp: new Date(),
      }
    ]);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col 
                   max-h-[80vh] sm:max-h-[600px] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-light-lilac bg-gradient-to-r from-deep-purple to-deep-purple/80 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xl">💜</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {showSwahili ? 'Msaidizi wa Usalama' : 'Safety Companion'}
              </h3>
              <p className="text-xs text-white/70">
                {isTyping 
                  ? (showSwahili ? 'Inaandika...' : 'Typing...') 
                  : (showSwahili ? 'Imekaa Salama' : 'Safe & Secure')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiMode(!aiMode)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                aiMode 
                  ? 'bg-green-400/30 text-green-100' 
                  : 'bg-blue-400/30 text-blue-100'
              }`}
              title={aiMode ? 'Enhanced Mode' : 'Standard Mode'}
            >
              {aiMode ? '🚀' : '💜'} {aiMode ? 'Enhanced' : 'Standard'}
            </button>
            <button
              onClick={handleClearChat}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center
                         text-white hover:bg-white/30 transition-colors text-sm"
              title={showSwahili ? "Futa mazungumzo" : "Clear chat"}
            >
              🗑️
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center
                         text-white hover:bg-white/30 transition-colors"
              title={showSwahili ? "Funga" : "Close"}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-soft-cream/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-deep-purple text-white rounded-br-md'
                    : 'bg-white text-charcoal shadow-soft rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">
                  {message.text.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </p>
                <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/60' : 'text-charcoal/40'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-charcoal shadow-soft rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-deep-purple/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-deep-purple/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-deep-purple/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-light-lilac bg-white">
            <p className="text-xs text-charcoal/60 mb-2">
              {showSwahili ? 'Hatua za Haraka:' : 'Quick Actions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.topic)}
                  className="px-3 py-1.5 text-xs bg-light-lilac text-deep-purple rounded-full
                             hover:bg-deep-purple hover:text-white transition-colors"
                >
                  {showSwahili ? action.textSw : action.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-light-lilac bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={showSwahili ? "Andika hapa..." : "Type here..."}
              className="flex-1 px-4 py-2 rounded-full border-2 border-light-lilac
                         focus:border-deep-purple focus:outline-none text-sm"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-sunrise-orange text-white
                         flex items-center justify-center hover:bg-sunrise-orange/90
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-charcoal/40 text-center mt-2">
            🔒 {showSwahili ? 'Mazungumzo yanabaki kwenye kifaa chako' : 'Conversations stay on your device'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AICompanion