
const EDGE_FUNCTION_URL = "/functions/v1/generate-content"; // Supabase Edge Function path

const apiFetch = async (step: string, data: any) => {
  const res = await fetch(EDGE_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step, ...data }),
  });
  if (!res.ok) throw new Error("API call failed");
  return res.json();
};

// Connects to edge function for keywords, titles, topics, content
export const generateKeywords = async (seedKeyword: string): Promise<string[]> => {
  return apiFetch("keywords", { seedKeyword });
};

export const generateTitles = async (keyword: string): Promise<string[]> => {
  return apiFetch("titles", { keyword });
};

export const generateTopics = async (title: string, keyword: string): Promise<string[]> => {
  return apiFetch("topics", { title, keyword });
};

export const generateContent = async (topic: string, keyword: string, title: string): Promise<string> => {
  const res = await apiFetch("content", { topic, keyword, title });
  return res.content as string;
};
