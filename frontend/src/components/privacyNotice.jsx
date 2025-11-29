function PrivacyNotice({ isSwahili = false, variant = "banner" }) {
  const messages = {
    banner: {
      en: "🔒 No account required. Your data stays private in your browser.",
      sw: "🔒 Hakuna hitaji la akaunti. Data yako inabaki faragha kwenye kivinjari chako."
    }
  }

  const message = messages[variant]
  const text = isSwahili ? message.sw : message.en

  return (
    <div className="bg-green-50 border-b border-green-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="py-2 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-green-700 font-medium">
            <span>🔒</span>
            <span>{text}</span>
            <span>🔒</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyNotice