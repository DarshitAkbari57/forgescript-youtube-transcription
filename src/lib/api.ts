export const API_BASE_URL = '';

export const API_ENDPOINTS = {
  TRANSCRIPT: `${API_BASE_URL}/api/transcript`,
  GENERATE_SCRIPT: `${API_BASE_URL}/api/generate-script`,
  REFINE_SCRIPT: `${API_BASE_URL}/api/refine-script`,
} as const;
