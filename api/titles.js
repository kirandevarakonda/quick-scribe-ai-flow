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
    const { topic, keywords } = req.body;

    if (!topic || !keywords || !Array.isArray(keywords)) {
      console.error('Missing required fields:', { topic, keywords });
      return res.status(400).json({ error: 'Topic and keywords array are required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const prompt = `Generate 2-3 professional, SEO-optimized blog post titles for the topic: "${topic}". 
    The titles should be engaging, click-worthy, and incorporate relevant keywords from this list: ${keywords.join(', ')}.
    Keep a professional tone throughout.
    Return ONLY a JSON array of strings, with no additional text or formatting.`;

    console.log('Sending request to OpenAI with prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Return only a JSON array of 2-3 professional titles, with no additional text or formatting."
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
    let titles;
    
    try {
      // Clean up the response before parsing
      const cleanedResponse = response
        .replace(/```json\n?/g, '')  // Remove ```json
        .replace(/```\n?/g, '')      // Remove ```
        .replace(/\[\n?/g, '[')      // Remove newlines after [
        .replace(/\]\n?/g, ']')      // Remove newlines before ]
        .replace(/,\n?/g, ',')       // Remove newlines after commas
        .trim();                     // Remove extra whitespace

      titles = JSON.parse(cleanedResponse);
      
      // Ensure we have an array of strings
      if (!Array.isArray(titles)) {
        throw new Error('Response is not an array');
      }
      
      // Clean up each title
      titles = titles.map(title => title.trim());
    } catch (e) {
      console.log('Failed to parse JSON response, falling back to line-by-line parsing');
      // If response is not valid JSON, split by newlines and clean up
      titles = response
        .split('\n')
        .map(line => line.replace(/^[0-9]+\.\s*/, '').trim())
        .filter(line => line.length > 0 && !line.includes('```') && !line.includes('[') && !line.includes(']'))
        .map(line => line.replace(/^["']|["']$/g, '').trim()); // Remove quotes
    }

    console.log('Final titles:', titles);
    res.status(200).json({ titles });
  } catch (error) {
    console.error('Error in titles API:', error);
    res.status(500).json({ 
      error: 'Failed to generate titles',
      details: error.message 
    });
  }
} 