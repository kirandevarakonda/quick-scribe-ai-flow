import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.error('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request body:', req.body);
    const { topic, numKeywords = 10 } = req.body;

    if (!topic) {
      console.error('Topic is missing from request body');
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const prompt = `Generate ${numKeywords} SEO-optimized keywords for the topic: "${topic}". 
    Format the response as a JSON array of strings. 
    Each keyword should be relevant, specific, and include variations of the main topic.`;

    console.log('Sending request to OpenAI with prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Generate relevant, specific keywords that would help with content optimization."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    console.log('OpenAI response:', completion.choices[0].message.content);

    const response = completion.choices[0].message.content;
    let keywords;
    
    try {
      keywords = JSON.parse(response);
    } catch (e) {
      console.log('Failed to parse JSON response, falling back to line-by-line parsing');
      // If response is not valid JSON, split by newlines and clean up
      keywords = response
        .split('\n')
        .map(line => line.replace(/^[0-9]+\.\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    console.log('Final keywords:', keywords);
    res.status(200).json({ keywords });
  } catch (error) {
    console.error('Error in keywords API:', error);
    res.status(500).json({ 
      error: 'Failed to generate keywords',
      details: error.message 
    });
  }
} 