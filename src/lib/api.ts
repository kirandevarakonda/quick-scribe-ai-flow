const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // In production, use relative path
  : 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  keywords: `${API_BASE_URL}/keywords`,
  titles: `${API_BASE_URL}/titles`,
  topics: `${API_BASE_URL}/topics`,
  content: `${API_BASE_URL}/content`,
};

export const fetchWithConfig = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}; 