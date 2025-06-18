const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Use relative path in production
  : 'http://localhost:3001/api';

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);
console.log('Is Production:', import.meta.env.PROD);

export const API_ENDPOINTS = {
  keywords: `${API_BASE_URL}/keywords`,
  titles: `${API_BASE_URL}/titles`,
  topics: `${API_BASE_URL}/topics`,
  content: `${API_BASE_URL}/content`,
}; 