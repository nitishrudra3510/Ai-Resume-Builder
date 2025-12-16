import { Gem } from "lucide-react";
import { GEMENI_API_KEY } from "../config/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = GEMENI_API_KEY;
// Initialize the GoogleGenerativeAI client using the object form (some versions expect { apiKey })
const genAI = new GoogleGenerativeAI({ apiKey });

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.2,
  topP: 0.8,
  maxOutputTokens: 200,
  responseMimeType: "application/json",
};

// In-memory cache for prompt responses (3-minute TTL)
const promptCache = new Map();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes in milliseconds

const getCachedResponse = (prompt) => {
  if (promptCache.has(prompt)) {
    const cached = promptCache.get(prompt);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.response;
    } else {
      promptCache.delete(prompt);
    }
  }
  return null;
};

const setCachedResponse = (prompt, response) => {
  promptCache.set(prompt, {
    response,
    timestamp: Date.now(),
  });
};

// Create wrapper to handle caching
const cachedChat = {
  sendMessage: async (prompt) => {
    const cached = getCachedResponse(prompt);
    if (cached) {
      return cached;
    }
    const session = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await session.sendMessage(prompt);
    setCachedResponse(prompt, result);
    return result;
  },
};

// Export cachedChat as the public chat session to ensure callers use caching
export const AIChatSession = cachedChat;

// Also export a raw session factory if other code needs direct session access
export const createRawChatSession = () =>
  model.startChat({ generationConfig, history: [] });

export { getCachedResponse, setCachedResponse, cachedChat };
