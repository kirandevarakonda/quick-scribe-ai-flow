const API_BASE_URL = import.meta.env.PROD 
  ? 'https://seo-content-generator-ai.vercel.app/api'
  : 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  keywords: `${API_BASE_URL}/keywords`,
  titles: `${API_BASE_URL}/titles`,
  topics: `${API_BASE_URL}/topics`,
  content: `${API_BASE_URL}/content`,
}; 