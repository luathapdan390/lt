
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = transactions.map(t => ({
    type: t.income ? "Income" : "Expense",
    amount: t.income || t.expense,
    desc: t.explanation,
    date: t.date
  }));

  const prompt = `
    Based on the following personal financial transactions, provide 3 actionable pieces of advice to improve financial health. 
    Analyze spending trends and identify potential savings. Keep it professional but encouraging.
    
    Transactions:
    ${JSON.stringify(summary, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        systemInstruction: "You are a professional financial advisor specializing in personal budgeting and saving strategies."
      }
    });

    return response.text || "I couldn't generate advice at this time. Try adding more transactions!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI financial advisor is currently offline. Please check your budget manually.";
  }
};
