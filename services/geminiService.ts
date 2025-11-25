import { GoogleGenAI } from "@google/genai";
import { SelectedCard, ReadingResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTarotReading = async (
  question: string,
  cards: SelectedCard[]
): Promise<ReadingResult> => {
  const model = 'gemini-2.5-flash';
  
  const cardDescriptions = cards.map(c => 
    `${c.position}位置 (The ${c.position}): ${c.name} (${c.nameEn}) - ${c.isReversed ? '逆位 (Reversed)' : '正位 (Upright)'}`
  ).join('\n');

  const prompt = `
    你是一位神秘、睿智且富有同理心的大师级塔罗占星师。
    求问者的问题是: "${question}"
    
    牌阵 (圣三角 - 过去/现在/未来):
    ${cardDescriptions}
    
    请根据牌阵和问题进行深度解读。解读风格应当具有神秘感、艺术感，语言优美流畅（使用中文）。
    
    请严格按照以下 JSON 格式返回结果 (不要包含 Markdown 代码块标记，只返回纯 JSON):
    {
      "summary": "一句话的命运启示，富有哲理。",
      "details": {
        "past": "对过去因果的深度分析。",
        "present": "对当前处境和挑战的洞察。",
        "future": "对未来趋势的预测和指引。"
      },
      "advice": "给求问者的最终建议和行动指南。"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as ReadingResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: "星辰此刻沉默不语...",
      details: {
        past: "迷雾遮蔽了过去。",
        present: "当下混沌不清。",
        future: "未来尚待揭晓。"
      },
      advice: "请稍后再次尝试连接宇宙能量。"
    };
  }
};