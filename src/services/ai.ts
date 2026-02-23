import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(API_KEY);

export const aiService = {
    async getChatResponse(message: string) {
        if (!API_KEY) {
            return "Please set your VITE_GEMINI_API_KEY in the .env file to enable the AI Chat.";
        }

        // Try these confirmed models in order of reliability
        const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest", "gemini-pro-latest"];
        let lastError: any = null;

        const systemPrompt = "You are StudyLite AI, a premium, encouraging, and concise study assistant. Your goal is to help users learn efficiently. Use punchy formatting, bold key terms, and bold key terms using markdown. If asked for a quiz, give 3-5 questions. Support Markdown formatting.";

        for (const modelName of modelsToTry) {
            try {
                console.log(`[StudyLite AI] Attempting contact with ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });

                // Prepend system prompt to the user message for better compatibility
                const prompt = `${systemPrompt}\n\nUser Question: ${message}`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                console.log(`[StudyLite AI] Success using ${modelName}`);
                return response.text();
            } catch (error: any) {
                lastError = error;
                console.error(`[StudyLite AI] Error with ${modelName}:`, error.message);
            }
        }

        return `StudyLite AI Error: Connection failed. (Error: ${lastError?.message || "Unknown error"})`;
    },

    async processStudyMaterial(content: string) {
        if (!API_KEY) {
            throw new Error("API Key missing");
        }

        const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest", "gemini-pro-latest"];
        let lastError: any = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`[StudyLite AI] Processing study material with ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const prompt = `
                    Analyze the following study material and provide a structured JSON response.
                    Focus on making it "StudyLite" style: clear, concise, and easy to memorize.
                    
                    Material:
                    ${content}
                    
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

                // Extract JSON if AI includes markdown code blocks
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                const jsonData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

                console.log(`[StudyLite AI] Material processing success with ${modelName}`);
                return jsonData;
            } catch (error: any) {
                lastError = error;
                console.error(`[StudyLite AI] Material error with ${modelName}:`, error.message);
            }
        }

        throw lastError || new Error("Failed to process study material after multiple attempts.");
    }
};
