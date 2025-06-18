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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { seedKeyword } = req.body;

    if (!seedKeyword) {
      return res.status(400).json({ error: 'Seed keyword is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const prompt = `Generate 10 SEO-optimized keywords for the topic: "${seedKeyword}". 
    Format the response as a JSON array of strings. 
    Each keyword should be relevant, specific, and include variations of the main topic.`;

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

    const response = completion.choices[0].message.content;
    let keywords;
    
    try {
      keywords = JSON.parse(response);
    } catch (e) {
      // If response is not valid JSON, split by newlines and clean up
      keywords = response
        .split('\n')
        .map(line => line.replace(/^[0-9]+\.\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    return res.status(200).json({ keywords });
  } catch (error) {
    console.error('Error generating keywords:', error);
    return res.status(500).json({ error: 'Failed to generate keywords' });
  }
} 