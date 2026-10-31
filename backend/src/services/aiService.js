import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Pull from .env and forcefully strip hidden characters (\r) or accidental quotes
const rawKey = process.env.GEMINI_API_KEY || '';
const cleanApiKey = rawKey.replace(/['"]/g, '').trim();

if (!cleanApiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is missing from the .env file!");
} else {
    console.log("Secure API Key loaded from .env. Starts with:", cleanApiKey.substring(0, 5));
}

const ai = new GoogleGenAI({ apiKey: cleanApiKey });

export const calculateATSScore = async (cvText, jobDescription) => {
    const prompt = `
    You are an expert Applicant Tracking System (ATS). 
    I will provide a Job Description and a candidate's CV text.
    
    Compare them and return a strict JSON object with the following structure:
    {
        "matchPercentage": (number between 0 and 100),
        "missingKeywords": (array of strings, up to 5 critical skills/keywords missing from the CV),
        "suggestions": (array of strings, 3 actionable tips to improve the CV for this specific role)
    }

    Job Description:
    ${jobDescription}

    CV Text:
    ${cvText}

    Return ONLY valid JSON. Do not include markdown formatting or backticks.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const rawText = response.text;
        return JSON.parse(rawText);
    } catch (error) {
        console.error("AI Service Error:", error);
        throw new Error("Failed to analyze CV with AI.");
    }
};