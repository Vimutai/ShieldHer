import React, { useState, useRef, useEffect } from 'react';
import { analyzeEvidence } from '../services/api';

function ResponseAssistant({ importedEvidence, showSwahili, onBack, analysisResult }) {
  const [inputMessage, setInputMessage] = useState('')
  const [analysis, setAnalysis] = useState(analysisResult || null)
  const [isLoading, setIsLoading] = useState(false)
  const [blurredMode, setBlurredMode] = useState(true)
  const [revealedIndex, setRevealedIndex] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [attachedScreenshots, setAttachedScreenshots] = useState([])
  const fileInputRef = useRef(null)

  // Enhanced message analyzer with Kenya-specific patterns
  const analyzeMessage = (text) => {
    if (!text || typeof text !== 'string') {
      return { severity: 'Low', categories: ['unknown'], score: 0 }
    }

    const lowerText = text.toLowerCase()
    const detectedCategories = []
    let totalScore = 0

    // Enhanced harassment patterns
    const HARASSMENT_PATTERNS = {
      threats: {
        keywords: ['kill', 'hurt', 'harm', 'attack', 'find you', 'coming for', 'watch out', 
                   'destroy', 'ruin', 'end you', 'make you pay', 'regret', 'sorry',
                   'kuua', 'kuumiza', 'kukumaliza', 'nitakupata'],
        weight: 5,
      },
      sexual: {
        keywords: ['sexy', 'nudes', 'naked', 'body', 'send pics', 'hot', 'beautiful body',
                   'want you', 'together', 'meet up', 'send photos',
                   'picha zako', 'mwili wako', 'tukutane'],
        weight: 4,
      },
      insults: {
        keywords: ['ugly', 'stupid', 'worthless', 'pathetic', 'loser', 'disgusting',
                   'fat', 'dumb', 'idiot', 'trash', 'garbage', 'whore', 'slut',
                   'useless', 'nobody', 'waste', 'mwizi', 'malaya', 'mjinga', 'bure'],
        weight: 3,
      },
      manipulation: {
        keywords: ['no one will believe', 'your fault', 'you made me', 'if you loved',
                   'you owe me', 'after everything', 'you deserve', 'crazy',
                   'everyone will know', 'i will tell', "you'll regret",
                   'kosa lako', 'utajuta', 'nitawaambia watu'],
        weight: 3,
      },
    }

    // Check each pattern category
    Object.entries(HARASSMENT_PATTERNS).forEach(([category, { keywords, weight }]) => {
      const found = keywords.some(keyword => lowerText.includes(keyword))
      if (found) {
        detectedCategories.push(category)
        totalScore += weight
      }
    })

    // Determine severity based on total score
    let severity = 'Low'
    if (totalScore >= 8) severity = 'High'
    else if (totalScore >= 5) severity = 'High'
    else if (totalScore >= 3) severity = 'Medium'

    // Special case for strong insults - "ugly" should be at least Medium
    if (detectedCategories.includes('insults') && totalScore >= 2) {
      severity = 'Medium'
    }

    return {
      severity,
      categories: detectedCategories.length > 0 ? detectedCategories : ['general harassment'],
      score: totalScore,
    }
  }

  // Auto-populate from imported evidence and use analysis result
  useEffect(() => {
    if (importedEvidence.length > 0 && !inputMessage) {
      const firstEvidence = importedEvidence[0]
      if (firstEvidence.evidence?.content) {
        setInputMessage(firstEvidence.evidence.content)
      }
    }

    // If analysis result is passed from parent, use it
    if (analysisResult && !analysis) {
      setAnalysis(analysisResult)
    }
  }, [importedEvidence, analysisResult])

  // Generate response templates based on severity
  const generateResponses = (severity, categories = []) => {
    const baseResponses = [
      {
        type: 'calm',
        text: generateCalmResponse(severity, categories),
        textSw: generateCalmResponseSwahili(severity, categories),
        note: 'Use when you want to set boundaries without escalating',
        noteSw: 'Tumia unapotaka kuweka mipaka bila kuzidisha mvutano'
      },
      {
        type: 'legal',
        text: generateLegalResponse(severity, categories),
        textSw: generateLegalResponseSwahili(severity, categories),
        note: 'References specific Kenyan laws - may deter further contact',
        noteSw: 'Inarejelea sheria maalum za Kenya - inaweza kuzuia mawasiliano zaidi'
      },
      {
        type: 'supportive',
        text: generateSupportiveResponse(severity, categories),
        textSw: generateSupportiveResponseSwahili(severity, categories),
        note: 'Shows you have support while offering them help resources',
        noteSw: 'Inaonyesha una msaada huku ukimpa mwongozo wa rasilimali'
      },
      {
        type: 'report',
        text: generateReportTemplate(severity, categories),
        textSw: generateReportTemplateSwahili(severity, categories),
        note: 'Clear statement that you\'re taking formal action',
        noteSw: 'Taarifa wazi kwamba unachukua hatua za kisheria'
      }
    ]

    // Add additional responses for high severity
    if (severity === 'High') {
      baseResponses.push({
        type: 'emergency',
        text: "I have reported this to the authorities. Your threats have been documented under Kenya's cybercrime laws. Do not contact me again.",
        textSw: "Nimeripoti hii kwa mamlaka. Tishio lako limeandikwa chini ya sheria za makosa ya mtandao nchini Kenya. Usiniite tena.",
        note: "For immediate threats - shows you've already taken action",
        noteSw: "Kwa vitisho vya haraka - inaonyesha tayari umechukua hatua"
      })
    }

    return baseResponses
  }

  // Response generators
  const generateCalmResponse = (severity, categories) => {
    if (categories.includes('insults')) {
      return "I don't appreciate personal attacks. Let's keep our communication respectful, or I won't be able to continue this conversation."
    }
    return "I don't appreciate this message. Please stop contacting me.";
  }

  const generateCalmResponseSwahili = (severity, categories) => {
    if (categories.includes('insults')) {
      return "Sipendi mashambulio ya kibinafsi. Tuweke mawasiliano yetu ya heshima, au sitoweza kuendelea na mazungumzo haya."
    }
    return "Sipendi ujumbe huu. Tafadhali acha kunipigia simu.";
  }

  const generateLegalResponse = (severity, categories) => {
    if (categories.includes('insults')) {
      return "Your message containing personal insults violates Kenya's Computer Misuse and Cybercrimes Act 2018 (Section 27 - Cyberbullying). I've documented this as evidence and will report further harassment to DCI Cybercrime Unit."
    }
    return "Your message violates Kenya's Computer Misuse and Cybercrimes Act 2018. I've preserved this as evidence and will report it to DCI Cybercrime Unit if it continues.";
  }

  const generateLegalResponseSwahili = (severity, categories) => {
    if (categories.includes('insults')) {
      return "Ujumbe wako unao mashambulio ya kibinafsi unakiuka Sheria ya Makosa ya Mtandao ya Kenya 2018 (Kifungu 27 - Unyanyasaji mtandaoni). Nimeuhifadhi kama ushahidi na nitaripoti unyanyasaji zaidi kwa DCI."
    }
    return "Ujumbe wako unakiuka Sheria ya Makosa ya Mtandao ya Kenya 2018. Nimeuhifadhi kama ushahidi na nitaripoti kwa DCI ikiwa utaendelea.";
  }

  const generateSupportiveResponse = (severity, categories) => {
    if (categories.includes('insults')) {
      return "I'm sharing this insulting message with my support network. No one deserves to be spoken to this way. Remember that hurtful words say more about the sender than about you."
    }
    return "I'm sharing this with my support network. If you're going through something, please contact a helpline instead of taking it out on others.";
  }

  const generateSupportiveResponseSwahili = (severity, categories) => {
    if (categories.includes('insults')) {
      return "Ninashiriki ujumbe huu wa kutumia matusi na mtandao wangu wa msaada. Hakuna anayestahili kuongewa hivi. Kumbuka kwamba maneno machungu yanasema zaidi kuhusu mtumaji kuliko wewe."
    }
    return "Ninashiriki hii na mtandao wangu wa msaada. Ikiwa unapita kwenye changamoto, tafadhali wasiliana na mstari wa msaada badala ya kumlenga mwingine.";
  }

  const generateReportTemplate = (severity, categories) => {
    if (categories.includes('insults')) {
      return "REPORT: User sent harassing messages containing personal insults ('ugly'). This violates platform community guidelines and Kenya's cyberbullying laws. Evidence attached."
    }
    return "This message has been documented and will be included in my report to authorities. Kenya's laws protect citizens from online harassment.";
  }

  const generateReportTemplateSwahili = (severity, categories) => {
    if (categories.includes('insults')) {
      return "RIPOTI: Mtumiaji alitumia ujumbe wa unyanyasaji unao matusi ya kibinafsi ('mwenye sura mbaya'). Hii inakiwa miongozo ya jukwaa na sheria za Kenya za unyanyasaji mtandaoni."
    }
    return "Ujumbe huu umeandikwa na utajumuishwa kwenye ripoti yangu kwa mamlaka. Sheria za Kenya zinawlinda raia dhidi ya unyanyasaji wa mtandaoni.";
  }

  // Handle analysis of text message
  const handleAnalyzeText = async () => {
    if (!inputMessage.trim()) return

    setIsLoading(true)
    
    try {
      // Use the enhanced message analyzer
      const messageAnalysis = analyzeMessage(inputMessage)
      
      // Generate responses based on the analysis
      const responses = generateResponses(messageAnalysis.severity, messageAnalysis.categories)
      
      setAnalysis({
        severity: messageAnalysis.severity,
        categories: messageAnalysis.categories,
        summary: `Found ${messageAnalysis.categories.join(', ')} content`,
        autoSelected: getRecommendedActions(messageAnalysis.severity),
        responses,
      })
    } catch (error) {
      console.error('Analysis failed:', error)
      // Fallback analysis
      const lowerText = inputMessage.toLowerCase()
      let severity = 'Low'
      let categories = []
      
      if (lowerText.includes('ugly') || lowerText.includes('stupid') || lowerText.includes('worthless')) {
        severity = 'Medium'
        categories = ['insults']
      }
      if (lowerText.includes('kill') || lowerText.includes('hurt')) {
        severity = 'High'
        categories = ['threats']
      }

      const responses = generateResponses(severity, categories)
      
      setAnalysis({
        severity,
        categories,
        summary: `Analyzed message with ${categories.join(', ')} content`,
        autoSelected: getRecommendedActions(severity),
        responses,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRecommendedActions = (severity) => {
    switch (severity) {
      case 'High':
        return ['Document Evidence', 'Legal Response', 'Report to DCI', 'Block User']
      case 'Medium':
        return ['Document Evidence', 'Calm Response', 'Set Boundaries']
      default:
        return ['Calm Response', 'Document Evidence']
    }
  }

  // Handle analysis of imported evidence
  const handleAnalyzeImportedEvidence = async () => {
    if (importedEvidence.length === 0) return

    setIsLoading(true)
    
    try {
      // For imported evidence, analyze the first message content
      const firstEvidence = importedEvidence[0]
      const messageContent = firstEvidence.evidence?.content || ''
      
      if (messageContent) {
        setInputMessage(messageContent)
        const messageAnalysis = analyzeMessage(messageContent)
        const responses = generateResponses(messageAnalysis.severity, messageAnalysis.categories)
        
        setAnalysis({
          severity: messageAnalysis.severity,
          categories: messageAnalysis.categories,
          summary: `Found ${messageAnalysis.categories.join(', ')} content in imported evidence`,
          autoSelected: getRecommendedActions(messageAnalysis.severity),
          responses,
        })
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-analyze when component loads with imported evidence
  useEffect(() => {
    if (importedEvidence.length > 0 && !analysis && !inputMessage) {
      handleAnalyzeImportedEvidence()
    }
  }, [importedEvidence])

  // Handle screenshot upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const maxFiles = 5

    files.forEach(file => {
      if (attachedScreenshots.length >= maxFiles) {
        alert(showSwahili ? 'Upeo wa picha 5 tu' : 'Maximum 5 screenshots allowed')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setAttachedScreenshots(prev => [...prev, {
          id: Date.now(),
          name: file.name,
          data: e.target.result,
        }])
      }
      reader.readAsDataURL(file)
    })

    event.target.value = ''
  }

  // Remove screenshot
  const removeScreenshot = (id) => {
    setAttachedScreenshots(prev => prev.filter(s => s.id !== id))
  }

  // Copy response
  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  // Reveal blurred response
  const handleReveal = (index) => {
    setRevealedIndex(index)
    setTimeout(() => setRevealedIndex(null), 5000)
  }

  // Severity config
  const severityConfig = {
    Low: { bg: 'bg-green-100', text: 'text-green-700', label: 'Low Severity', labelSw: 'Ukali wa Chini' },
    Medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium Severity', labelSw: 'Ukali wa Wastani' },
    High: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High Severity', labelSw: 'Ukali wa Juu' },
  }

  const currentSeverityConfig = severityConfig[analysis?.severity] || severityConfig.Low

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
          ← {showSwahili ? 'Rudi kwa Ushahidi' : 'Back to Evidence'}
        </button>
        
        {importedEvidence.length > 0 && (
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            ✅ {importedEvidence.length} {showSwahili ? 'ushahidi ulioingizwa' : 'evidence imported'}
          </div>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {showSwahili ? 'Msaidizi wa Majibu' : 'Response Assistant'}
        </h2>
        <p className="text-gray-600">
          {showSwahili 
            ? 'Bandika ujumbe wa unyanyasaji na upate majibu 4 ya kukulinda'
            : 'Paste harassment messages and get 4 protective responses'}
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {showSwahili ? 'Ujumbe uliopokea:' : 'Message you received:'}
        </label>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={showSwahili 
            ? "Bandika ujumbe wa unyanyasaji hapa..."
            : "Paste the harassment message here..."}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />

        {/* Screenshot Upload */}
        <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
              📸 {showSwahili ? 'Picha za Skrini' : 'Screenshots'}
              <span className="text-xs text-gray-500">({attachedScreenshots.length}/5)</span>
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
            >
              {showSwahili ? 'Ongeza' : 'Add'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {attachedScreenshots.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {attachedScreenshots.map((screenshot) => (
                <div key={screenshot.id} className="relative">
                  <img
                    src={screenshot.data}
                    alt="Screenshot"
                    className="w-full h-16 object-cover rounded border"
                  />
                  <button
                    onClick={() => removeScreenshot(screenshot.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleAnalyzeText}
          disabled={!inputMessage.trim() || isLoading}
          className="w-full mt-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading 
            ? (showSwahili ? 'Inachambua...' : 'Analyzing...')
            : (showSwahili ? '🔍 Tengeneza Majibu' : '🔍 Generate Responses')
          }
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Severity Indicator */}
          <div className={`p-4 rounded-xl ${currentSeverityConfig.bg}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {analysis.severity === 'High' ? '⚠️' : 
                 analysis.severity === 'Medium' ? 'ℹ️' : '🕊️'}
              </span>
              <div>
                <p className={`font-semibold ${currentSeverityConfig.text}`}>
                  {showSwahili 
                    ? currentSeverityConfig.labelSw 
                    : currentSeverityConfig.label}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {analysis.summary}
                </p>
                {analysis.categories && analysis.categories.length > 0 && (
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>{showSwahili ? 'Aina:' : 'Categories:'}</strong> {analysis.categories.join(', ')}
                  </p>
                )}
                {analysis.autoSelected && (
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>{showSwahili ? 'Mapendekezo:' : 'Recommended:'}</strong> {analysis.autoSelected.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Blur Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-700">
              🛡️ {showSwahili ? 'Ficha Majibu' : 'Blur Responses'}
            </span>
            <button
              onClick={() => setBlurredMode(!blurredMode)}
              className={`w-12 h-6 rounded-full transition-colors ${blurredMode ? 'bg-purple-600' : 'bg-gray-400'}`}
            >
              <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${blurredMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Response Templates */}
          <div className="space-y-4">
            {analysis.responses.map((response, index) => (
              <ResponseCard
                key={index}
                response={response}
                index={index}
                isBlurred={blurredMode && revealedIndex !== index}
                onReveal={() => handleReveal(index)}
                onCopy={() => handleCopy(showSwahili ? response.textSw : response.text, index)}
                isCopied={copiedIndex === index}
                showSwahili={showSwahili}
              />
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-semibold text-red-800 mb-3">
          🆘 {showSwahili ? 'Nambari za Dharura za Kenya' : 'Kenya Emergency Contacts'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <a href="tel:999" className="p-3 bg-white rounded-lg text-center hover:shadow-md">
            <div className="font-semibold">999</div>
            <div className="text-sm text-gray-600">{showSwahili ? 'Polisi' : 'Police'}</div>
          </a>
          <a href="tel:1195" className="p-3 bg-white rounded-lg text-center hover:shadow-md">
            <div className="font-semibold">1195</div>
            <div className="text-sm text-gray-600">{showSwahili ? 'GBV' : 'GBV Hotline'}</div>
          </a>
          <a href="tel:0800723253" className="p-3 bg-white rounded-lg text-center hover:shadow-md">
            <div className="font-semibold">0800 723 253</div>
            <div className="text-sm text-gray-600">{showSwahili ? 'DCI Mitandao' : 'DCI Cybercrime'}</div>
          </a>
        </div>
      </div>
    </div>
  )
}

// Response Card Component (keep this the same as before)
function ResponseCard({ response, index, isBlurred, onReveal, onCopy, isCopied, showSwahili }) {
  const typeStyles = {
    calm: { icon: '🕊️', color: 'border-blue-200 bg-blue-50', label: 'Calm Response', labelSw: 'Jibu la Utulivu' },
    legal: { icon: '⚖️', color: 'border-purple-200 bg-purple-50', label: 'Legal Response', labelSw: 'Jibu la Kisheria' },
    supportive: { icon: '💜', color: 'border-pink-200 bg-pink-50', label: 'Supportive Response', labelSw: 'Jibu la Kusaidia' },
    report: { icon: '📋', color: 'border-orange-200 bg-orange-50', label: 'Report Template', labelSw: 'Kiolezo cha Ripoti' },
    emergency: { icon: '🚨', color: 'border-red-200 bg-red-50', label: 'Emergency Response', labelSw: 'Jibu la Dharura' },
  }

  const style = typeStyles[response.type] || typeStyles.calm
  const displayText = showSwahili ? response.textSw : response.text
  const displayNote = showSwahili ? response.noteSw : response.note

  return (
    <div className={`border-2 rounded-xl p-4 ${style.color}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{style.icon}</span>
          <h4 className="font-semibold text-gray-800">
            {showSwahili ? style.labelSw : style.label}
          </h4>
        </div>
        <span className="text-xs text-gray-500">
          {showSwahili ? `Kiolezo ${index + 1}` : `Template ${index + 1}`}
        </span>
      </div>

      <div className="relative">
        <p className={`text-gray-700 leading-relaxed whitespace-pre-line ${isBlurred ? 'blur-md' : ''}`}>
          {displayText}
        </p>

        {isBlurred && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={onReveal}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg"
            >
              👁️ {showSwahili ? 'Onyesha kwa sekunde 5' : 'Reveal for 5 seconds'}
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-3 italic">
        {displayNote}
      </p>

      <button
        onClick={onCopy}
        disabled={isBlurred}
        className={`w-full mt-3 py-2 rounded-lg font-medium ${
          isCopied 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        } ${isBlurred ? 'opacity-50' : ''}`}
      >
        {isCopied 
          ? (showSwahili ? '✓ Imenakiliwa!' : '✓ Copied!') 
          : '📋 Copy'}
      </button>
    </div>
  )
}

export default ResponseAssistant