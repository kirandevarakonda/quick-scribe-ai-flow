import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, keywords, title, contentType = 'blog', wordCount = 1000 } = req.body;

    if (!topic || !keywords || !Array.isArray(keywords) || !title) {
      return res.status(400).json({ error: 'Topic, keywords array, and title are required' });
    }

    const prompt = `Write a ${contentType} post about "${topic}" with the title "${title}". 
    Use these keywords naturally throughout the content: ${keywords.join(', ')}. 
    The content should be approximately ${wordCount} words long. 
    Include an introduction, main sections with subheadings, and a conclusion. 
    Make the content engaging, informative, and optimized for both readers and search engines.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert content writer and SEO specialist. Create engaging, well-structured content that ranks well in search engines."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0].message.content;
    res.status(200).json({ content });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
} 