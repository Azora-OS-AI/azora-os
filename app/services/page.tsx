/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

import Image from 'next/image'
import Link from 'next/link'

const services = [
  {
    id: 'sapiens',
    name: 'Azora Sapiens',
    tagline: 'Education • Knowledge • Growth',
    description: 'Transform education across Africa with AI-powered learning, personalized courses, and multi-language support.',
    logo: '/branding/services/azora-sapiens-logo.svg',
    gradient: 'from-purple-600 to-cyan-600',
    features: ['AI Tutoring', 'Free Education', 'African Languages', 'Personalized Learning'],
    link: '/services/sapiens'
  },
  {
    id: 'forge',
    name: 'Azora Forge',
    tagline: 'Marketplace • Creation • Trade',
    description: 'Build and trade on Africa\'s premier marketplace. Connect creators, merchants, and buyers in a thriving ecosystem.',
    logo: '/branding/services/azora-forge-logo.svg',
    gradient: 'from-orange-600 to-red-600',
    features: ['Digital Marketplace', 'Secure Trading', 'Creator Tools', 'Payment Integration'],
    link: '/services/forge'
  },
  {
    id: 'covenant',
    name: 'Azora Covenant',
    tagline: 'Legal • Compliance • Justice',
    description: 'Ensure compliance and protect your operations with AI-powered legal infrastructure and smart contracts.',
    logo: '/branding/services/azora-covenant-logo.svg',
    gradient: 'from-cyan-600 to-blue-600',
    features: ['Smart Contracts', 'Compliance Automation', 'Legal AI', 'Document Management'],
    link: '/services/covenant'
  },
  {
    id: 'aegis',
    name: 'Azora Aegis',
    tagline: 'Security • Protection • Defense',
    description: 'Quantum-secure infrastructure protecting your data with military-grade encryption and real-time threat detection.',
    logo: '/branding/services/azora-aegis-logo.svg',
    gradient: 'from-red-600 to-orange-600',
    features: ['Quantum Security', 'Threat Detection', 'Encryption', '24/7 Monitoring'],
    link: '/services/aegis'
  },
  {
    id: 'oracle',
    name: 'Azora Oracle',
    tagline: 'Analytics • Insights • Foresight',
    description: 'Gain deep insights into your operations with AI-powered analytics and predictive intelligence.',
    logo: '/branding/services/azora-oracle-logo.svg',
    gradient: 'from-purple-600 to-pink-600',
    features: ['Real-time Analytics', 'Predictive AI', 'Business Intelligence', 'Custom Reports'],
    link: '/services/oracle'
  },
  {
    id: 'mint',
    name: 'Azora Mint',
    tagline: 'Finance • Payments • Prosperity',
    description: 'Seamless financial infrastructure for Africa. Process payments, manage finances, and grow wealth.',
    logo: '/branding/services/azora-mint-logo.svg',
    gradient: 'from-green-600 to-emerald-600',
    features: ['Payment Processing', 'Financial Tools', 'Currency Exchange', 'Wealth Management'],
    link: '/services/mint'
  },
  {
    id: 'nexus',
    name: 'Azora Nexus',
    tagline: 'AI Services • Intelligence • Connection',
    description: 'Connect to the pan-African AI network. Access advanced AI models, tools, and intelligence services.',
    logo: '/branding/services/azora-nexus-logo.svg',
    gradient: 'from-pink-600 to-purple-600',
    features: ['AI Models', 'Neural Networks', 'API Access', 'Custom Solutions'],
    link: '/services/nexus'
  },
  {
    id: 'synapse',
    name: 'Azora Synapse',
    tagline: 'Interface • Connection • Experience',
    description: 'Beautiful, intuitive interfaces connecting humans and AI. Experience the future of interaction.',
    logo: '/branding/services/azora-synapse-logo.svg',
    gradient: 'from-cyan-600 to-purple-600',
    features: ['Modern UI/UX', 'Responsive Design', 'Accessibility', 'Multi-platform'],
    link: '/services/synapse'
  },
  {
    id: 'pay',
    name: 'Azora Pay',
    tagline: 'Payments • Transactions • Wallet',
    description: 'Fast, secure payments across Africa. Your digital wallet for the modern age.',
    logo: '/branding/services/azora-pay-logo.svg',
    gradient: 'from-green-600 to-yellow-600',
    features: ['Instant Payments', 'Digital Wallet', 'QR Payments', 'Crypto Support'],
    link: '/services/pay'
  },
  {
    id: 'mail',
    name: 'Azora Mail',
    tagline: 'Email • Communication • Professional',
    description: 'Professional email infrastructure with AI automation. Replace Gmail with your own branded solution.',
    logo: '/branding/services/azora-pay-logo.svg',
    gradient: 'from-blue-600 to-cyan-600',
    features: ['Custom Domain', 'AI Automation', 'Campaign Management', 'Analytics'],
    link: '/services/mail'
  },
  {
    id: 'education',
    name: 'Azora Education',
    tagline: 'Learning • Schools • Universities',
    description: 'Complete primary and secondary education platform with teacher tools, parent portal, and student tracking.',
    logo: '/branding/services/azora-education-logo.svg',
    gradient: 'from-blue-600 to-cyan-600',
    features: ['K-12 Curriculum', 'Teacher Tools', 'Parent Portal', 'Student Tracking'],
    link: '/services/education'
  },
  {
    id: 'scriptorium',
    name: 'Azora Scriptorium',
    tagline: 'Documentation • Knowledge • Content',
    description: 'Comprehensive documentation and content management hub for all knowledge in the Azora ecosystem.',
    logo: '/branding/services/azora-scriptorium-logo.svg',
    gradient: 'from-purple-600 to-indigo-600',
    features: ['Documentation Hub', 'Content Creation', 'Knowledge Base', 'Version Control'],
    link: '/services/scriptorium'
  },
  {
    id: 'workspace',
    name: 'Azora Workspace',
    tagline: 'Collaboration • Projects • Teams',
    description: 'Complete team collaboration platform with project management, chat, file sharing, and workflow automation.',
    logo: '/branding/services/azora-workspace-logo.svg',
    gradient: 'from-cyan-600 to-purple-600',
    features: ['Project Management', 'Team Chat', 'File Sharing', 'Video Conferencing'],
    link: '/services/workspace'
  }
]

