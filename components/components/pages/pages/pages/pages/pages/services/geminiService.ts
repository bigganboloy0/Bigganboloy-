import { GoogleGenAI } from "@google/genai";

// আপনার দেওয়া জিমিনি API Key
const apiKey = 'AIzaSyBt8U8V3i8uHAAiWwtH1vdb0UtrfgBWidE';

const ai = new GoogleGenAI({ apiKey });

export const generateBlogContent = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a comprehensive and engaging blog post section about "${topic}" in Bengali language. Keep it scientific but easy to understand. Use Markdown formatting. Max 300 words.`,
    });
    return response.text || "দুঃখিত, কন্টেন্ট জেনারেট করা সম্ভব হয়নি।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "নেটওয়ার্ক সমস্যা বা API কোটার কারণে কন্টেন্ট জেনারেট করা যায়নি। দয়া করে কিছুক্ষণ পর চেষ্টা করুন।";
  }
};

export const suggestTags = async (content: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following Bengali text and suggest 3-5 relevant single-word tags in Bengali. Return ONLY a comma-separated list. Text: ${content.substring(0, 500)}`,
    });
    const text = response.text || "";
    return text.split(',').map(t => t.trim());
  } catch (error) {
    console.error("Tag Generation Error:", error);
    return ['বিজ্ঞান', 'প্রযুক্তি'];
  }
};
