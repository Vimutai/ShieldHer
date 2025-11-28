/**
 * ResponseAssistant Component
 * Analyzes harassment messages and generates 4 response templates
 * ENHANCED: Kenya-specific legal references, Swahili support, blurred preview
 */
import { useState, useRef } from 'react'
import { analyzeMessage, generateResponses } from '../utils/messageAnalyzer'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

function ResponseAssistant() {
  const [inputMessage, setInputMessage] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [blurredMode, setBlurredMode] = useState(true)
  const [revealedIndex, setRevealedIndex] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [showSwahili, setShowSwahili] = useState(false)
  const [attachedScreenshots, setAttachedScreenshots] = useState([])
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)
  const responsesRef = useRef(null)

  // Handle screenshot upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const maxFiles = 5
    const maxSize = 5 * 1024 * 1024 // 5MB per file

    files.forEach(file => {
      if (attachedScreenshots.length >= maxFiles) {
        alert(showSwahili 
          ? `Upeo wa picha ${maxFiles} tu`
          : `Maximum ${maxFiles} screenshots allowed`)
        return
      }

      if (file.size > maxSize) {
        alert(showSwahili
          ? 'Faili ni kubwa sana. Upeo ni 5MB.'
          : 'File too large. Maximum size is 5MB.')
        return
      }

      if (!file.type.startsWith('image/')) {
        alert(showSwahili
          ? 'Tafadhali pakia picha tu (PNG, JPG, etc.)'
          : 'Please upload images only (PNG, JPG, etc.)')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const newScreenshot = {
          id: Date.now() + Math.random(),
          name: file.name,
          data: e.target.result,
          timestamp: new Date().toISOString(),
        }
        setAttachedScreenshots(prev => [...prev, newScreenshot])
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    event.target.value = ''
  }

  // Remove a screenshot
  const removeScreenshot = (id) => {
    setAttachedScreenshots(prev => prev.filter(s => s.id !== id))
  }

  // Open image preview
  const openPreview = (screenshot) => {
    setPreviewImage(screenshot)
  }

  // Close image preview
  const closePreview = () => {
    setPreviewImage(null)
  }

  // Handle message analysis
  const handleAnalyze = async () => {
    if (!inputMessage.trim()) return

    setIsLoading(true)
    setAnalysis(null)

    // Simulate slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      // Use local keyword analyzer (no API needed)
      const result = analyzeMessage(inputMessage)
      const responses = generateResponses(inputMessage, result)
      
      setAnalysis({
        severity: result.severity,
        categories: result.categories,
        applicableLaws: result.applicableLaws || [],
        responses,
      })
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Copy response to clipboard
  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  // Temporarily reveal a blurred response
  const handleReveal = (index) => {
    setRevealedIndex(index)
    // Auto-blur after 5 seconds
    setTimeout(() => {
      setRevealedIndex(null)
    }, 5000)
  }

  // Export responses as PDF with watermark and screenshots
  const handleExportPDF = async () => {
    if (!responsesRef.current) return

    try {
      // Temporarily reveal all for screenshot
      const wasBlurred = blurredMode
      setBlurredMode(false)
      
      await new Promise(resolve => setTimeout(resolve, 100))

      const canvas = await html2canvas(responsesRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F7F4ED',
      })

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 210
      const pageHeight = 297
      const margin = 10
      const contentWidth = pageWidth - (margin * 2)

      // Helper function to add watermark to a page
      const addWatermark = () => {
        pdf.setTextColor(75, 46, 131)
        pdf.setFontSize(40)
        pdf.setGState(new pdf.GState({ opacity: 0.1 }))
        for (let y = 0; y < pageHeight; y += 50) {
          pdf.text('PRIVATE - DO NOT SHARE', margin, y, { angle: 45 })
        }
        pdf.setGState(new pdf.GState({ opacity: 1 }))
      }

      // Page 1: Header and Response Templates
      addWatermark()

      // Add header
      pdf.setFontSize(16)
      pdf.setTextColor(75, 46, 131)
      pdf.text('Digital Footprint Shield - Incident Report', margin, 15)
      
      pdf.setFontSize(10)
      pdf.setTextColor(26, 26, 26)
      pdf.text(`Generated: ${new Date().toLocaleDateString('en-KE')} at ${new Date().toLocaleTimeString('en-KE')}`, margin, 22)
      pdf.text('Kenya Legal Reference: Computer Misuse and Cybercrimes Act 2018', margin, 28)

      // Add severity and analysis info if available
      if (analysis) {
        pdf.setFontSize(10)
        pdf.setTextColor(75, 46, 131)
        pdf.text(`Severity: ${analysis.severity.toUpperCase()}`, margin, 36)
        pdf.text(`Categories: ${analysis.categories.join(', ')}`, margin, 42)
      }

      // Add response templates image
      const imgWidth = contentWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, 50, imgWidth, Math.min(imgHeight, 200))

      // Add footer
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      pdf.text('Kenya Emergency: DCI Cybercrime 0800 723 253 | GBV Hotline 1195 | Police 999', margin, pageHeight - 10)
      pdf.text(`Page 1 of ${1 + Math.ceil(attachedScreenshots.length / 2)}`, pageWidth - 25, pageHeight - 10)

      // Add screenshots on subsequent pages (2 per page)
      if (attachedScreenshots.length > 0) {
        let screenshotIndex = 0
        
        while (screenshotIndex < attachedScreenshots.length) {
          pdf.addPage()
          addWatermark()

          // Page header
          pdf.setFontSize(14)
          pdf.setTextColor(75, 46, 131)
          pdf.text('Evidence Screenshots', margin, 15)
          
          pdf.setFontSize(9)
          pdf.setTextColor(100, 100, 100)
          pdf.text('These screenshots were attached as evidence of the incident.', margin, 22)

          // Add up to 2 screenshots per page
          for (let i = 0; i < 2 && screenshotIndex < attachedScreenshots.length; i++) {
            const screenshot = attachedScreenshots[screenshotIndex]
            const yPos = 30 + (i * 130)
            
            // Screenshot label
            pdf.setFontSize(9)
            pdf.setTextColor(26, 26, 26)
            pdf.text(`Screenshot ${screenshotIndex + 1}: ${screenshot.name}`, margin, yPos)
            pdf.setTextColor(100, 100, 100)
            pdf.text(`Captured: ${new Date(screenshot.timestamp).toLocaleString('en-KE')}`, margin, yPos + 5)

            // Add screenshot image
            try {
              const img = new Image()
              img.src = screenshot.data
              
              // Calculate dimensions to fit
              const maxWidth = contentWidth
              const maxHeight = 115
              let imgW = maxWidth
              let imgH = (img.height / img.width) * imgW
              
              if (imgH > maxHeight) {
                imgH = maxHeight
                imgW = (img.width / img.height) * imgH
              }

              pdf.addImage(screenshot.data, 'JPEG', margin, yPos + 8, imgW, imgH)
            } catch (imgErr) {
              pdf.setTextColor(200, 100, 100)
              pdf.text('[Image could not be added]', margin, yPos + 20)
            }

            screenshotIndex++
          }

          // Page footer
          pdf.setFontSize(8)
          pdf.setTextColor(100, 100, 100)
          pdf.text('CONFIDENTIAL - For legal/reporting purposes only', margin, pageHeight - 10)
          pdf.text(`Page ${pdf.internal.getCurrentPageInfo().pageNumber} of ${1 + Math.ceil(attachedScreenshots.length / 2)}`, pageWidth - 25, pageHeight - 10)
        }
      }

      // Save
      const filename = `incident-report-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(filename)

      // Restore blur state
      if (wasBlurred) setBlurredMode(true)

    } catch (err) {
      console.error('PDF export error:', err)
      alert(showSwahili 
        ? 'Haikuweza kutengeneza PDF. Tafadhali jaribu tena.'
        : 'Could not export PDF. Please try again.')
    }
  }

  // Severity indicator colors and messages
  const severityConfig = {
    low: { 
      bg: 'bg-green-100', 
      text: 'text-green-700', 
      label: 'Low Severity',
      labelSw: 'Ukali wa Chini',
    },
    medium: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-700', 
      label: 'Medium Severity',
      labelSw: 'Ukali wa Wastani',
    },
    high: { 
      bg: 'bg-orange-100', 
      text: 'text-orange-700', 
      label: 'High Severity',
      labelSw: 'Ukali wa Juu',
    },
    severe: { 
      bg: 'bg-red-100', 
      text: 'text-red-700', 
      label: 'Severe - Consider Reporting',
      labelSw: 'Mkali Sana - Fikiria Kuripoti',
    },
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-deep-purple mb-2">
          {showSwahili ? 'Msaidizi wa Majibu' : 'Response Assistant'}
        </h2>
        <p className="text-charcoal/70">
          {showSwahili 
            ? 'Bandika ujumbe wa unyanyasaji hapa chini na upate violezo 4 vya majibu.'
            : 'Paste a harassment message below and get 4 response templates.'}
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

      {/* Input section */}
      <div className="card">
        <label className="block text-sm font-semibold text-charcoal mb-2">
          {showSwahili ? 'Bandika ujumbe uliopokea:' : 'Paste the message you received:'}
        </label>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={showSwahili 
            ? "Bandika ujumbe wa unyanyasaji au vitisho hapa..."
            : "Paste the harassment or threatening message here..."}
          className="textarea-field h-32"
        />

        {/* Screenshot Upload Section */}
        <div className="mt-4 p-4 border-2 border-dashed border-light-lilac rounded-xl bg-light-lilac/10">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-charcoal flex items-center gap-2">
              📸 {showSwahili ? 'Ambatanisha Picha za Skrini (Ushahidi)' : 'Attach Screenshots (Evidence)'}
              <span className="text-xs text-charcoal/50">
                ({attachedScreenshots.length}/5)
              </span>
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={attachedScreenshots.length >= 5}
              className="px-3 py-1.5 bg-deep-purple text-white text-sm rounded-lg
                         hover:bg-deep-purple/90 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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

          {/* Attached Screenshots Preview */}
          {attachedScreenshots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {attachedScreenshots.map((screenshot) => (
                <div key={screenshot.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => openPreview(screenshot)}
                    className="w-full aspect-square rounded-lg overflow-hidden border-2 border-light-lilac
                               hover:border-deep-purple transition-all"
                  >
                    <img
                      src={screenshot.data}
                      alt={screenshot.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeScreenshot(screenshot.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full
                               flex items-center justify-center text-xs font-bold
                               opacity-0 group-hover:opacity-100 transition-opacity
                               hover:bg-red-600"
                    title={showSwahili ? 'Ondoa' : 'Remove'}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-charcoal/50">
                {showSwahili 
                  ? 'Bonyeza "Ongeza" kupakia picha za skrini za ujumbe wa unyanyasaji'
                  : 'Click "Add" to upload screenshots of harassment messages'}
              </p>
              <p className="text-xs text-charcoal/40 mt-1">
                PNG, JPG • Max 5MB {showSwahili ? 'kwa faili' : 'per file'}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={!inputMessage.trim() || isLoading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {showSwahili ? 'Inachambua...' : 'Analyzing...'}
              </span>
            ) : (
              showSwahili ? '🔍 Tengeneza Majibu' : '🔍 Generate Responses'
            )}
          </button>
          
          <button
            onClick={() => {
              setInputMessage('')
              setAttachedScreenshots([])
            }}
            className="btn-secondary"
            disabled={!inputMessage && attachedScreenshots.length === 0}
          >
            {showSwahili ? 'Futa Yote' : 'Clear All'}
          </button>
        </div>

        {/* Privacy note */}
        <p className="text-xs text-charcoal/50 mt-3 text-center">
          🔒 {showSwahili 
            ? 'Uchambuzi na picha zinabaki kwenye kifaa chako. Hakuna kinachotumwa kwa seva.'
            : 'Analysis and images stay on your device. Nothing is sent to any server.'}
        </p>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={closePreview}
              className="absolute -top-10 right-0 text-white hover:text-sunrise-orange transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={previewImage.data}
              alt={previewImage.name}
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-center text-white/70 text-sm mt-2">
              {previewImage.name} • {new Date(previewImage.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Results section */}
      {analysis && (
        <div className="space-y-4">
          {/* Severity indicator */}
          <div className={`card ${severityConfig[analysis.severity].bg}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {analysis.severity === 'severe' ? '🚨' : 
                 analysis.severity === 'high' ? '⚠️' :
                 analysis.severity === 'medium' ? '⚡' : 'ℹ️'}
              </span>
              <div>
                <p className={`font-semibold ${severityConfig[analysis.severity].text}`}>
                  {showSwahili 
                    ? severityConfig[analysis.severity].labelSw 
                    : severityConfig[analysis.severity].label}
                </p>
                <p className="text-sm text-charcoal/70">
                  {showSwahili ? 'Imegunduliwa' : 'Detected'}: {analysis.categories.join(', ')}
                </p>
              </div>
            </div>
            
            {/* Kenya Legal Information */}
            {analysis.applicableLaws && analysis.applicableLaws.length > 0 && (
              <div className="mt-3 p-3 bg-white/50 rounded-lg">
                <p className="text-sm font-semibold text-charcoal mb-2">
                  🇰🇪 {showSwahili ? 'Sheria za Kenya Zinazohusika:' : 'Applicable Kenya Laws:'}
                </p>
                <ul className="text-sm text-charcoal/80 space-y-1">
                  {analysis.applicableLaws.map((law, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-deep-purple">⚖️</span>
                      <span><strong>{law.name}</strong> - {law.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.severity === 'severe' && (
              <div className="mt-3 p-3 bg-white/50 rounded-lg border-l-4 border-red-500">
                <p className="text-sm text-red-700">
                  <strong>⚠️ {showSwahili ? 'Muhimu' : 'Important'}:</strong>{' '}
                  {showSwahili 
                    ? 'Ujumbe huu unaweza kuwa na vitisho. Fikiria kuripoti kwa DCI (0800 723 253) au piga simu 1195 kwa msaada.'
                    : 'This message may contain serious threats. Consider reporting to DCI Cybercrime Unit (0800 723 253) or call 1195 for support.'}
                </p>
              </div>
            )}
          </div>

          {/* Kenya Emergency Quick Actions */}
          <div className="flex flex-wrap gap-2 justify-center">
            <a 
              href="tel:0800723253" 
              className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium
                         hover:bg-red-200 transition-colors flex items-center gap-2"
            >
              📞 DCI Cybercrime
            </a>
            <a 
              href="tel:1195" 
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium
                         hover:bg-purple-200 transition-colors flex items-center gap-2"
            >
              💜 GBV Hotline 1195
            </a>
            <a 
              href="tel:999" 
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium
                         hover:bg-orange-200 transition-colors flex items-center gap-2"
            >
              🚨 Emergency 999
            </a>
          </div>

          {/* Blur toggle */}
          <div className="flex items-center justify-between p-3 bg-light-lilac/50 rounded-xl">
            <span className="text-sm text-charcoal/70">
              🛡️ {showSwahili ? 'Hali ya kuficha (kuzuia picha za skrini)' : 'Blurred preview (anti-screenshot)'}
            </span>
            <button
              onClick={() => setBlurredMode(!blurredMode)}
              className={`relative w-12 h-6 rounded-full transition-colors
                ${blurredMode ? 'bg-deep-purple' : 'bg-charcoal/30'}`}
            >
              <span 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                  ${blurredMode ? 'left-7' : 'left-1'}`}
              />
            </button>
          </div>

          {/* Response templates */}
          <div ref={responsesRef} className="space-y-4">
            {analysis.responses.map((response, index) => (
              <ResponseCard
                key={index}
                response={response}
                index={index}
                isBlurred={blurredMode && revealedIndex !== index}
                onReveal={() => handleReveal(index)}
                onCopy={() => handleCopy(
                  showSwahili && response.textSw ? response.textSw : response.text, 
                  index
                )}
                isCopied={copiedIndex === index}
                showSwahili={showSwahili}
              />
            ))}
          </div>

          {/* Export button */}
          <div className="flex flex-col items-center gap-3">
            {attachedScreenshots.length > 0 && (
              <p className="text-sm text-charcoal/60 flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {attachedScreenshots.length} {showSwahili ? 'picha za skrini zitajumuishwa' : 'screenshot(s) will be included'}
              </p>
            )}
            <button onClick={handleExportPDF} className="btn-secondary flex items-center gap-2">
              📄 {showSwahili ? 'Hamisha Ripoti ya PDF' : 'Export PDF Report'}
              {attachedScreenshots.length > 0 && (
                <span className="px-2 py-0.5 bg-deep-purple/20 rounded-full text-xs">
                  +{attachedScreenshots.length} 📸
                </span>
              )}
            </button>
          </div>

          {/* Screenshot protection notice */}
          <div className="text-center text-xs text-charcoal/50">
            <p>
              ⚠️ {showSwahili 
                ? 'PDF zilizohifadhiwa zina alama ya "Private - Do Not Share".'
                : 'Exported PDFs include a "Private - Do Not Share" watermark.'}
            </p>
            <p className="mt-1">
              {showSwahili 
                ? 'Kumbuka: Ulinzi wa picha za skrini ni kuzuia, si dhamana.'
                : 'Note: Screenshot protection is a deterrent, not a guarantee.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Individual Response Card Component
 */
function ResponseCard({ response, index, isBlurred, onReveal, onCopy, isCopied, showSwahili }) {
  const typeStyles = {
    calm: { 
      icon: '🕊️', 
      color: 'border-blue-200 bg-blue-50',
      label: 'Calm Response',
      labelSw: 'Jibu la Utulivu',
    },
    legal: { 
      icon: '⚖️', 
      color: 'border-purple-200 bg-purple-50',
      label: 'Legal Response (Kenya)',
      labelSw: 'Jibu la Kisheria (Kenya)',
    },
    supportive: { 
      icon: '💜', 
      color: 'border-pink-200 bg-pink-50',
      label: 'Supportive Response',
      labelSw: 'Jibu la Kusaidia',
    },
    report: { 
      icon: '📋', 
      color: 'border-orange-200 bg-orange-50',
      label: 'Report Template',
      labelSw: 'Kiolezo cha Ripoti',
    },
  }

  const style = typeStyles[response.type] || typeStyles.calm
  const displayText = showSwahili && response.textSw ? response.textSw : response.text
  const displayNote = showSwahili && response.noteSw ? response.noteSw : response.note

  return (
    <div className={`card border-2 ${style.color} relative overflow-hidden`}>
      {/* Watermark overlay (visible when not blurred) */}
      {!isBlurred && (
        <div className="watermark-overlay">
          Private — Do not share
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{style.icon}</span>
          <h4 className="font-semibold text-charcoal">
            {showSwahili ? style.labelSw : style.label}
          </h4>
        </div>
        <span className="text-xs text-charcoal/50">
          {showSwahili ? `Kiolezo ${index + 1}` : `Template ${index + 1}`}
        </span>
      </div>

      {/* Response text */}
      <div className="relative">
        <p className={`text-charcoal/80 leading-relaxed transition-all duration-300 whitespace-pre-line
          ${isBlurred ? 'blurred-preview' : ''}`}>
          {displayText}
        </p>

        {/* Reveal button overlay (when blurred) */}
        {isBlurred && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={onReveal}
              className="px-4 py-2 bg-deep-purple text-white rounded-xl 
                         shadow-medium hover:shadow-glow transition-all"
            >
              👁️ {showSwahili ? 'Onyesha kwa sekunde 5' : 'Reveal for 5 seconds'}
            </button>
          </div>
        )}
      </div>

      {/* Usage note */}
      <p className="text-xs text-charcoal/50 mt-3 italic">
        {displayNote}
      </p>

      {/* Copy button */}
      <button
        onClick={onCopy}
        disabled={isBlurred}
        className={`mt-3 w-full py-2 rounded-xl text-sm font-medium transition-all
          ${isCopied 
            ? 'bg-green-500 text-white' 
            : 'bg-light-lilac text-deep-purple hover:bg-deep-purple hover:text-white'}
          ${isBlurred ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isCopied 
          ? (showSwahili ? '✓ Imenakiliwa!' : '✓ Copied!') 
          : (showSwahili ? '📋 Nakili kwenye Clipboard' : '📋 Copy to Clipboard')}
      </button>
    </div>
  )
}

export default ResponseAssistant