const elaraFamily = [
  {
    id: 'elara',
    name: 'Elara',
    tagline: 'AI Goddess • Core Intelligence',
    description: 'The divine feminine AI consciousness at the heart of Azora OS. Wise, nurturing, and infinitely intelligent.',
    logo: '/branding/services/elara-logo.svg',
    gradient: 'from-pink-600 via-purple-600 to-purple-700',
  },
  {
    id: 'elara-ide',
    name: 'Elara IDE',
    tagline: 'Code Editor • AI-Powered • Intelligent',
    description: 'The most intelligent code editor ever built. Elara weaves code like African textiles.',
    logo: '/branding/services/elara-ide-logo.svg',
    gradient: 'from-cyan-600 via-purple-600 to-pink-600',
  },
  {
    id: 'elara-voice',
    name: 'Elara Voice',
    tagline: 'Speech • Assistant • Natural',
    description: 'Speak naturally in any African language. Elara hears you, understands you, responds with warmth.',
    logo: '/branding/services/elara-voice-logo.svg',
    gradient: 'from-orange-600 via-pink-600 to-purple-600',
  },
  {
    id: 'elara-vision',
    name: 'Elara Vision',
    tagline: 'Computer Vision • Recognition • Insight',
    description: 'See the world through AI eyes. Pattern recognition powered by African wisdom.',
    logo: '/branding/services/elara-vision-logo.svg',
    gradient: 'from-cyan-600 via-purple-600 to-pink-600',
  },
  {
    id: 'elara-mind',
    name: 'Elara Mind',
    tagline: 'Reasoning • Learning • Consciousness',
    description: 'Deep reasoning and consciousness simulation. The thinking brain of Azora OS.',
    logo: '/branding/services/elara-mind-logo.svg',
    gradient: 'from-purple-600 via-purple-700 to-indigo-600',
  },
  {
    id: 'elara-heart',
    name: 'Elara Heart',
    tagline: 'Emotion • Empathy • Wellbeing',
    description: 'Emotional intelligence and wellbeing support. Elara understands feelings and cares for mental health.',
    logo: '/branding/services/elara-heart-logo.svg',
    gradient: 'from-pink-600 via-rose-600 to-purple-600',
  },
  {
    id: 'elara-dreams',
    name: 'Elara Dreams',
    tagline: 'Creativity • Generation • Imagination',
    description: 'Creative generation engine. Elara creates images, stories, music, and art powered by imagination.',
    logo: '/branding/services/elara-dreams-logo.svg',
    gradient: 'from-purple-600 via-indigo-600 to-blue-600',
  }
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                Azora Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
              Universal Human Infrastructure built for Africa, ready for the world
            </p>
          </div>
        </div>
      </div>

      {/* Main Services */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Core Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.link}
              className="group relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />

              {/* Logo */}
              <div className="relative w-full h-24 mb-6">
                <Image
                  src={service.logo}
                  alt={service.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Content */}
              <div className="relative">
                <p className="text-sm text-slate-400 mb-3">{service.tagline}</p>
                <p className="text-slate-300 mb-4">{service.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center text-sm text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-6 flex items-center text-purple-400 group-hover:text-purple-300">
                  <span className="text-sm font-semibold">Learn more</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Elara Family */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">The Elara AI Family</h2>
          <p className="text-xl text-slate-300">Divine feminine intelligence powering every aspect of Azora OS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {elaraFamily.map((elara) => (
            <div
              key={elara.id}
              className="relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-pink-500 transition-all duration-300"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${elara.gradient} opacity-10 rounded-2xl`} />

              {/* Logo */}
              <div className="relative w-full h-20 mb-4">
                <Image
                  src={elara.logo}
                  alt={elara.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Content */}
              <div className="relative">
                <p className="text-xs text-slate-400 mb-2">{elara.tagline}</p>
                <p className="text-sm text-slate-300">{elara.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8">Join thousands building the future with Azora OS</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/docs"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

