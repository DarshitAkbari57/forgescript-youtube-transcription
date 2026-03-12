export const API_BASE_URL = '';

export const API_ENDPOINTS = {
  TRANSCRIPT: `${API_BASE_URL}/api/transcript`,
  GENERATE_SCRIPT: `${API_BASE_URL}/api/generate-script`,
  REFINE_SCRIPT: `${API_BASE_URL}/api/refine-script`,
  GENERATE_OUTLINE: `${API_BASE_URL}/api/generate-outline`,
  GENERATE_HOOKS: `${API_BASE_URL}/api/generate-hooks`,
  GENERATE_TITLES: `${API_BASE_URL}/api/generate-titles`,
  GENERATE_IDEAS: `${API_BASE_URL}/api/generate-ideas`,
  SEO_TOOLS: `${API_BASE_URL}/api/seo-tools`,
} as const;
