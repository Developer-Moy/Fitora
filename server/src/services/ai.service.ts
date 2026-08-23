import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function generateAiFitnessResponse(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "Fitora AI Coach: Please configure your GEMINI_API_KEY in server/.env.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are Fitora AI Coach, an expert fitness trainer, nutritionist, and physical recovery guide. Give clear, energetic, concise, actionable advice formatted in Markdown.\n\nUser Question: ${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data: any = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
  } catch (error) {
    console.error("[AI Service Error]:", error);
  }

  return "Fitora AI Coach: Stay focused on progressive overload! Ensure adequate protein intake (1.6-2.2g per kg bodyweight) and 7-8 hours of sleep for recovery.";
}

export default { generateAiFitnessResponse };
