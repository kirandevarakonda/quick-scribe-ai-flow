
const EDGE_FUNCTION_URL = "/functions/v1/generate-content"; // Supabase Edge Function path

const apiFetch = async (step: string, data: any) => {
  const res = await fetch(EDGE_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step, ...data }),
  });

  if (!res.ok) {
    // Add specific error for 404 and log extra diagnostics info
    if (res.status === 404) {
      console.error(
        `[API] Edge Function not found (404). 
Make sure your Supabase edge function is deployed as 'generate-content'.
Run: supabase functions deploy generate-content
See: https://docs.lovable.dev/integrations/supabase/functions
`
      );
      throw new Error("Supabase Edge Function not found (404). Please deploy your function.");
    }
    // For other failures, log the server response
    const errorText = await res.text();
    console.error(`[API] Failed API call for step '${step}': ${errorText}`);
    throw new Error("API call failed");
  }
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
