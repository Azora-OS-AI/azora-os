
import http from 'http'

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Azora Forge',
      type: 'marketplace',
      timestamp: new Date().toISOString()
    }))
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      message: 'Welcome to Azora Forge',
      type: 'marketplace',
      port: 12345
    }))
  }
})

server.listen(12345, () => {
  console.log('✅ Azora Forge running on port 12345')
})
