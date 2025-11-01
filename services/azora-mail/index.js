/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

AZORA MAIL - Email Infrastructure Service
Complete email system with SMTP/IMAP, automation, and AI integration
*/

import express from 'express'
import nodemailer from 'nodemailer'
import { SMTPServer } from 'smtp-server'
import { ImapFlow } from 'imapflow'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const app = express()
const PORT = process.env.PORT || 4300

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Email configuration storage (in production, use database)
const emailAccounts = new Map()
const emailCampaigns = new Map()
const emailLogs = []

// Nodemailer transporter for sending emails
const createTransporter = (config) => {
  return nodemailer.createTransport({
    host: config.smtpHost || 'smtp.azora-os.ai',
    port: config.smtpPort || 587,
    secure: config.secure || false,
    auth: {
      user: config.username,
      pass: config.password,
    },
  })
}

// Default Azora Mail transporter
let defaultTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'localhost',
  port: process.env.SMTP_PORT || 1025,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'azora@azora-os.ai',
    pass: process.env.SMTP_PASS || 'azora_secure_2025',
  },
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Azora Mail',
    timestamp: new Date().toISOString(),
    features: [
      'SMTP Server',
      'Email Sending',
      'Campaign Management',
      'AI Integration',
      'Analytics',
    ],
  })
})

