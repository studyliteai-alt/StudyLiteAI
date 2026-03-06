import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const aiService = {
    async getChatResponse(messages: { role: 'user' | 'model', content: string }[]) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const chat = model.startChat({
                history: messages.slice(0, -1).map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }],
                })),
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const result = await chat.sendMessage(messages[messages.length - 1].content);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI Service Error:", error);
            throw new Error("Failed to get response from AI Tutor. Please check your API key.");
        }
    },

    async summarizeText(text: string) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Summarize the following study material into key bullet points and a brief overview:\n\n${text}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI Summarization Error:", error);
            throw error;
        }
    }
};
