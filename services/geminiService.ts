import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const estimateQuote = async (
  imageBase64: string,
  userDescription: string
): Promise<{ priceRange: string; reasoning: string; planRecommendation: string }> => {
  
  // Prepare the prompt
  const prompt = `
    You are a professional junk removal estimator. Analyze the provided image and the user's description.
    
    User Description: "${userDescription}"
    
    Based on the volume and type of items visible in the image (or described), estimate the cost and recommend a truck plan.
    
    Our Plans:
    1. Light Truck Plan (Small volume, approx 10,000 - 20,000 JPY)
    2. 1-Ton Truck Plan (Medium volume, approx 25,000 - 45,000 JPY)
    3. 2-Ton Truck Plan (Large volume, approx 50,000 - 80,000 JPY)

    Provide a JSON response with:
    - priceRange: Estimated price range (e.g., "15,000円 - 20,000円")
    - planRecommendation: Which plan fits best (e.g., "軽トラパック")
    - reasoning: Brief explanation of the estimate (max 100 characters, in Japanese).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity, can be dynamic
              data: imageBase64
            }
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priceRange: { type: Type.STRING },
            planRecommendation: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    
    throw new Error("No response text from AI");

  } catch (error) {
    console.error("Gemini Estimation Error:", error);
    return {
      priceRange: "要見積もり",
      planRecommendation: "担当者確認中",
      reasoning: "画像の解析に失敗しました。担当者が確認後に正確な見積もりをお出しします。"
    };
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    // Iterate through parts to find the inline image data
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
