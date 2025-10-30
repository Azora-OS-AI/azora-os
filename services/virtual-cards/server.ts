/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

import express from 'express';
import { virtualCardService } from './index';

const app = express();
app.use(express.json());

app.post('/api/virtual-cards', (req, res) => {
  const { currency, brand, spendLimitZAR, metadata } = req.body || {};
  const card = virtualCardService.create(currency, brand, spendLimitZAR, metadata);
  res.json(card);
});

app.get('/api/virtual-cards', (req, res) => {
  res.json(virtualCardService.list());
});

app.get('/api/virtual-cards/:id', (req, res) => {
  const card = virtualCardService.get(req.params.id);
  if (!card) return res.status(404).json({ error: 'Not found' });
  res.json(card);
});

app.post('/api/virtual-cards/:id/freeze', (req, res) => {
  const card = virtualCardService.setStatus(req.params.id, 'frozen');
  if (!card) return res.status(404).json({ error: 'Not found' });
  res.json(card);
});

app.post('/api/virtual-cards/:id/unfreeze', (req, res) => {
  const card = virtualCardService.setStatus(req.params.id, 'active');
  if (!card) return res.status(404).json({ error: 'Not found' });
  res.json(card);
});

app.post('/api/virtual-cards/:id/limit', (req, res) => {
  const { limitZAR } = req.body || {};
  const card = virtualCardService.setSpendLimit(req.params.id, typeof limitZAR === 'number' ? limitZAR : undefined);
  if (!card) return res.status(404).json({ error: 'Not found' });
  res.json(card);
});

const port = Number(process.env.CARDS_PORT || 4515);
app.listen(port, () => {
  console.log(`Virtual Cards service listening on http://localhost:${port}`);
});


