import axios from "axios";
const BASE_URL = process.env.REACT_APP_ACCESSIBILITY-SUITE_URL || "http://localhost:3063";

export async function fetchAccessibilitySuite(payload = {}) {
  const r = await axios.post(`${BASE_URL}/api/accessibility-suite`, payload);
  return r.data;
}
