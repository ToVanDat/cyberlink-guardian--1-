import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SafetyStatus, NewsItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function checkLinkSafety(url: string): Promise<AnalysisResult> {
  const prompt = `
    You are a world-class cybersecurity expert. Your task is to analyze the provided URL and determine if it is safe to visit.
    Consider the following potential threats:
    - Phishing: Attempts to steal personal information.
    - Malware: Hosts or distributes malicious software.
    - Scams: Deceptive schemes to defraud users.
    - Unwanted Software: Promotes or installs deceptive software.
    - Social Engineering: Manipulates users into performing harmful actions.

    Based on your analysis, provide a JSON response with the following structure:
    {
      "safetyStatus": "SAFE", "UNSAFE", or "UNKNOWN",
      "reason": "A brief, clear explanation of your overall assessment.",
      "threats": [
        {
          "type": "Name of the threat (e.g., Phishing, Malware)",
          "description": "A detailed explanation of this specific threat and why it was flagged for this URL."
        }
      ]
    }
    If no threats are found, the "threats" array should be empty.

    URL to analyze: ${url}
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      safetyStatus: {
        type: Type.STRING,
        enum: [SafetyStatus.SAFE, SafetyStatus.UNSAFE, SafetyStatus.UNKNOWN],
        description: 'The safety status of the URL.',
      },
      reason: {
        type: Type.STRING,
        description: 'A brief explanation for the safety status.',
      },
      threats: {
        type: Type.ARRAY,
        description: 'An array of identified threats, each with a type and detailed description.',
        items: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              description: 'The category of the threat (e.g., Phishing, Malware).',
            },
            description: {
              type: Type.STRING,
              description: 'A detailed explanation of the specific threat.',
            },
          },
          required: ['type', 'description'],
        },
      },
    },
    required: ['safetyStatus', 'reason', 'threats'],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const jsonString = response.text.trim();
    const parsedResult = JSON.parse(jsonString);
    
    // Validate the parsed result matches the expected structure.
    if (!Object.values(SafetyStatus).includes(parsedResult.safetyStatus)) {
        throw new Error("Invalid safetyStatus received from API");
    }

    return parsedResult as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API for URL check:", error);
    throw new Error("Could not get a valid analysis from the AI model.");
  }
}

export async function getCybersecurityNews(): Promise<NewsItem[]> {
  const prompt = `
    You are a cybersecurity news analyst. Provide a summary of the 3 most important and recent cybersecurity news events (e.g., major data breaches, new malware discoveries, significant vulnerability reports).

    For each news item, provide a JSON object with the following structure:
    {
      "title": "A concise, compelling headline for the news event.",
      "summary": "A brief, 2-3 sentence summary of the event, explaining its significance.",
      "source": "The name of a reputable source where this was reported (e.g., 'Wired', 'Krebs on Security').",
      "publishedDate": "The approximate date of the report in YYYY-MM-DD format."
    }

    Return a JSON array containing exactly 3 of these objects.
  `;

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        source: { type: Type.STRING },
        publishedDate: { type: Type.STRING },
      },
      required: ['title', 'summary', 'source', 'publishedDate'],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as NewsItem[];
    
  } catch (error) {
    console.error("Error calling Gemini API for news:", error);
    throw new Error("Could not retrieve cybersecurity news from the AI model.");
  }
}
