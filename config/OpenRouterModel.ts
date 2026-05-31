import OpenAI from "openai";

export const openRouter = new OpenAI({
  
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", //  Helps OpenRouter rank your app
    "X-Title": "Agent Builder",             // Your application name
  },
});