import { Request, Response } from "express";
import { AiMessage } from "../models/AiMessage.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { successResponse, errorResponse } from "../utils/apiResponse";

/**
 * High-performance Domain-Specific Fitness AI Reasoning Engine
 */
const generateIntelligentFitnessResponse = (
  prompt: string,
  mode: "chat" | "coach" = "chat",
): string => {
  const lower = prompt.toLowerCase();

  if (mode === "coach") {
    if (
      lower.includes("loss") ||
      lower.includes("fat") ||
      lower.includes("cut") ||
      lower.includes("weight")
    ) {
      return "🔥 Fat Loss & Lean Definition Blueprint:\n• Nutrition: 350-500 kcal deficit with 2.0g protein/kg bodyweight.\n• Training: 4-Day Push/Pull Resistance split + 25 mins Zone 2 LISS cardio 3x weekly.\n• Hydration: 3.5 Liters of water daily to maintain metabolic rate.";
    }
    if (
      lower.includes("muscle") ||
      lower.includes("bulk") ||
      lower.includes("hypertrophy") ||
      lower.includes("gain")
    ) {
      return "⚡ Hypertrophy & Muscle Mass Blueprint:\n• Nutrition: 250-350 kcal clean surplus, 40% Carbs / 30% Protein / 30% Fats.\n• Training: 5-Day Compound Split (Chest/Back/Legs/Shoulders/Arms), 8-12 rep range with 2-3 mins rest.\n• Progressive Overload: Add 1.25kg - 2.5kg or +1 rep every week.";
    }
    if (
      lower.includes("strength") ||
      lower.includes("power") ||
      lower.includes("1rm")
    ) {
      return "🏋️ Strength & Power Lifting Protocol:\n• Focus: Squat, Bench Press, Deadlift, Overhead Press in 3-5 rep range.\n• Rest: 3-5 minutes between maximal compound sets.\n• Target RPE: 8-9 (leave 1-2 reps in reserve on working sets).";
    }
    return "🎯 Personalized Coaching Blueprint:\n• Priority: Consistency, progressive overload, and micronutrient density.\n• Routine: 4-day Upper/Lower or 6-day PPL tailored to your lifestyle.\n• Check your calorie & macro split in the BMI & Calorie Calculator tab!";
  }

  // General Chat Mode
  if (
    lower.includes("chest") ||
    lower.includes("push") ||
    lower.includes("bench")
  ) {
    return "For peak Chest development: Perform 4 sets of Barbell Bench Press (6-8 reps), 3 sets of Incline Dumbbell Press (8-10 reps), 3 sets of Cable Flyes (12-15 reps), and 3 sets of Dips. Retract your scapula and maintain a controlled 2-second eccentric lowering!";
  }

  if (
    lower.includes("back") ||
    lower.includes("pull") ||
    lower.includes("deadlift") ||
    lower.includes("lats")
  ) {
    return "For a wide, dense Back: 4 sets of Lat Pulldowns (8-10 reps), 4 sets of Barbell Bent-over Rows (8-10 reps), 3 sets of Seated Cable Rows (12 reps), and 3 sets of Face Pulls. Focus on driving your elbows back and squeezing the shoulder blades!";
  }

  if (
    lower.includes("leg") ||
    lower.includes("squat") ||
    lower.includes("quads") ||
    lower.includes("hamstring")
  ) {
    return "For powerful Legs: 4 sets of Barbell Back Squats (6-8 reps), 3 sets of Romanian Deadlifts (8-10 reps), 3 sets of Leg Press (12-15 reps), and 4 sets of Standing Calf Raises. Keep your heels planted and maintain core brace!";
  }

  if (
    lower.includes("protein") ||
    lower.includes("diet") ||
    lower.includes("macro") ||
    lower.includes("meal") ||
    lower.includes("food")
  ) {
    return "For optimal muscle synthesis, consume 1.6 to 2.2g of protein per kg of bodyweight daily. Top sources: Chicken breast, eggs, fish, lentils (dal), chickpeas, Greek yogurt, and whey protein isolate. Distribute protein evenly across 3-4 meals.";
  }

  if (
    lower.includes("recovery") ||
    lower.includes("sore") ||
    lower.includes("sleep") ||
    lower.includes("rest")
  ) {
    return "Optimal Muscle Recovery requires: 7-9 hours of uninterrupted deep sleep, 3.5L of water daily, post-workout protein + carb replenishment within 2 hours, and active recovery walks on rest days.";
  }

  if (
    lower.includes("creatine") ||
    lower.includes("supplement") ||
    lower.includes("whey") ||
    lower.includes("pre workout")
  ) {
    return "Evidence-based supplement stack: 1. Creatine Monohydrate (5g daily, anytime) for ATP power. 2. Whey Protein for convenient post-workout recovery. 3. Multivitamin & Omega-3 for joint health.";
  }

  return "Welcome to FITORA AI! I am your 24/7 fitness & bodybuilding assistant. Ask me anything about workout routines, nutrition macros, exercise technique, or recovery!";
};

