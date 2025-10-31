
import http from 'http'

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Azora Sapiens',
      type: 'education',
      timestamp: new Date().toISOString()
    }))
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      message: 'Welcome to Azora Sapiens',
      type: 'education',
      port: 4200
    }))
  }
})

server.listen(4200, () => {
  console.log('✅ Azora Sapiens running on port 4200')
})
