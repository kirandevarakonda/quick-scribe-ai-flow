const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Helper function to run Python scripts
const runPythonScript = (scriptPath, args) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [scriptPath, ...args]);
    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(error || `Python process exited with code ${code}`));
      } else {
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          reject(new Error('Failed to parse Python script output'));
        }
      }
    });
  });
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API endpoints
app.post('/api/keywords', async (req, res) => {
  try {
    const { seedKeyword } = req.body;
    if (!seedKeyword) {
      return res.status(400).json({ error: 'Seed keyword is required' });
    }

    console.log('Generating keywords for:', seedKeyword);
    const result = await runPythonScript(
      path.join(__dirname, '../backend/llm_service.py'),
      ['generate_keywords', seedKeyword]
    );
    console.log('Keywords generated:', result);
    res.json(result);
  } catch (error) {
    console.error('Error generating keywords:', error);
    res.status(500).json({ error: error.message || 'Failed to generate keywords' });
  }
});

app.post('/api/titles', async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    const result = await runPythonScript(
      path.join(__dirname, '../backend/llm_service.py'),
      ['generate_titles', keyword]
    );
    res.json(result);
  } catch (error) {
    console.error('Error generating titles:', error);
    res.status(500).json({ error: error.message || 'Failed to generate titles' });
  }
});

app.post('/api/topics', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await runPythonScript(
      path.join(__dirname, '../backend/llm_service.py'),
      ['generate_topics', title]
    );
    res.json(result);
  } catch (error) {
    console.error('Error generating topics:', error);
    res.status(500).json({ error: error.message || 'Failed to generate topics' });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const result = await runPythonScript(
      path.join(__dirname, '../backend/llm_service.py'),
      ['generate_content', topic]
    );
    res.json(result);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: error.message || 'Failed to generate content' });
  }
});

// Export the Express API
module.exports = app; 