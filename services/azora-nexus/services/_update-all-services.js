/*
Script to update all remaining services with Prometheus and Swagger
This script processes services that don't have prom-client yet
*/

const fs = require('fs')
const path = require('path')

const serviceConfigs = [
  { name: 'ai-valuation', port: 4103, title: 'AI Valuation' },
  { name: 'backed-valuation', port: 4104, title: 'Backed Valuation' },
  { name: 'compliance', port: 4105, title: 'Compliance' },
  { name: 'dashboard', port: 4106, title: 'Dashboard' },
  { name: 'defi', port: 4107, title: 'DeFi' },
  { name: 'global-adoption', port: 4108, title: 'Global Adoption' },
  { name: 'guardian', port: 4109, title: 'Guardian' },
  { name: 'identity', port: 4110, title: 'Identity' },
  { name: 'ledger', port: 4111, title: 'Ledger' },
  { name: 'liquidity', port: 4112, title: 'Liquidity' },
  { name: 'marketplace', port: 4113, title: 'Marketplace' },
  { name: 'nft', port: 4114, title: 'NFT' },
  { name: 'partnerships', port: 4115, title: 'Partnerships' },
  { name: 'reporting', port: 4116, title: 'Reporting' },
  { name: 'revenue', port: 4117, title: 'Revenue' },
  { name: 'staking', port: 4118, title: 'Staking' },
  { name: 'user-growth', port: 4119, title: 'User Growth' },
]

serviceConfigs.forEach(({ name, port, title }) => {
  const serviceDir = path.join(__dirname, name)
  const indexFile = path.join(serviceDir, 'index.js')
  const packageFile = path.join(serviceDir, 'package.json')
  
  if (!fs.existsSync(indexFile)) {
    console.log(`⚠️  Skipping ${name} - index.js not found`)
    return
  }
  
  let content = fs.readFileSync(indexFile, 'utf8')
  
  // Skip if already updated
  if (content.includes('prom-client')) {
    console.log(`⏭️  ${name} already has Prometheus metrics`)
    return
  }
  
  // 1. Add imports
  content = content.replace(
    /const rateLimit = require\('express-rate-limit'\)/,
    `const rateLimit = require('express-rate-limit')
const promClient = require('prom-client')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')`
  )
  
  // 2. Add Prometheus setup after app creation
  const metricsSetup = `
// Prometheus metrics
const register = new promClient.Registry()
promClient.collectDefaultMetrics({ register })

// HTTP request metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
})

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
})
`
  content = content.replace(/const app = express\(\)/, `const app = express()${metricsSetup}`)
  
  // 3. Update request middleware
  const newMiddleware = `// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    httpRequestDuration.observe(
      { method: req.method, route: req.route?.path || req.path, status_code: res.statusCode },
      duration
    )
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    })
  })
  logger.info(\`\${req.method} \${req.path}\`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })
  next()
})

// Swagger/OpenAPI documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Azora Nexus ${title} Service API',
      version: '1.0.0',
      description: 'API documentation for ${name} service',
    },
    servers: [
      {
        url: \`http://localhost:\${process.env.PORT || ${port}}\`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./index.js'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType)
    const metrics = await register.metrics()
    res.end(metrics)
  } catch (error) {
    logger.error('Error generating metrics', { error: error.message })
    res.status(500).end()
  }
})

`
  
  // Replace the old middleware pattern
  const oldMiddlewarePattern = /\/\/ Request logging middleware[\s\S]*?next\(\)[\s\S]*?\n\n\/\/ Health check endpoint/
  if (oldMiddlewarePattern.test(content)) {
    content = content.replace(oldMiddlewarePattern, newMiddleware + '// Health check endpoint')
  } else {
    // Fallback: insert before health check
    const healthCheckPos = content.indexOf("app.get('/health'")
    if (healthCheckPos > 0) {
      content = content.slice(0, healthCheckPos) + newMiddleware + content.slice(healthCheckPos)
    }
  }
  
  fs.writeFileSync(indexFile, content)
  
  // Update package.json
  if (fs.existsSync(packageFile)) {
    const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'))
    pkg.dependencies = pkg.dependencies || {}
    if (!pkg.dependencies['prom-client']) {
      pkg.dependencies['prom-client'] = '^15.1.3'
    }
    if (!pkg.dependencies['swagger-jsdoc']) {
      pkg.dependencies['swagger-jsdoc'] = '^6.2.8'
    }
    if (!pkg.dependencies['swagger-ui-express']) {
      pkg.dependencies['swagger-ui-express'] = '^5.0.1'
    }
    fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2))
  }
  
  console.log(`✅ Updated ${name}`)
})

console.log('\n✨ All services updated!')

