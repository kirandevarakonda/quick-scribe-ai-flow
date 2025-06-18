const { spawn } = require('child_process');
const path = require('path');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    console.log('Generating titles for:', keyword);
    
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '..', 'backend', 'llm_service.py'),
      'generate_titles',
      keyword
    ], {
      cwd: path.join(__dirname, '..', 'backend')
    });

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
      console.error('Python Error:', data.toString());
    });

    await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python process exited with code:', code);
          console.error('Error output:', error);
          reject(new Error(error || `Python process exited with code ${code}`));
        } else {
          resolve();
        }
      });
    });

    console.log('Titles generated:', result);
    res.json(JSON.parse(result));
  } catch (error) {
    console.error('Error generating titles:', error);
    res.status(500).json({ error: error.message || 'Failed to generate titles' });
  }
}; 