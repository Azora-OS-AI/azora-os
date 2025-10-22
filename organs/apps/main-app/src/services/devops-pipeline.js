/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import axios from "axios";
const BASE_URL = process.env.REACT_APP_DEVOPS-PIPELINE_URL || "http://localhost:3070";

export async function fetchDevopsPipeline(payload = {}) {
  const r = await axios.post(`${BASE_URL}/api/devops-pipeline`, payload);
  return r.data;
}
