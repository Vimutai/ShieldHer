function Footer({ isSwahili = false }) {
  const currentYear = new Date().getFullYear()
  
  const footerText = {
    en: {
      built: "Built for Kenyan women's safety",
      rights: `© ${currentYear} Footprint Shield. All rights reserved.`,
      emergency: "Emergency: 1195 | 999 | 0800 723 253"
    },
    sw: {
      built: "Imeundwa kwa usalama wa wanawake wa Kenya", 
      rights: `© ${currentYear} Footprint Shield. Haki zote zimehifadhiwa.`,
      emergency: "Dharura: 1195 | 999 | 0800 723 253"
    }
  }

  const text = isSwahili ? footerText.sw : footerText.en

  return (
    <footer className="bg-deep-purple text-white mt-12">
      <div className="container mx-auto px-4 max-w-4xl py-8">
        {/* Emergency Contacts */}
        <div className="text-center mb-6">
          <h3 className="font-semibold mb-3 text-red-300">🆘 {text.emergency}</h3>
          <div className="flex justify-center gap-4 text-sm">
            <a href="tel:1195" className="hover:text-red-300 transition-colors">1195 GBV</a>
            <a href="tel:999" className="hover:text-red-300 transition-colors">999 Police</a>
            <a href="tel:0800723253" className="hover:text-red-300 transition-colors">DCI Cybercrime</a>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center space-y-2">
          <p className="text-white/80 text-sm">{text.built}</p>
          <p className="text-white/60 text-xs">{text.rights}</p>
        </div>

        {/* Quick links */}
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <button className="hover:text-sunrise-orange transition-colors">
            {isSwahili ? 'Msaada' : 'Support'}
          </button>
          <button className="hover:text-sunrise-orange transition-colors">
            {isSwahili ? 'Faragha' : 'Privacy'}
          </button>
          <button className="hover:text-sunrise-orange transition-colors">
            {isSwahili ? 'Masharti' : 'Terms'}
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer