import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent-primary/5">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-foreground">Azora OS</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/10"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button className="btn-secondary" onClick={() => window.location.href = '/auth/login'}>
              Sign In
            </button>

            <button className="btn-primary" onClick={() => window.location.href = '/auth/signup'}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Africa's First
              <span className="block text-accent-primary">Full Software</span>
              Infrastructure
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Build, deploy, and scale applications with Azora OS - the autonomous platform
              powering Africa's digital transformation through complete software independence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4" onClick={() => window.location.href = '/auth/signup'}>
                Start Building Free
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Complete Platform Suite
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to build modern applications
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Services",
                description: "Advanced machine learning and AI capabilities built into every application",
                icon: "🤖"
              },
              {
                title: "Real-time Analytics",
                description: "Comprehensive dashboards and insights for data-driven decisions",
                icon: "📊"
              },
              {
                title: "Secure Infrastructure",
                description: "Enterprise-grade security with constitutional compliance",
                icon: "🔒"
              },
              {
                title: "Global Deployment",
                description: "Deploy anywhere with our distributed cloud infrastructure",
                icon: "🌍"
              },
              {
                title: "Developer Tools",
                description: "Complete development environment with integrated tooling",
                icon: "⚡"
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock assistance from our expert team",
                icon: "🎯"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="glass p-6 rounded-xl hover:transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers and businesses already building on Azora OS
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4" onClick={() => window.location.href = '/auth/signup'}>
                Create Free Account
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 Azora OS. Building Africa's software future.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage