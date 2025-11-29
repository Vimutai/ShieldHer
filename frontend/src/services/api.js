// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Evidence analysis function
export const analyzeEvidence = async (evidenceData) => {
  try {
    const response = await api.post('/analyze-evidence', {
      evidence: evidenceData
    });
    return response.data;
  } catch (error) {
    console.error('Analysis API error:', error);
    // Fallback to client-side analysis if backend is down
    return analyzeLocally(evidenceData);
  }
};

// Fallback local analysis
const analyzeLocally = (evidenceData) => {
  let totalComments = 0;
  let sources = new Set();
  
  evidenceData.forEach(entry => {
    totalComments += entry.count || 0;
    sources.add(entry.source);
  });
  
  let severity = 'Low';
  if (totalComments > 5) severity = 'Medium';
  if (totalComments > 10) severity = 'High';
  
  const autoSelected = severity === 'High' 
    ? ['Document Evidence', 'Firm Response Template', 'Block User']
    : ['Calm Response Template 1', 'Document Evidence'];
  
  return {
    severity,
    summary: `Found ${totalComments} comments from ${sources.size} sources`,
    autoSelected,
    analysis: {
      totalComments,
      uniqueSources: sources.size,
      sourcesDetected: Array.from(sources)
    }
  };
};

// Optional: Add other API functions you might need
export const apiService = {
  analyzeEvidence,
  // Add other endpoints here as needed
};

export default apiService;