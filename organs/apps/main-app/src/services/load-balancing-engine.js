/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import axios from "axios";
const BASE_URL = process.env.REACT_APP_LOAD-BALANCING-ENGINE_URL || "http://localhost:3078";

export async function fetchLoadBalancingEngine(payload = {}) {
  const r = await axios.post(`${BASE_URL}/api/load-balancing-engine`, payload);
  return r.data;
}
