const express = require('express');
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'automated-compliance-reporting' }));
const PORT = 4000 + Math.floor(Math.random() * 1000);
app.listen(PORT, () => console.log('automated-compliance-reporting running on port ${PORT}'));
