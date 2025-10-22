/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import axios from "axios";
const BASE_URL = process.env.REACT_APP_AI-PERSONALIZATION_URL || "http://localhost:3010";

export async function fetchAiPersonalization(payload = {}) {
  const r = await axios.post(`${BASE_URL}/api/ai-personalization`, payload);
  return r.data;
}
