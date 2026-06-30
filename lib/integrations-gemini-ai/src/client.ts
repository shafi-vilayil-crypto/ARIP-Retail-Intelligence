import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY must be set. Please add your Google Gemini API key as a secret.",
  );
}

const httpOptions = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL
  ? { apiVersion: "", baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL }
  : undefined;

export const ai = new GoogleGenAI({ apiKey, httpOptions });
