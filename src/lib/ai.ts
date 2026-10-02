import { createGroq } from "@ai-sdk/groq";

export const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

export const groqModel = groq("openai/gpt-oss-20b");
