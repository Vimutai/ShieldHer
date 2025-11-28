/**
 * Library Component
 * Safety resources and educational content
 * ENHANCED: Kenya-specific resources and localization
 */
import { useState } from 'react'

// Kenyan emergency contacts - prominent placement
const KENYA_EMERGENCY = {
  title: '🇰🇪 Kenya Emergency Contacts',
  contacts: [
    { name: 'Police Emergency', number: '999 / 112', description: 'National emergency line' },
    { name: 'Gender Violence Hotline', number: '1195', description: 'Free 24/7 GBV support' },
    { name: 'Childline Kenya', number: '116', description: 'Child protection services' },
    { name: 'DCI Cybercrime Unit', number: '+254 800 723 253', description: 'Report cybercrimes' },
  ],
}

// Resource categories with Kenya-first approach
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
      {
        title: 'Coalition on Violence Against Women (COVAW)',
        description: 'Advocacy, safe houses, and psychosocial support',
        phone: '+254 20 260 4531',
        url: 'https://covaw.or.ke',
      },
      {
        title: 'Wangu Kanja Foundation',
        description: 'Survivor support and advocacy',
        url: 'https://wangukanjafoundation.org',
      },
      {
        title: 'Healthcare Assistance Kenya (HAK)',
        description: 'Trauma counseling and legal support',
        phone: '+254 722 178 177',
        url: 'https://healthcareassistancekenya.org',
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
        title: 'Sexual Offences Act (Section 24)',
        description: 'Sharing intimate images without consent is illegal - up to 5 years imprisonment',
        url: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/SexualOffencesAct_No3of2006.pdf',
      },
      {
        title: 'How to Report Cybercrime to DCI',
        description: 'Step-by-step guide to filing a report with the Directorate of Criminal Investigations',
        url: 'https://www.dci.go.ke/report-crime',
      },
      {
        title: 'Kenya National Commission on Human Rights',
        description: 'File complaints about human rights violations',
        phone: '+254 20 271 7908',
        url: 'https://www.knchr.org',
      },
    ],
  },
  {
    category: 'Report to Platforms',
    icon: '📱',
    items: [
      {
        title: 'Report on Facebook/Instagram',
        description: 'Report harassment on Meta platforms',
        url: 'https://www.facebook.com/help/reportlinks',
        swahili: 'Ripoti unyanyasaji Facebook/Instagram',
      },
      {
        title: 'Report on Twitter/X',
        description: 'Report abusive behavior',
        url: 'https://help.twitter.com/en/safety-and-security/report-abusive-behavior',
      },
      {
        title: 'Report on TikTok',
        description: 'Safety center and reporting',
        url: 'https://www.tiktok.com/safety',
      },
      {
        title: 'Report on WhatsApp',
        description: 'Block and report contacts or groups',
        url: 'https://faq.whatsapp.com/1142481766359498',
        swahili: 'Ripoti WhatsApp',
      },
      {
        title: 'Report on Telegram',
        description: 'Report abuse and block users',
        url: 'https://telegram.org/faq#q-how-do-i-report-abuse',
      },
    ],
  },
  {
    category: 'Privacy & Security Tools',
    icon: '🔐',
    items: [
      {
        title: 'Have I Been Pwned',
        description: 'Check if your email was in a data breach',
        url: 'https://haveibeenpwned.com',
        swahili: 'Angalia kama data yako imevuja',
      },
      {
        title: 'Signal Messenger',
        description: 'End-to-end encrypted messaging - safer than SMS',
        url: 'https://signal.org',
      },
      {
        title: 'Google Account Security Checkup',
        description: 'Review and secure your Google account',
        url: 'https://myaccount.google.com/security-checkup',
      },
      {
        title: 'Facebook Privacy Checkup',
        description: 'Control who sees your posts and info',
        url: 'https://www.facebook.com/privacy/checkup',
      },
    ],
  },
  {
    category: 'International Resources',
    icon: '🌍',
    items: [
      {
        title: 'Cyber Civil Rights Initiative',
        description: 'Support for online harassment victims globally',
        url: 'https://cybercivilrights.org',
      },
      {
        title: 'Online Harassment Field Manual',
        description: 'Comprehensive guide from PEN America',
        url: 'https://onlineharassmentfieldmanual.pen.org',
      },
      {
        title: 'Take Back the Tech',
        description: 'African-focused technology safety campaign',
        url: 'https://www.takebackthetech.net',
      },
    ],
  },
]

// Quick tips - Kenya-focused
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

