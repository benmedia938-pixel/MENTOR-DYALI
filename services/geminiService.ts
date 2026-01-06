import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MODEL_CHAT, SYSTEM_INSTRUCTION } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const sendMessageToMentor = async (
  message: string, 
  history: { role: 'user' | 'model'; text: string }[],
  imageBase64?: string,
  mimeType?: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Convert history to Gemini format (simplification for single turn or short context)
    // Ideally we use chats.create but for stateless simplicity here we prepend context if needed
    // or rely on the chat object if we maintained it. 
    // For this implementation, we will use a fresh generation to ensure system instruction adherence every time 
    // or use chat.create if we want to keep history. Let's use chat.create.

    const chat = ai.chats.create({
      model: MODEL_CHAT,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balanced for creativity + strictness
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    let result: GenerateContentResponse;

    if (imageBase64 && mimeType) {
        // If image is present, we might need to use generateContent directly as chat history with images 
        // can be tricky depending on SDK version, but let's try sending it as a message part.
        result = await chat.sendMessage({
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: message },
                        { inlineData: { mimeType, data: imageBase64 } }
                    ]
                }
            ]
        });
    } else {
        result = await chat.sendMessage({
            message: message
        });
    }

    return result.text || "سمح ليا، وقع شي مشكل تقني. عاود صيفط ليا.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to the Mentor. Please check your connection.";
  }
};

export const analyzeFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        const ai = getAiClient();
        
        const prompt = `
        Analyze this uploaded file.
        Output format:
        1. Title + short 1-line gist (Darija).
        2. 5 key insights (bullet points).
        3. 7 action items ranked by impact (include step-by-step for top 2).
        4. Suggested 3 quick A/B tests.
        5. One-paragraph one-week execution plan with metrics.
        `;

        const response = await ai.models.generateContent({
          model: MODEL_CHAT,
          config: { systemInstruction: SYSTEM_INSTRUCTION },
          contents: {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: file.type, data: base64Data } }
            ]
          }
        });

        resolve(response.text || "Could not analyze file.");
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
