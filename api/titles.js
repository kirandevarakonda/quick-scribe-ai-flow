import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, keywords, numTitles = 5 } = req.body;

    if (!topic || !keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ error: 'Topic and keywords array are required' });
    }

    const prompt = `Generate ${numTitles} SEO-optimized blog post titles for the topic: "${topic}". 
    Use these keywords in the titles: ${keywords.join(', ')}. 
    Format the response as a JSON array of strings. 
    Each title should be engaging, include relevant keywords naturally, and be optimized for click-through rate.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Generate engaging, keyword-rich titles that would perform well in search results."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const response = completion.choices[0].message.content;
    let titles;
    
    try {
      titles = JSON.parse(response);
    } catch (e) {
      // If response is not valid JSON, split by newlines and clean up
      titles = response
        .split('\n')
        .map(line => line.replace(/^[0-9]+\.\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    res.status(200).json({ titles });
  } catch (error) {
    console.error('Error generating titles:', error);
    res.status(500).json({ error: 'Failed to generate titles' });
  }
} 