function Library() {
  const [expandedCategory, setExpandedCategory] = useState(0) // Start with Kenya org expanded
  const [searchQuery, setSearchQuery] = useState('')
  const [showSwahili, setShowSwahili] = useState(false)

  // Filter resources based on search
  const filteredResources = RESOURCES.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.swahili && item.swahili.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter(category => category.items.length > 0)

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-deep-purple mb-2">
          {showSwahili ? 'Rasilimali za Usalama' : 'Safety Resources'}
        </h2>
        <p className="text-charcoal/70">
          {showSwahili 
            ? 'Msaada wa dharura, miongozo ya kuripoti, na vidokezo vya usalama.'
            : 'Emergency help, reporting guides, and safety tips for Kenya.'}
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

      {/* Emergency Contacts Banner */}
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

      {/* Quick Tips Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-deep-purple mb-4 flex items-center gap-2">
          <span>💡</span> 
          {showSwahili ? 'Vidokezo vya Haraka' : 'Quick Safety Tips'}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {QUICK_TIPS.map((tip, index) => (
            <div 
              key={index}
              className="p-3 bg-light-lilac/30 rounded-xl"
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

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={showSwahili ? "Tafuta rasilimali..." : "Search resources..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10"
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

      {/* Resource Categories */}
      <div className="space-y-4">
        {filteredResources.map((category, index) => (
          <ResourceCategory
            key={index}
            category={category}
            isExpanded={expandedCategory === index}
            onToggle={() => setExpandedCategory(
              expandedCategory === index ? null : index
            )}
            showSwahili={showSwahili}
          />
        ))}
      </div>

      {/* No results */}
      {filteredResources.length === 0 && searchQuery && (
        <div className="text-center py-8 text-charcoal/50">
          <p>
            {showSwahili 
              ? `Hakuna rasilimali zilizopatikana kwa "${searchQuery}"`
              : `No resources found for "${searchQuery}"`}
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-deep-purple underline mt-2"
          >
            {showSwahili ? 'Futa utafutaji' : 'Clear search'}
          </button>
        </div>
      )}

      {/* Reporting Guide */}
      <ReportingGuide showSwahili={showSwahili} />

      {/* Disclaimer */}
      <div className="text-center text-xs text-charcoal/50 pt-4 border-t border-light-lilac">
        <p>
          {showSwahili 
            ? 'Rasilimali hizi ni za taarifa. Kwa hatari ya haraka, wasiliana na huduma za dharura (999/112).'
            : 'These resources are for information. In immediate danger, contact emergency services (999/112).'}
        </p>
      </div>
    </div>
  )
}

/**
 * Reporting Guide Component - Kenya Specific
 */
function ReportingGuide({ showSwahili }) {
  const [isOpen, setIsOpen] = useState(false)

  const steps = [
    {
      title: showSwahili ? '1. Kusanya Ushahidi' : '1. Gather Evidence',
      content: showSwahili 
        ? 'Piga picha za skrini za ujumbe, wasifu, na tarehe. Usifute chochote.'
        : 'Screenshot messages, profiles, and dates. Do not delete anything.',
    },
    {
      title: showSwahili ? '2. Ripoti kwenye Jukwaa' : '2. Report to Platform',
      content: showSwahili
        ? 'Tumia zana za kuripoti za Facebook, Instagram, Twitter, au WhatsApp.'
        : 'Use the built-in reporting tools on Facebook, Instagram, Twitter, or WhatsApp.',
    },
    {
      title: showSwahili ? '3. Ripoti kwa DCI' : '3. Report to DCI',
      content: showSwahili
        ? 'Piga simu 0800 723 253 au tembelea kituo cha polisi na ushahidi wako.'
        : 'Call 0800 723 253 (toll-free) or visit a police station with your evidence.',
    },
    {
      title: showSwahili ? '4. Tafuta Msaada wa Kisheria' : '4. Seek Legal Help',
      content: showSwahili
        ? 'FIDA Kenya inatoa msaada wa kisheria bure. Piga +254 20 271 5808.'
        : 'FIDA Kenya offers free legal aid. Call +254 20 271 5808.',
    },
    {
      title: showSwahili ? '5. Pata Ushauri' : '5. Get Support',
      content: showSwahili
        ? 'Piga 1195 kwa ushauri wa bure wa kisaikolojia. Huhitaji kuwa peke yako.'
        : 'Call 1195 for free counseling. You do not have to face this alone.',
    },
  ]

  return (
    <div className="card border-2 border-deep-purple/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <h3 className="font-bold text-deep-purple">
              {showSwahili ? 'Jinsi ya Kuripoti Kenya' : 'How to Report in Kenya'}
            </h3>
            <p className="text-xs text-charcoal/60">
              {showSwahili ? 'Mwongozo wa hatua kwa hatua' : 'Step-by-step guide'}
            </p>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-charcoal/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-light-lilac space-y-4 animate-fade-in">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-deep-purple text-white 
                              flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <h4 className="font-semibold text-charcoal">{step.title}</h4>
                <p className="text-sm text-charcoal/70">{step.content}</p>
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-sunrise-orange/10 rounded-xl">
            <p className="text-sm text-charcoal/80">
              <strong>💡 {showSwahili ? 'Kidokezo' : 'Tip'}:</strong>{' '}
              {showSwahili 
                ? 'Sheria ya Computer Misuse and Cybercrimes Act 2018 inafanya unyanyasaji wa mtandao kuwa uhalifu. Una haki za kisheria!'
                : 'The Computer Misuse and Cybercrimes Act 2018 makes online harassment a crime. You have legal rights!'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Resource Category Accordion Component
 */
function ResourceCategory({ category, isExpanded, onToggle, showSwahili }) {
  return (
    <div className={`card overflow-hidden ${category.priority ? 'border-2 border-sunrise-orange/50' : ''}`}>
      {/* Header */}
      <button
        onClick={onToggle}
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
          className={`w-5 h-5 text-charcoal/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-light-lilac space-y-3 animate-fade-in">
          {category.items.map((item, index) => (
            <ResourceItem key={index} item={item} showSwahili={showSwahili} />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Individual Resource Item Component
 */
function ResourceItem({ item, showSwahili }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 bg-light-lilac/30 rounded-xl hover:bg-light-lilac/50 
                 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-charcoal group-hover:text-deep-purple transition-colors">
            {item.title}
          </h4>
          <p className="text-sm text-charcoal/70 mt-1">
            {showSwahili && item.swahili ? item.swahili : item.description}
          </p>
          {item.phone && (
            <a 
              href={`tel:${item.phone.replace(/\s/g, '')}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-sm text-sunrise-orange font-semibold mt-1
                         hover:underline"
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
  )
}

export default Library
