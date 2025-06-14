
import { serve } from "std/server";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const { step, seedKeyword, keyword, title, topic } = await req.json();

  // Load secret from the environment
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return new Response("OpenAI API key not set", { status: 500 });
  }

  let body: any;
  let prompt = "";

  if (step === "keywords" && seedKeyword) {
    prompt = `Suggest 5 related keywords for "${seedKeyword}" for digital marketing purposes. Respond as a JSON array of strings, no extra text.`;
  } else if (step === "titles" && keyword) {
    prompt = `Generate 3 professional SEO-optimized blog post titles for the keyword "${keyword}". Respond as a JSON array of strings, no extra text.`;
  } else if (step === "topics" && keyword && title) {
    prompt = `Suggest 2 blog outline topics or section headings for a post titled "${title}" about "${keyword}". Respond as a JSON array of strings, no extra text.`;
  } else if (step === "content" && keyword && title && topic) {
    prompt = `Write a short (100-200 word) professional blog introduction for a post titled "${title}", about "${keyword}", focusing on this topic: "${topic}". Make it SEO optimized and engaging.`;
  } else {
    return new Response("Invalid request", { status: 400 });
  }

  body = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 400,
  };

  try {
    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await result.json();
    const message = json.choices?.[0]?.message?.content?.trim();

    // Parse array response if necessary
    if (step !== "content") {
      try {
        const arr = JSON.parse(message!);
        return new Response(JSON.stringify(arr), {
          headers: { "Content-Type": "application/json" }
        });
      } catch {
        return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" }, status: 200 });
      }
    } else {
      return new Response(JSON.stringify({ content: message }), {
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err) {
    return new Response("Failed to call OpenAI", { status: 500 });
  }
});
