
import http from 'http'

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Azora Covenant',
      type: 'blockchain',
      timestamp: new Date().toISOString()
    }))
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      message: 'Welcome to Azora Covenant',
      type: 'blockchain',
      port: 4099
    }))
  }
})

server.listen(4099, () => {
  console.log('✅ Azora Covenant running on port 4099')
})
