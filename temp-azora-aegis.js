
import http from 'http'

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Azora Aegis',
      type: 'security',
      timestamp: new Date().toISOString()
    }))
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      message: 'Welcome to Azora Aegis',
      type: 'security',
      port: 4000
    }))
  }
})

server.listen(4000, () => {
  console.log('✅ Azora Aegis running on port 4000')
})
