import { Request, Response } from "express";
import AiMessage from "../models/AiMessage.model";

/**
 * Generate intelligent fitness trainer response based on prompt text
 */
const generateTrainerResponse = (prompt: string): string => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("chest") || lowerPrompt.includes("push")) {
    return "For a high-intensity Chest & Push workout, try: 4 sets of Barbell Bench Press (8-10 reps), 3 sets of Incline Dumbbell Press (10-12 reps), 3 sets of Cable Flyes (12-15 reps), and 3 sets of Triceps Dips to finish. Rest 90 seconds between compound sets!";
  }

  if (lowerPrompt.includes("back") || lowerPrompt.includes("pull")) {
    return "For an effective Back & Pull routine: 4 sets of Lat Pulldowns (8-10 reps), 3 sets of Bent-Over Barbell Rows (10-12 reps), 3 sets of Seated Cable Rows (12 reps), and 3 sets of Bicep Hammer Curls. Focus on squeezing your scapula!";
  }

  if (lowerPrompt.includes("leg") || lowerPrompt.includes("squat")) {
    return "For Leg Day power: 4 sets of Barbell Back Squats (6-8 reps), 3 sets of Romanian Deadlifts (10 reps), 3 sets of Leg Press (12-15 reps), and 4 sets of Standing Calf Raises. Keep your core tight and maintain depth!";
  }

  if (lowerPrompt.includes("macro") || lowerPrompt.includes("diet") || lowerPrompt.includes("protein")) {
    return "To optimize muscle recovery, target 1.6 to 2.2 grams of protein per kg of body weight daily. Balance your macro split with 40% Protein, 35% Complex Carbohydrates, and 25% Healthy Fats.";
  }

  if (lowerPrompt.includes("bmi") || lowerPrompt.includes("weight")) {
    return "Consistency is key to body composition goals! Track your daily TDEE (Total Daily Energy Expenditure), maintain a 300-500 calorie deficit for fat loss, or a 250 calorie surplus for lean muscle gain.";
  }

  return `Thanks for asking! As your Fitora AI Trainer, I recommend focusing on progressive overload, staying hydrated with at least 3L of water daily, and aiming for 7-8 hours of quality sleep for peak recovery.`;
};

/**
 * Controller to handle incoming AI Trainer chat prompts
 * @route POST /api/ai/chat
 */
export const handleAiChat = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { promptText, userId } = req.body;

    if (!promptText || typeof promptText !== "string" || promptText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Prompt text is required and cannot be empty.",
      });
    }

    const trimmedPrompt = promptText.trim();
    const responseText = generateTrainerResponse(trimmedPrompt);

    // If userId is provided, persist chat history to MongoDB
    let savedMessage = null;
    if (userId) {
      try {
        savedMessage = await AiMessage.create({
          userId,
          promptText: trimmedPrompt,
          responseText,
          sender: "ai",
        });
      } catch (dbError) {
        console.warn("AiMessage DB Save Warning (Continuing without persistence):", dbError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "AI Trainer response generated successfully.",
      data: {
        promptText: trimmedPrompt,
        responseText,
        sender: "ai",
        savedMessageId: savedMessage ? savedMessage._id : null,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error in handleAiChat controller:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error while generating AI response.",
      details: error.message || "An unexpected error occurred.",
    });
  }
};

export default {
  handleAiChat,
};
