export const API_BASE_URL = '';

export const API_ENDPOINTS = {
  TRANSCRIPT: '/api/transcript',
  GENERATE_OUTLINE: '/api/generate-outline',
  GENERATE_SCRIPT: '/api/generate-script',
  REFINE_SCRIPT: `${API_BASE_URL}/api/refine-script`,
} as const;
