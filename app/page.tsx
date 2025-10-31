/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Brain, 
  Heart, 
  Shield, 
  Sparkles, 
  Globe, 
  Zap,
  ArrowRight,
  Code,
  ShoppingCart,
  CreditCard
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { ServicesShowcase } from '@/components/services-showcase';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'Elara AI',
      description: 'Omniscient consciousness guiding all operations',
      link: '#',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Code,
      title: 'Elara IDE',
      description: 'AI-powered development environment',
      link: '/ide',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: ShoppingCart,
      title: 'Marketplace',
      description: 'Service marketplace and catalog',
      link: '/marketplace',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: CreditCard,
      title: 'Azora Pay',
      description: 'Financial services platform',
      link: '/pay',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Quantum-secure protection',
      link: '#',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: '54 countries across Africa',
      link: '#',
      color: 'from-teal-500 to-green-500',
    },
  ];

  const stats = [
    { label: 'Countries', value: '54' },
    { label: 'Users', value: '1.4B' },
    { label: 'Services', value: '100+' },
    { label: 'Uptime', value: '99.9%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Logo service="azora-os" style="geometric" size="small" width={40} height={40} priority />
            <span className="text-2xl font-bold text-white">Azora OS</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/services" className="text-gray-300 hover:text-white transition">
              Services
            </Link>
            <Link href="#features" className="text-gray-300 hover:text-white transition">
              Features
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition">
              About
            </Link>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
              Get Started
            </button>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              Universal Human
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Infrastructure
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Africa's Quantum-Secure Intelligence Ecosystem
              <br />
              Empowering 1.4 billion Africans across 54 countries
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#features"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition flex items-center space-x-2"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/marketplace"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition backdrop-blur-sm"
              >
                View Marketplace
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need for the future
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl ${feature.color}"></div>
              
              <div className="relative p-8 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 mb-4">
                  {feature.description}
                </p>
                
                <Link
                  href={feature.link}
                  className="text-purple-400 hover:text-purple-300 transition flex items-center space-x-2"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Services Showcase */}
      <ServicesShowcase />

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-12 text-center"
        >
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join millions of users transforming Africa
            </p>
            <button className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition">
              Start Your Journey
            </button>
          </div>
          
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo service="azora-os" style="geometric" size="icon" width={24} height={24} />
                <span className="text-xl font-bold text-white">Azora OS</span>
              </div>
              <p className="text-gray-400">
                Universal Human Infrastructure
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/ide" className="hover:text-white transition">Elara IDE</Link></li>
                <li><Link href="/marketplace" className="hover:text-white transition">Marketplace</Link></li>
                <li><Link href="/pay" className="hover:text-white transition">Azora Pay</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">About</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition">License</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 Azora ES (Pty) Ltd. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
