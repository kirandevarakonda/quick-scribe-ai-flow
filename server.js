import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import keywordsHandler from './api/keywords.js';
import titlesHandler from './api/titles.js';
import topicsHandler from './api/topics.js';
import contentHandler from './api/content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/keywords', keywordsHandler);
app.post('/api/titles', titlesHandler);
app.post('/api/topics', topicsHandler);
app.post('/api/content', contentHandler);

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Static files served from: ${join(__dirname, 'dist')}`);
}); 