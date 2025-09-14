import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ProductAnalysis, VulnerableMode } from "../types";
import { GEMINI_MODEL } from "../constants";
import { translations } from "../translations";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        product: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "The full name of the product." },
                brand: { type: Type.STRING, description: "The brand name of the product." },
                category: { type: Type.STRING, description: "e.g., 'All-Purpose Cleaner', 'Shampoo', 'Laundry Detergent'." },
            },
             required: ["name", "brand", "category"],
        },
        analysis: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER, description: "Overall safety score from 0 (most hazardous) to 100 (safest)." },
                grade: { type: Type.STRING, description: "A grade based on the score: 'Safe', 'Caution', or 'High Risk'." },
                summary: { type: Type.STRING, description: "A concise, 3-sentence summary of the key findings for a layperson." },
                notes: { type: Type.STRING, description: "Any uncertainties, missing ingredients, or assumptions made during analysis. If none, state 'No specific issues to note.'" },
                mitigationTips: {
                    type: Type.ARRAY,
                    description: "If the product grade is 'Caution' or 'High Risk', provide a list of 2-4 actionable tips for users to minimize exposure and risk (e.g., 'Ensure good ventilation during use', 'Wear gloves to avoid skin contact', 'Rinse surfaces thoroughly after use'). If the grade is 'Safe', return an empty array.",
                    items: {
                        type: Type.STRING
                    }
                }
            },
            required: ["score", "grade", "summary", "notes", "mitigationTips"],
        },
        ingredients: {
            type: Type.ARRAY,
            description: "List of all identified ingredients with their individual risk assessment.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    riskLevel: { type: Type.STRING, description: "'Low', 'Moderate', or 'High'" },
                    reason: { type: Type.STRING, description: "Brief explanation of the ingredient's potential risks." },
                    concentrationRange: { type: Type.STRING, description: "Typical concentration range in this type of product, e.g., '0.1% - 1%'. Can be 'N/A' if not applicable or unknown." },
                    hazards: {
                        type: Type.ARRAY,
                        description: "List of specific hazard classifications, e.g., 'Skin Irritant', 'Carcinogen', 'Endocrine Disruptor'. Return an empty array if none apply.",
                        items: {
                            type: Type.STRING,
                        }
                    }
                },
                required: ["name", "riskLevel", "reason"],
            }
        },
        incidents: {
            type: Type.ARRAY,
            description: "List of past recalls, violations, or accidents associated with the product or manufacturer. If none are found, return an empty array.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "'Recall', 'Violation', or 'Accident'" },
                    date: { type: Type.STRING, description: "Date of the incident (YYYY-MM-DD)." },
                    summary: { type: Type.STRING, description: "A short summary of the incident." }
                },
                required: ["type", "date", "summary"],
            }
        },
        alternatives: {
            type: Type.ARRAY,
            description: "Up to 3 recommended safer alternative products.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    brand: { type: Type.STRING },
                    reason: { type: Type.STRING, description: "Why this alternative is considered safer (e.g., 'Fragrance-free', 'Uses plant-based surfactants', 'Fully recyclable packaging')." }
                },
                required: ["name", "brand", "reason"],
            }
        },
        environmentalImpact: {
            type: Type.OBJECT,
            description: "Analysis of the product's environmental impact.",
            properties: {
                score: { type: Type.INTEGER, description: "Overall environmental score from 0 (most harmful) to 100 (most eco-friendly)." },
                grade: { type: Type.STRING, description: "A grade based on the score: 'Eco-Friendly', 'Moderate Impact', or 'High Impact'." },
                summary: { type: Type.STRING, description: "A concise, 2-3 sentence summary of the environmental findings." },
                packagingRecyclability: { type: Type.STRING, description: "Description of the packaging's recyclability (e.g., 'Fully recyclable PET bottle', 'Mixed materials, difficult to recycle')." },
                keyFactors: {
                    type: Type.ARRAY,
                    description: "List of key factors influencing the environmental score, both positive and negative (e.g., 'Contains biodegradable surfactants', 'Uses non-recyclable packaging').",
                    items: {
                        type: Type.STRING,
                    }
                },
                safeDisposalTip: { type: Type.STRING, description: "A brief, actionable tip on how to safely and responsibly dispose of the product and its packaging." }
            },
            required: ["score", "grade", "summary", "packagingRecyclability", "keyFactors", "safeDisposalTip"],
        }
    },
    required: ["product", "analysis", "ingredients", "incidents", "alternatives", "environmentalImpact"],
};


const buildPrompt = (
    vulnerableModes: VulnerableMode[] = [],
    language: 'en' | 'ko' = 'en'
) => {
    const t = translations[language];
    const translatedModes = vulnerableModes.map(mode => t.vulnerableModes[mode]);

    const modeText = translatedModes.length > 0
        ? (language === 'ko' 
            ? `다음 취약 그룹에 대한 위험에 특히 주의하세요: ${translatedModes.join(', ')}.`
            : `Pay special attention to risks concerning the following vulnerable groups: ${translatedModes.join(', ')}.`)
        : (language === 'ko' ? "일반적인 위험성 평가를 수행하세요." : "Perform a general risk assessment.");
    
    const inputInstruction = language === 'ko'
        ? `제공된 제품 라벨 이미지에서 모든 텍스트를 먼저 꼼꼼하게 추출(OCR)하세요. 그 다음, 추출된 텍스트에서 '전성분', '원재료명' 또는 이와 유사한 섹션을 찾아 성분 목록을 식별하세요. 이 식별된 성분 목록을 기반으로 제품을 분석해야 합니다.`
        : `First, meticulously extract all visible text from the provided product label image(s) using OCR. Then, from that extracted text, identify the ingredient list, which may be under a heading like 'Ingredients', 'Full Ingredients', or a similar section. Your analysis must be based on this identified ingredient list.`;

    const mainInstruction = language === 'ko'
        ? "점수, 성분 분석, 사고 이력, 더 안전한 대안, 그리고 환경 영향을 포함한 포괄적인 안전성 분석을 제공하세요. 환경 영향 분석에는 환경 점수, 포장재 재활용성, 주요 성분의 환경 영향 평가 및 안전한 폐기 방법이 포함되어야 합니다. 대안 제품은 인체에 더 안전하고 환경 친화적인 제품을 추천해주세요. 만약 제품이 '주의' 또는 '고위험' 등급으로 평가된다면, 위험을 최소화할 수 있는 구체적인 사용 방법(예: '사용 시 환기 필수', '피부 접촉 방지를 위해 장갑 착용', '사용 후 깨끗한 물로 충분히 헹구기')을 2-4가지 제안해주세요."
        : "Provide a comprehensive safety and environmental analysis, including a safety score, ingredient breakdown, incident history, safer alternatives, and an environmental impact report. The environmental report should include an eco-score, an assessment of packaging recyclability, the environmental effects of key ingredients, and a safe disposal tip. For alternatives, recommend products that are safer for humans and also eco-friendly. If the product is graded as 'Caution' or 'High Risk', provide 2-4 specific, actionable tips on how to use it to minimize risks (e.g., 'Ensure good ventilation during use', 'Wear gloves to avoid skin contact', 'Rinse surfaces thoroughly after use').";

    return `${inputInstruction} \n${modeText} \n${mainInstruction}`;
};


export const analyzeProduct = async (
    images: { data: string; mimeType: string }[],
    language: 'en' | 'ko' = 'en',
): Promise<ProductAnalysis> => {
    try {
        const langInstruction = language === 'ko' 
            ? "The entire analysis and all text fields in the JSON response must be in Korean (한국어)."
            : "The entire analysis and all text fields in the JSON response must be in English.";

        const systemInstruction = `You are an expert household product safety and environmental analyst. Your task is to analyze product ingredients based on the provided information. You must return a detailed analysis in a structured JSON format that adheres strictly to the provided schema. Do not output markdown. Prioritize safety. If information is missing or ambiguous, state it clearly in the 'notes' field and provide a conservative (higher risk) score. ${langInstruction}`;

        const userPrompt = buildPrompt([], language);
        
        const contents = { parts: [{ text: userPrompt }, ...images.map(image => ({ inlineData: { data: image.data, mimeType: image.mimeType } }))] };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                systemInstruction: systemInstruction,
            },
        });
        
        const jsonString = response.text;
        if (!jsonString) {
          throw new Error("Received an empty response from the API.");
        }

        const parsedJson = JSON.parse(jsonString);
        return parsedJson as ProductAnalysis;

    } catch (error) {
        console.error("Error analyzing product:", error);
        throw new Error("Failed to analyze product. The model may have returned an invalid response.");
    }
};

export const refineAnalysis = async (
    currentAnalysis: ProductAnalysis,
    vulnerableMode: VulnerableMode,
    language: 'en' | 'ko' = 'en'
): Promise<ProductAnalysis> => {
     try {
        const t = translations[language];
        const translatedMode = t.vulnerableModes[vulnerableMode];

        const langInstruction = language === 'ko' 
            ? "The entire analysis and all text fields in the JSON response must be in Korean (한국어)."
            : "The entire analysis and all text fields in the JSON response must be in English.";

        const systemInstruction = `You are an expert household product safety analyst. Your task is to re-evaluate an existing product analysis for a specific vulnerable group. You must return a complete, updated analysis in a structured JSON format that adheres strictly to the provided schema. Do not output markdown. Base your refined analysis ONLY on the ingredients and product details provided in the original analysis JSON. Adjust the safety score, grade, summary, and ingredient risks as necessary to reflect the heightened sensitivity for this group. The environmental analysis should remain unchanged from the original. ${langInstruction}`;
        
        const userPrompt = language === 'ko'
            ? `기존 제품 분석 정보는 다음과 같습니다. 이 분석을 [${translatedMode}] 그룹에 대한 위험에 초점을 맞춰 다시 평가해주세요. 점수, 등급, 요약, 성분 위험도를 이 그룹에 맞게 조정하여 전체 JSON 응답을 다시 생성해주세요. 만약 재평가된 등급이 '주의'나 '고위험'이라면, 해당 그룹을 위해 위험을 최소화할 수 있는 구체적인 안전 수칙도 포함해주세요.\n\n기존 분석:\n${JSON.stringify(currentAnalysis)}`
            : `Here is the existing product analysis. Please re-evaluate it, focusing specifically on the risks for the [${translatedMode}] group. Regenerate the entire JSON response, adjusting the score, grade, summary, and ingredient risk levels to be appropriate for this group. If the re-evaluated grade is 'Caution' or 'High Risk', also include specific safety tips to minimize risks for this group.\n\nOriginal Analysis:\n${JSON.stringify(currentAnalysis)}`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: userPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                systemInstruction: systemInstruction,
            },
        });
        
        const jsonString = response.text;
        if (!jsonString) {
          throw new Error("Received an empty response from the API.");
        }

        const parsedJson = JSON.parse(jsonString);
        return parsedJson as ProductAnalysis;

    } catch (error) {
        console.error("Error refining analysis:", error);
        throw new Error(`Failed to refine analysis for ${vulnerableMode}. The model may have returned an invalid response.`);
    }
}