
import http from 'http'

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Azora Nexus',
      type: 'ai',
      timestamp: new Date().toISOString()
    }))
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      message: 'Welcome to Azora Nexus',
      type: 'ai',
      port: 3006
    }))
  }
})

server.listen(3006, () => {
  console.log('✅ Azora Nexus running on port 3006')
})
