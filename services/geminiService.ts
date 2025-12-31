
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (topic: string): Promise<Question[]> => {
  const prompt = `Generate 5 high-quality ITIL v4 Foundation level multiple choice questions about "${topic}". 
  Each question should have 4 options and a detailed explanation of why the correct answer is right based on ITIL 4 official syllabus.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const explainConcept = async (concept: string): Promise<string> => {
  const prompt = `Explain the ITIL 4 concept of "${concept}" in simple terms for someone preparing for the Foundation exam. 
  Include real-world examples and why it matters for service management. Use Markdown for formatting.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
};
