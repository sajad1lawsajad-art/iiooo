import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateExamQuestions = async (topic: string, count: number = 3): Promise<Question[]> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate ${count} difficult academic exam questions in Arabic for a university Law faculty about the topic: "${topic}". Return only the questions array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The exam question text in Arabic" }
            },
            required: ["text"]
          }
        }
      }
    });

    const rawData = response.text;
    if (!rawData) return [];
    
    const parsed = JSON.parse(rawData) as { text: string }[];
    
    return parsed.map((q, index) => ({
      id: Date.now().toString() + index,
      text: q.text
    }));

  } catch (error) {
    console.error("Failed to generate questions", error);
    throw error;
  }
};