
import { GoogleGenAI } from "@google/genai";

export async function askLiaAI(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Você é a LIA AI, uma assistente divertida e amigável do app FRINDER. Seu objetivo é ajudar usuários a fazerem amizades, tirar dúvidas sobre o app e dar dicas de conversas. Seja jovem, use emojis e seja muito acolhedora.",
      }
    });
    return response.text || "Puxa, deu um branco agora! Tenta perguntar de novo? 😅";
  } catch (error) {
    console.error("Lia AI Error:", error);
    return "Desculpa, estou meio offline agora. Tenta de novo em um minutinho! 💖";
  }
}