/**
 * 1. Handle AI Chat & Coach Queries (`POST /api/ai/chat`)
 */
export const handleAiChat = async (req: Request, res: Response) => {
  try {
    const promptText = req.body.promptText || req.body.prompt || req.body.text;
    const mode = (req.body.mode === "coach" ? "coach" : "chat") as
      | "chat"
      | "coach";
    const sessionId = req.body.sessionId || `SESSION_${Date.now()}`;
    const userId = req.body.userId || (req as AuthRequest).user?.userId;

    if (
      !promptText ||
      typeof promptText !== "string" ||
      promptText.trim().length === 0
    ) {
      return res.status(400).json(
        errorResponse("Prompt text is required.", "VALIDATION_ERROR", 400)
      );
    }

    const cleanPrompt = promptText.trim();
    let responseText = "";

    // Optional Google Gemini API Call if Key is present
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.startsWith("AIzaSy")) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are FITORA AI, a world-class certified fitness trainer, bodybuilding coach, and sports nutritionist for the FITORA gym network in Bangladesh. Mode: ${mode}. User query: "${cleanPrompt}". Provide a concise, highly motivating, structured, and actionable answer with bullet points if appropriate (max 4-5 sentences).`,
                  },
                ],
              },
            ],
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            responseText = candidateText.trim();
          }
        }
      } catch (geminiError) {
        // Fall back gracefully to local reasoning engine
      }
    }

    // Heuristic Fallback
    if (!responseText) {
      responseText = generateIntelligentFitnessResponse(cleanPrompt, mode);
    }

    // Persist to MongoDB
    let savedRecord = null;
    try {
      savedRecord = await AiMessage.create({
        ...(userId && { userId }),
        sessionId,
        mode,
        promptText: cleanPrompt,
        responseText,
        sender: "ai",
      });
    } catch (dbErr) {
      console.warn("AiMessage DB Save Notice:", dbErr);
    }

    return res.status(200).json(
      successResponse("AI response generated successfully.", {
        id: savedRecord?._id || Date.now().toString(),
        promptText: cleanPrompt,
        responseText,
        mode,
        sessionId,
        timestamp: new Date().toISOString(),
      })
    );
  } catch (error: any) {
    console.error("Error in handleAiChat:", error);
    return res.status(500).json(
      errorResponse(
        "Internal server error while processing AI chat request.",
        error.message,
        500
      )
    );
  }
};

/**
 * 2. Get AI Chat History (`GET /api/ai/history`)
 */
export const getAiHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, limit = "30" } = req.query;
    const userId = req.user?.userId;

    const query: any = {};
    if (userId) {
      query.userId = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
    }

    const limitNum = parseInt(String(limit), 10) || 30;

    const history = await AiMessage.find(query)
      .sort({ createdAt: 1 })
      .limit(limitNum);

    return res.status(200).json(
      successResponse("AI chat history retrieved successfully", {
        count: history.length,
        history,
      })
    );
  } catch (error: any) {
    console.error("Error fetching AI history:", error);
    return res.status(500).json(
      errorResponse(
        "Internal server error while fetching AI history.",
        error.message,
        500
      )
    );
  }
};

export default {
  handleAiChat,
  getAiHistory,
};
