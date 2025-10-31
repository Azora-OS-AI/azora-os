
import http from 'http'

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Azora Mint',
      type: 'finance',
      timestamp: new Date().toISOString()
    }))
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      message: 'Welcome to Azora Mint',
      type: 'finance',
      port: 4300
    }))
  }
})

server.listen(4300, () => {
  console.log('✅ Azora Mint running on port 4300')
})
