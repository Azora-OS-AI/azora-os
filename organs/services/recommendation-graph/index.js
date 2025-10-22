/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

const express = require('express');
const app = express();
app.use(express.json());
app.post('/api/recommend', (req, res) => res.json({ recommended: ['itemA','itemB'] }));
app.listen(3065);
