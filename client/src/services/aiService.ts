const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface AiChatResponse {
  success: boolean;
  message?: string;
  data?: {
    id?: string;
    promptText: string;
    responseText: string;
    mode: "chat" | "coach";
    sessionId?: string;
    timestamp: string;
  };
  error?: string;
}

export async function sendAiChatApi(
  prompt: string,
  mode: "chat" | "coach" = "chat",
  sessionId?: string,
  userId?: string,
): Promise<AiChatResponse> {
  try {
    const res = await fetch(`${API_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptText: prompt,
        prompt,
        mode,
        sessionId,
        userId,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      return {
        success: false,
        error:
          data?.message || data?.error || "AI server temporarily unavailable",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return {
      success: false,
      error: error.message || "Network error — could not reach AI service",
    };
  }
}