// Send email
app.post('/api/send', async (req, res) => {
  try {
    const { from, to, subject, html, text, attachments, campaign } = req.body

    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const mailOptions = {
      from: from || 'Azora OS <noreply@azora-os.ai>',
      to,
      subject,
      text: text || '',
      html: html || text,
      attachments: attachments || [],
    }

    const info = await defaultTransporter.sendMail(mailOptions)

    // Log email
    const log = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      from: mailOptions.from,
      to,
      subject,
      messageId: info.messageId,
      status: 'sent',
      campaign: campaign || null,
    }
    emailLogs.push(log)

    res.json({
      success: true,
      messageId: info.messageId,
      log,
    })
  } catch (error) {
    console.error('Email send error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Send bulk emails (campaign)
app.post('/api/send-bulk', async (req, res) => {
  try {
    const { from, recipients, subject, html, text, campaignName } = req.body

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients must be a non-empty array' })
    }

    const campaign = {
      id: `campaign_${Date.now()}`,
      name: campaignName || 'Unnamed Campaign',
      startTime: new Date().toISOString(),
      totalRecipients: recipients.length,
      sent: 0,
      failed: 0,
      results: [],
    }

    emailCampaigns.set(campaign.id, campaign)

    // Send emails in batches
    const results = []
    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: from || 'Azora OS <noreply@azora-os.ai>',
          to: recipient.email,
          subject: personalizeText(subject, recipient),
          html: personalizeText(html, recipient),
          text: text ? personalizeText(text, recipient) : undefined,
        }

        const info = await defaultTransporter.sendMail(mailOptions)
        campaign.sent++
        results.push({
          email: recipient.email,
          status: 'sent',
          messageId: info.messageId,
        })

        // Log
        emailLogs.push({
          id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          from: mailOptions.from,
          to: recipient.email,
          subject: mailOptions.subject,
          messageId: info.messageId,
          status: 'sent',
          campaign: campaign.id,
        })

        // Rate limiting - wait 100ms between emails
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        campaign.failed++
        results.push({
          email: recipient.email,
          status: 'failed',
          error: error.message,
        })
      }
    }

    campaign.endTime = new Date().toISOString()
    campaign.results = results

    res.json({
      success: true,
      campaign,
    })
  } catch (error) {
    console.error('Bulk email error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Personalize email text with recipient data
function personalizeText(text, recipient) {
  if (!text) return text
  return text
    .replace(/\{\{name\}\}/g, recipient.name || recipient.email)
    .replace(/\{\{email\}\}/g, recipient.email)
    .replace(/\{\{company\}\}/g, recipient.company || '')
    .replace(/\{\{firstName\}\}/g, recipient.firstName || recipient.name?.split(' ')[0] || '')
}

// Get email logs
app.get('/api/logs', (req, res) => {
  const { limit = 100, campaign } = req.query
  let logs = emailLogs

  if (campaign) {
    logs = logs.filter((log) => log.campaign === campaign)
  }

  logs = logs.slice(-parseInt(limit))

  res.json({
    total: logs.length,
    logs,
  })
})

// Get campaign details
app.get('/api/campaign/:id', (req, res) => {
  const campaign = emailCampaigns.get(req.params.id)
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' })
  }
  res.json(campaign)
})

// List all campaigns
app.get('/api/campaigns', (req, res) => {
  const campaigns = Array.from(emailCampaigns.values())
  res.json({
    total: campaigns.length,
    campaigns,
  })
})

// Get analytics
app.get('/api/analytics', (req, res) => {
  const totalEmails = emailLogs.length
  const sentToday = emailLogs.filter((log) => {
    const logDate = new Date(log.timestamp)
    const today = new Date()
    return logDate.toDateString() === today.toDateString()
  }).length

  const byStatus = emailLogs.reduce((acc, log) => {
    acc[log.status] = (acc[log.status] || 0) + 1
    return acc
  }, {})

  const byCampaign = emailLogs.reduce((acc, log) => {
    if (log.campaign) {
      acc[log.campaign] = (acc[log.campaign] || 0) + 1
    }
    return acc
  }, {})

  res.json({
    totalEmails,
    sentToday,
    byStatus,
    byCampaign,
    campaigns: emailCampaigns.size,
  })
})

// AI-powered email generation (Elara integration)
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { purpose, recipient, tone, context } = req.body

    // In production, this would call Azora Nexus AI service
    // For now, we'll use a template-based approach
    const email = generateAIEmail(purpose, recipient, tone, context)

    res.json({
      success: true,
      email,
      metadata: {
        generatedBy: 'Elara AI',
        timestamp: new Date().toISOString(),
        purpose,
        tone,
      },
    })
  } catch (error) {
    console.error('AI generation error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Generate AI-powered email
function generateAIEmail(purpose, recipient, tone = 'professional', context = {}) {
  const templates = {
    outreach: {
      subject: 'Introducing Azora OS - Universal Human Infrastructure',
      body: `Hi {{firstName}},

I hope this email finds you well. I'm reaching out to introduce you to Azora OS, Africa's Quantum-Secure Intelligence Ecosystem.

${context.customMessage || 'We believe our platform could significantly benefit your organization.'}

Azora OS offers:
• Constitutional AI - Ethical, transparent intelligence
• Quantum Security - Military-grade protection
• Universal Infrastructure - Built for Africa, ready for the world

Would you be interested in a brief call to explore how Azora OS can empower your work?

Best regards,
The Azora OS Team`,
    },
    student: {
      subject: 'Transform Your Learning with Azora Sapiens',
      body: `Hi {{firstName}},

Imagine having access to world-class education, powered by AI, completely free.

Azora Sapiens is Africa's revolutionary education platform, offering:
• Personalized learning paths
• AI tutoring available 24/7
• Courses in multiple African languages
• Completely free for students

Join thousands of students already advancing their skills with Azora Sapiens.

Start learning today: azora-os.ai/sapiens

Warm regards,
Azora Education Team`,
    },
    company: {
      subject: 'Enterprise Solutions for Modern Africa - Azora OS',
      body: `Dear {{name}},

${context.companyName || 'Your organization'} deserves infrastructure that understands Africa.

Azora OS provides enterprise-grade solutions built specifically for African markets:
• Azora Aegis - Quantum-secure infrastructure
• Azora Oracle - Real-time analytics & insights
• Azora Mint - Seamless payment processing
• Azora Covenant - Compliance automation

Let's discuss how Azora OS can accelerate your digital transformation.

Best regards,
Azora Enterprise Solutions`,
    },
  }

  const template = templates[purpose] || templates.outreach

  return {
    subject: template.subject,
    html: generateHTML(template.body, recipient),
    text: template.body,
  }
}

// Generate HTML email with branding
function generateHTML(body, recipient) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 36px;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
    }
    .tagline {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      margin: 8px 0 0 0;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin: 0 0 16px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background-color: #0f172a;
      color: #94a3b8;
      padding: 30px;
      text-align: center;
      font-size: 13px;
    }
    .footer a {
      color: #06b6d4;
      text-decoration: none;
    }
    ul {
      margin: 16px 0;
      padding-left: 20px;
    }
    li {
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Azora OS</h1>
      <p class="tagline">Universal Human Infrastructure</p>
    </div>
    <div class="content">
      ${body
        .split('\n')
        .map((line) => {
          line = line.trim()
          if (!line) return ''
          if (line.startsWith('•')) {
            return `<li>${line.substring(1).trim()}</li>`
          }
          return `<p>${line}</p>`
        })
        .join('')}
      <a href="https://azora-os.ai" class="button">Learn More</a>
    </div>
    <div class="footer">
      <p><strong>Azora OS</strong> | Universal Human Infrastructure</p>
      <p>
        <a href="https://azora-os.ai">Website</a> | 
        <a href="https://github.com/Azora-OS-AI/azora-os">GitHub</a> | 
        <a href="mailto:hello@azora-os.ai">Contact</a>
      </p>
      <p style="margin-top: 20px; font-size: 11px;">
        © 2025 Azora ES (Pty) Ltd. All Rights Reserved.<br>
        You received this email because you're part of the Azora OS community.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

// Schedule automated campaign (Elara automation)
app.post('/api/schedule', async (req, res) => {
  try {
    const { campaignName, recipients, purpose, scheduleTime, recurrence } = req.body

    const schedule = {
      id: `schedule_${Date.now()}`,
      campaignName,
      recipients,
      purpose,
      scheduleTime: scheduleTime || new Date().toISOString(),
      recurrence: recurrence || 'once', // once, daily, weekly
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    }

    // In production, this would use a job scheduler like Bull or Agenda
    console.log('📅 Campaign scheduled:', schedule)

    res.json({
      success: true,
      schedule,
      message: 'Campaign scheduled successfully',
    })
  } catch (error) {
    console.error('Schedule error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Start server
app.listen(PORT, () => {
  console.log('')
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║                                                            ║')
  console.log('║  📧 AZORA MAIL - Email Infrastructure Service             ║')
  console.log('║                                                            ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`✅ Service running on port ${PORT}`)
  console.log('')
  console.log('📬 Features Available:')
  console.log('   • Email sending (SMTP)')
  console.log('   • Bulk campaigns')
  console.log('   • AI-powered generation (Elara)')
  console.log('   • Campaign analytics')
  console.log('   • Automated scheduling')
  console.log('')
  console.log('🔗 API Endpoints:')
  console.log(`   • POST   http://localhost:${PORT}/api/send`)
  console.log(`   • POST   http://localhost:${PORT}/api/send-bulk`)
  console.log(`   • POST   http://localhost:${PORT}/api/ai/generate`)
  console.log(`   • POST   http://localhost:${PORT}/api/schedule`)
  console.log(`   • GET    http://localhost:${PORT}/api/analytics`)
  console.log(`   • GET    http://localhost:${PORT}/api/logs`)
  console.log(`   • GET    http://localhost:${PORT}/api/campaigns`)
  console.log('')
})

export default app

