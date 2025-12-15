import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, FortuneResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Define the response schema for strict JSON output
const fortuneSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    bazi: {
      type: Type.OBJECT,
      properties: {
        yearPillar: { type: Type.STRING, description: "Year Pillar (e.g., 甲辰)" },
        monthPillar: { type: Type.STRING, description: "Month Pillar" },
        dayPillar: { type: Type.STRING, description: "Day Pillar" },
        hourPillar: { type: Type.STRING, description: "Hour Pillar" },
        element: { type: Type.STRING, description: "Day Master Element (e.g., 壬水)" },
        animal: { type: Type.STRING, description: "Zodiac Animal (e.g., 龙)" },
      },
      required: ["yearPillar", "monthPillar", "dayPillar", "hourPillar", "element", "animal"]
    },
    chartData: {
      type: Type.ARRAY,
      description: "Array of fortune data for each year of life from age 0 to 80.",
      items: {
        type: Type.OBJECT,
        properties: {
          age: { type: Type.INTEGER },
          year: { type: Type.INTEGER },
          open: { type: Type.NUMBER, description: "Fortune score at start of year (0-100)" },
          close: { type: Type.NUMBER, description: "Fortune score at end of year (0-100)" },
          high: { type: Type.NUMBER, description: "Highest fortune point in the year (0-100)" },
          low: { type: Type.NUMBER, description: "Lowest fortune point in the year (0-100)" },
          ma5: { type: Type.NUMBER, description: "5-year moving average of fortune" },
          ma10: { type: Type.NUMBER, description: "10-year moving average (Da Yun trend)" },
          summary: { type: Type.STRING, description: "Short 3-5 word keyword for the year's luck in Chinese" },
          trend: { type: Type.STRING, enum: ["bull", "bear", "doji"] },
        },
        required: ["age", "year", "open", "close", "high", "low", "ma5", "ma10", "summary", "trend"]
      }
    },
    analysis: {
      type: Type.STRING,
      description: "A comprehensive markdown analysis of the life fortune in Chinese, highlighting golden ages (Bull Markets) and challenging periods (Bear Markets). Use financial terminology metaphors."
    },
    bullYears: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER },
      description: "List of ages representing major luck peaks/bull runs."
    },
    bearYears: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER },
      description: "List of ages representing major challenges/bear markets."
    }
  },
  required: ["bazi", "chartData", "analysis", "bullYears", "bearYears"]
};

export const generateFortuneData = async (input: UserInput): Promise<FortuneResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Role: You are an expert Master of Traditional Chinese Bazi (Four Pillars of Destiny) and a Quantitative Financial Analyst.
    
    Task: 
    1. Calculate the Bazi chart for a ${input.gender} born on ${input.birthDate} at ${input.birthTime}.
    2. Map the person's annual fortune (Yun Qi) from age 0 to 80 onto a "Stock Market K-Line Chart" structure.
    
    Guidelines:
    - **LANGUAGE: Output ALL text content (Analysis, Summaries, Bazi terms) in Simplified Chinese (简体中文).**
    - The "Price" is the Fortune Score (0-100). 50 is average. Above 80 is excellent (Bull Market). Below 30 is difficult (Bear Market).
    - Generate "Candlestick" data (Open, High, Low, Close) for EACH year based on the interaction of the person's Bazi with the Annual Pillar (Liu Nian) and 10-Year Luck Cycle (Da Yun).
    - If the year is auspicious (Good Luck), Close > Open (Red Candle).
    - If the year is inauspicious (Bad Luck), Close < Open (Green Candle).
    - Volatility (High - Low) represents the drama or changeability of that year.
    - Calculate MA5 (short term momentum) and MA10 (Da Yun/long term trend).
    - Provide a detailed textual analysis in Chinese using financial metaphors (e.g., "震荡洗盘 (Consolidation)", "主升浪 (Breakout)", "止损离场 (Stop-loss)", "历史新高 (All-time high)").
    
    Input Data:
    Name: ${input.name}
    Date: ${input.birthDate}
    Time: ${input.birthTime}
    Gender: ${input.gender}
    
    Output strictly in JSON format conforming to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: fortuneSchema,
        temperature: 0.7, 
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }
    
    return JSON.parse(text) as FortuneResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate fortune data. Please try again.");
  }
};