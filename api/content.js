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
    const { title, topics, keywords } = req.body;

    if (!title || !topics || !Array.isArray(topics) || !keywords || !Array.isArray(keywords)) {
      console.error('Missing required fields:', { title, topics, keywords });
      return res.status(400).json({ error: 'Title, topics array, and keywords array are required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const prompt = `Write a short, engaging piece of content (100-200 words) for the title: "${title}".
    Use these main topics as sections: ${topics.join(', ')}.
    Incorporate these keywords naturally throughout the content: ${keywords.join(', ')}.
    The content should be concise, well-structured, and optimized for SEO.
    Focus on creating an engaging introduction or meta description.
    
    Format the content using markdown with the following structure:
    1. Main title with a single # (no space after #)
    2. Introduction paragraph
    3. Section heading with ## (no space after ##)
    4. Content paragraphs
    5. Use ** for bold text (no spaces between ** and text)
    
    Example format:
    #Main Title
    
    Introduction paragraph with **bold text** for emphasis.
    
    ##Section Heading
    
    Content paragraph with more **bold text** for key points.`;

    console.log('Sending request to OpenAI with prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert content writer and SEO specialist. Write concise, engaging content (100-200 words) that incorporates keywords naturally. Use proper markdown formatting without spaces after # or **."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    console.log('OpenAI response received');

    const content = completion.choices[0].message.content;
    
    // Clean up the content while preserving markdown
    const cleanedContent = content
      .replace(/```markdown\n?/g, '')  // Remove ```markdown
      .replace(/```\n?/g, '')          // Remove ```
      .replace(/#\s+/g, '#')           // Remove spaces after #
      .replace(/\*\*\s+/g, '**')       // Remove spaces after **
      .replace(/\s+\*\*/g, '**')       // Remove spaces before **
      .replace(/\n{3,}/g, '\n\n')      // Replace multiple newlines with double newlines
      .trim();                         // Remove extra whitespace

    console.log('Content generated successfully');
    res.status(200).json({ content: cleanedContent });
  } catch (error) {
    console.error('Error in content API:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message 
    });
  }
} 