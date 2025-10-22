/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import axios from "axios";
const BASE_URL = process.env.REACT_APP_NOTES-SERVICE_URL || "http://localhost:3039";

export async function fetchNotesService(payload = {}) {
  const r = await axios.post(`${BASE_URL}/api/notes-service`, payload);
  return r.data;
}
