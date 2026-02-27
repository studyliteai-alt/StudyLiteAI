import { GoogleGenerativeAI } from "@google/generative-ai";
import DOMPurify from "dompurify";

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(API_KEY);

// Ordered by speed/quality. Each has its own per-model free-tier quota,
// so exhausting one (429) does not affect the others.
// gemini-2.5-pro-exp is free during the experimental period.
const MODELS = [
    "gemini-2.5-pro-exp-03-25",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
];

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Parses the suggested retry delay from a Gemini 429 error message.
 * The API embeds a retryDelay like `"retryDelay":"5s"` in the JSON body.
 * Falls back to 8 seconds if it can't be parsed.
 */
const parseRetryDelay = (errorMessage: string): number => {
    const match = errorMessage?.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/);
    if (match) {
        const seconds = parseFloat(match[1]);
        // Add a small buffer (+1s) and cap between 3s–60s
        return Math.min(Math.max(Math.ceil(seconds) + 1, 3), 60) * 1000;
    }
    return 8000; // conservative fallback
};

/** Security: Max input sizes to prevent prompt injection and abuse */
const MAX_MESSAGE_LENGTH = 4000;
const MAX_CONTENT_LENGTH = 8000;

/** Sanitizes user content to remove HTML/script injection — uses DOMPurify */
const sanitizeInput = (text: string, maxLength: number): string => {
    const clean = typeof window !== 'undefined'
        ? DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
        : text.replace(/[<>"'/]/g, ''); // SSR fallback
    return clean.slice(0, maxLength);
};

export const aiService = {
    async getChatResponse(message: string, userProfile?: any) {
        if (!API_KEY) {
            return "AI Chat is not configured. Please contact support.";
        }

        const safeMessage = sanitizeInput(message, MAX_MESSAGE_LENGTH);
        const displayName = sanitizeInput(userProfile?.displayName || 'a student', 100);

        const systemPrompt = `You are StudyLite AI, a premium, encouraging, and concise study assistant for ${displayName}. 
        User Context: Name: ${displayName}, Goal: Academic Excellence. 
        Your goal is to help users learn efficiently. Use punchy formatting, bold key terms, and bold key terms using markdown. If asked for a quiz, give 3-5 questions. Support Markdown formatting.`;

        let lastError: any = null;
        for (const modelName of MODELS) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const prompt = `${systemPrompt}\n\nUser Question: ${safeMessage}`;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            } catch (error: any) {
                lastError = error;
                const is429 = error.message?.includes('429');
                const is404 = error.message?.includes('404');
                if (!is429 && !is404) break; // Non-retryable error
                // Use the delay the API suggests, with a small safety buffer
                await wait(is429 ? parseRetryDelay(error.message) : 200);
            }
        }

        // Log full error internally, never expose to client
        console.error("[aiService] Chat failed after all models:", lastError?.message);

        if (lastError?.message?.includes('leaked')) {
            return "AI service is temporarily unavailable. Please contact support.";
        }
        if (lastError?.message?.includes('429')) {
            return "StudyLite AI is at capacity right now — all models are busy. Please try again in a moment.";
        }

        return "Something went wrong with the AI service. Please try again.";
    },

    async processStudyMaterial(content: string, userProfile?: any) {
        if (!API_KEY) {
            throw new Error("AI service is not configured.");
        }

        const safeContent = sanitizeInput(content, MAX_CONTENT_LENGTH);
        const displayName = sanitizeInput(userProfile?.displayName || 'the student', 100);

        let lastError: any = null;
        for (const modelName of MODELS) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const prompt = `
                    Analyze the following study material for ${displayName} and provide a structured JSON response.
                    Focus on making it "StudyLite" style: clear, concise, and easy to memorize.
                    
                    Material:
                    ${safeContent}
                    
                    Return ONLY a JSON object with this structure:
                    {
                        "summary": "A concise overview in 3-4 bullet points",
                        "examPoints": [
                            { "title": "Key Term/Concept", "desc": "Short explanation" }
                        ],
                        "quiz": [
                            { "question": "Question text", "options": ["A", "B", "C", "D"], "correctIndex": 0 }
                        ]
                    }
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                const cleanJson = jsonMatch ? jsonMatch[0].trim() : text.trim();
                const jsonData = JSON.parse(cleanJson);
                return jsonData;
            } catch (error: any) {
                lastError = error;
                console.warn(`[aiService] Material error with ${modelName}:`, error.message);
                const is429 = error.message?.includes('429');
                const is404 = error.message?.includes('404');
                if (!is429 && !is404) break;
                await wait(is429 ? parseRetryDelay(error.message) : 200);
            }
        }

        console.error("[aiService] processStudyMaterial failed:", lastError?.message);
        throw new Error("Failed to process study material. Please try again.");
    }
};
