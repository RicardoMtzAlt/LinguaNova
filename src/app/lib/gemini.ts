// src/app/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY no está definida en el archivo .env");
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });