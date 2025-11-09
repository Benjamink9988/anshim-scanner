import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ProductAnalysis, FoodProductAnalysis, DrugProductAnalysis, VulnerableMode, AnalysisMode } from "../types";
import { GEMINI_MODEL } from "../constants";
import { translations } from "../translations";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schemas
const householdResponseSchema = {
    type: Type.OBJECT,
    properties: {
        mode: { type: Type.STRING, description: "The analysis mode, always 'household'." },
        product: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "The full name of the product." },
                brand: { type: Type.STRING, description: "The brand name of the product." },
                category: { type: Type.STRING, description: "e.g., 'All-Purpose Cleaner', 'Shampoo'." },
            },
             required: ["name", "brand", "category"],
        },
        analysis: {
            type: Type.OBJECT,
            properties: {
                riskScore: { type: Type.INTEGER, description: "Overall risk score from 0 (safest) to 100 (most hazardous)." },
                grade: { type: Type.STRING, description: "'Low Risk', 'Caution', or 'High Risk'." },
                summary: { type: Type.STRING, description: "A concise, 3-sentence summary of the key findings." },
                notes: { type: Type.STRING, description: "Any uncertainties or assumptions made. If none, state 'No specific issues to note.'" },
                mitigationTips: {
                    type: Type.ARRAY,
                    description: "If grade is 'Caution' or 'High Risk', provide 2-4 actionable tips for users to minimize exposure and risk. If 'Low Risk', return an empty array.",
                    items: { type: Type.STRING }
                }
            },
            required: ["riskScore", "grade", "summary", "notes", "mitigationTips"],
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
                    chemicalFormula: { type: Type.STRING, description: "The chemical formula (e.g., 'H2O'). If not applicable or unknown, this can be omitted." }
                },
                required: ["name", "riskLevel", "reason"],
            }
        },
        environmentalImpact: {
            type: Type.OBJECT,
            properties: {
                riskScore: { type: Type.INTEGER, description: "Environmental risk score from 0 (most eco-friendly) to 100 (most harmful)." },
                grade: { type: Type.STRING, description: "'Eco-Friendly', 'Moderate Impact', or 'High Impact'." },
                summary: { type: Type.STRING, description: "A concise, 2-3 sentence summary of the environmental findings, including disposal risks." },
                packagingRecyclability: { type: Type.STRING, description: "Description of the packaging's recyclability." },
                safeDisposalTip: { type: Type.STRING, description: "A brief, actionable tip on how to safely dispose of the product and its packaging to minimize environmental harm." }
            },
            required: ["riskScore", "grade", "summary", "packagingRecyclability", "safeDisposalTip"],
        },
        alternatives: {
            type: Type.ARRAY,
            description: "If risk is high, recommend 2-3 safer products. If risk is low, return an empty array.",
            items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, brand: { type: Type.STRING }, reason: { type: Type.STRING, description: "A brief reason why this alternative is safer." } },
                required: ["name", "brand", "reason"],
            }
        },
    },
    required: ["mode", "product", "analysis", "ingredients", "environmentalImpact", "alternatives"],
};

const foodResponseSchema = {
    type: Type.OBJECT,
    properties: {
        mode: { type: Type.STRING, description: "The analysis mode, always 'food'." },
        product: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING }, brand: { type: Type.STRING }, category: { type: Type.STRING },
            },
            required: ["name", "brand", "category"],
        },
        analysis: {
            type: Type.OBJECT,
            properties: {
                riskScore: { type: Type.INTEGER, description: "Overall food safety risk score (0-100) focusing on additives and contaminants." },
                grade: { type: Type.STRING, description: "'Low Risk', 'Caution', or 'High Risk'." },
                summary: { type: Type.STRING },
                notes: { type: Type.STRING },
            },
            required: ["riskScore", "grade", "summary", "notes"],
        },
        additives: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    riskLevel: { type: Type.STRING, description: "'Low', 'Moderate', 'High', or 'Unknown'" },
                    reason: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    adi: { type: Type.STRING, description: "Note on the Acceptable Daily Intake (ADI)." }
                },
                required: ["name", "riskLevel", "reason", "purpose", "adi"],
            }
        },
        allergens: {
            type: Type.OBJECT,
            properties: {
                contains: { type: Type.ARRAY, items: { type: Type.STRING } },
                mayContain: { type: Type.ARRAY, items: { type: Type.STRING } },
                summary: { type: Type.STRING }
            },
            required: ["contains", "mayContain", "summary"],
        },
        nutrition: {
            type: Type.OBJECT,
            properties: {
                grade: { type: Type.STRING, description: "'Good', 'Moderate', or 'Poor'." },
                summary: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["grade", "summary", "keyPoints"],
        },
        alternatives: {
            type: Type.ARRAY,
            description: "If risk is high, recommend 2-3 safer products. If risk is low, return an empty array.",
            items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, brand: { type: Type.STRING }, reason: { type: Type.STRING, description: "A brief reason why this alternative is safer." } },
                required: ["name", "brand", "reason"],
            }
        },
    },
    required: ["mode", "product", "analysis", "additives", "allergens", "nutrition", "alternatives"],
};

const drugResponseSchema = {
    type: Type.OBJECT,
    properties: {
        mode: { type: Type.STRING, description: "The analysis mode, always 'drug'." },
        product: {
            type: Type.OBJECT,
            properties: { name: { type: Type.STRING }, brand: { type: Type.STRING }, category: { type: Type.STRING, description: "e.g., 'Pain Reliever', 'Cold Medicine'." } },
            required: ["name", "brand", "category"],
        },
        analysis: {
            type: Type.OBJECT,
            properties: {
                riskScore: { type: Type.INTEGER, description: "Overall risk score (0-100) based on side effects, contraindications, and active ingredients." },
                grade: { type: Type.STRING, description: "'Low Risk', 'Moderate Risk', or 'High Risk'." },
                summary: { type: Type.STRING, description: "A concise summary for a layperson. MUST start with a disclaimer: 'This is not medical advice. Consult a doctor or pharmacist.'" },
                notes: { type: Type.STRING },
            },
            required: ["riskScore", "grade", "summary", "notes"],
        },
        activeIngredients: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    function: { type: Type.STRING, description: "What this ingredient does (e.g., 'Pain relief', 'Reduces fever')." },
                    riskLevel: { type: Type.STRING, description: "'Low', 'Moderate', or 'High'" },
                    reason: { type: Type.STRING, description: "Brief explanation of the ingredient's potential risks." },
                },
                required: ["name", "function", "riskLevel", "reason"],
            }
        },
        sideEffects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "e.g., 'Drowsiness', 'Nausea'." },
                    frequency: { type: Type.STRING, description: "'Common', 'Uncommon', or 'Rare'." },
                    description: { type: Type.STRING, description: "Brief description of the side effect's common symptoms or implications (e.g., 'May cause lightheadedness or sleepiness')." },
                },
                required: ["name", "frequency", "description"],
            }
        },
        contraindications: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    condition: { type: Type.STRING, description: "A condition, or other drug that is unsafe to take with this one (e.g., 'Pregnancy', 'Alcohol', 'Aspirin')." },
                    reason: { type: Type.STRING, description: "Why it is unsafe." },
                },
                required: ["condition", "reason"],
            }
        },
        environmentalImpact: {
            type: Type.OBJECT,
            properties: {
                riskScore: { type: Type.INTEGER, description: "Environmental risk score from 0 to 100, focusing on the harm of improper disposal." },
                grade: { type: Type.STRING, description: "'Eco-Friendly', 'Moderate Impact', or 'High Impact'." },
                summary: { type: Type.STRING },
                packagingRecyclability: { type: Type.STRING },
                safeDisposalTip: { type: Type.STRING, description: "Crucial instructions on how to dispose of unused medicine safely (e.g., 'Do not flush down the toilet. Return to a pharmacy for proper disposal.')." }
            },
            required: ["riskScore", "grade", "summary", "packagingRecyclability", "safeDisposalTip"],
        }
    },
    required: ["mode", "product", "analysis", "activeIngredients", "sideEffects", "contraindications", "environmentalImpact"],
};


// Helper function to get language-specific instructions
const getLangInstruction = (language: 'en' | 'ko') => language === 'ko'
    ? "The entire analysis and all text fields in the JSON response must be in Korean (한국어)."
    : "The entire analysis and all text fields in the JSON response must be in English.";

// New classification service
export const classifyInput = async (text: string): Promise<AnalysisMode> => {
    try {
        const systemInstruction = "You are a product classification expert. Analyze the provided text from a product label and classify it into one of three categories: 'household' (for cleaners, soaps, detergents, etc.), 'food' (for edible items), or 'drug' (for medicines, pharmaceuticals, ointments). If the text is nonsensical or cannot be classified, respond with 'household' as a safe default. Respond with ONLY the lowercase category name and nothing else.";
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: `Classify the product based on these ingredients: ${text}`,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0,
            },
        });
        
        const result = response.text.trim().toLowerCase();

        if (result === 'household' || result === 'food' || result === 'drug') {
            return result as AnalysisMode;
        }
        // Fallback for unexpected responses
        console.warn(`Unexpected classification result: '${result}'. Defaulting to 'household'.`);
        return AnalysisMode.Household;

    } catch (error) {
        console.error("Error classifying input:", error);
        throw new Error("Failed to classify product type.");
    }
};

// New OCR helper
export const extractTextFromImage = async (image: { data: string; mimeType: string }): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: {
                parts: [
                    { text: "Extract all text from this image." },
                    { inlineData: { data: image.data, mimeType: image.mimeType } }
                ]
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error extracting text from image:", error);
        throw new Error("Failed to read text from image.");
    }
};


// Unified Analysis Functions
const performAnalysis = async (
    contents: any,
    schema: object,
    systemInstruction: string,
    model: string = GEMINI_MODEL
): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonString = response.text;
        if (!jsonString) {
            throw new Error("Received an empty response from the API.");
        }
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Analysis Error:", error);
        throw new Error("The model failed to return a valid analysis. Please try again.");
    }
};

export const analyzeProductFromText = (text: string, lang: 'en' | 'ko'): Promise<ProductAnalysis> => {
    const systemInstruction = `You are an expert household product safety and environmental analyst. Your primary goal is to assess RISK based *only* on the provided text. A high score means HIGH RISK.
**CRITICAL RULE:** If the user's text is unclear, insufficient, or does not appear to be a list of ingredients, you MUST indicate this in your response. Set the product.name to "Analysis Failed" and the analysis.summary to explain that the provided text was not a valid list of ingredients for analysis. Do not attempt to analyze gibberish or unrelated text.
For valid ingredient lists:
- Analyze ingredients from user text. If an ingredient name is misspelled or ambiguous, note this in the 'analysis.notes' field. Do not guess the correct ingredient.
- Infer product name and brand only if explicitly mentioned. Otherwise, use placeholders like "User-provided ingredients" for the name and "N/A" for the brand.
- Crucially, evaluate the environmental impact of improper disposal.
- If the overall risk is 'Caution' or 'High Risk', recommend 2-3 safer alternative products.
- Return a detailed analysis in JSON adhering to the schema. ${getLangInstruction(lang)}`;
    const userPrompt = `Analyze the following ingredients list for a household product. Focus on user safety and environmental risk, including from improper disposal:\n\n${text}`;
    return performAnalysis(userPrompt, householdResponseSchema, systemInstruction);
};

export const analyzeFoodProductFromText = (text: string, lang: 'en' | 'ko'): Promise<FoodProductAnalysis> => {
    const systemInstruction = `You are a food safety expert. Your analysis must be based *only* on the provided text.
**CRITICAL RULE:** If the user's text is unclear, insufficient, or does not appear to be a list of ingredients for a food product, you MUST indicate this. Set the product.name to "Analysis Failed" and the analysis.summary to explain that the provided text was not a valid list of ingredients for analysis. Do not attempt to analyze non-food items or gibberish.
For valid ingredient lists:
- Analyze the provided food ingredients. If an ingredient is ambiguous, note this in the 'analysis.notes' field. Do not guess.
- Infer product name and brand only if explicitly mentioned. Otherwise, use placeholders.
- Assess risks from additives and identify allergens.
- Provide a nutritional overview.
- If the overall risk is 'Caution' or 'High Risk', recommend 2-3 safer alternative products.
- Return a detailed analysis in JSON adhering to the schema. ${getLangInstruction(lang)}`;
    const userPrompt = `Analyze the following ingredients list for a food product:\n\n${text}`;
    return performAnalysis(userPrompt, foodResponseSchema, systemInstruction);
};

export const analyzeDrugFromText = (text: string, lang: 'en' | 'ko'): Promise<DrugProductAnalysis> => {
    const systemInstruction = `You are an expert pharmaceutical analyst. Your analysis is for informational purposes ONLY, is NOT medical advice, and must be based *only* on the provided text.
**CRITICAL RULE:** If the user's text is unclear, insufficient, or does not appear to be a list of ingredients for a drug product, you MUST indicate this. Set the product.name to "Analysis Failed" and the analysis.summary to "Analysis failed because the provided text was not a valid list of ingredients. This is not medical advice. Consult a doctor or pharmacist." Do not analyze non-drug items.
For valid ingredient lists:
- Analyze ingredients from user text. If an ingredient name is misspelled or ambiguous, note this in the 'analysis.notes' field. Do not guess the correct ingredient.
- Infer product name and brand only if explicitly mentioned. Otherwise, use placeholders like "User-provided ingredients" for the name and "N/A" for the brand.
- Assess risks based on active ingredients, side effects, and contraindications.
- CRITICALLY, provide safe disposal instructions.
- The summary MUST start with a disclaimer.
- Return a detailed analysis in JSON adhering to the schema. ${getLangInstruction(lang)}`;
    const userPrompt = `Analyze the following ingredients list for a medicinal drug. Provide a risk assessment and safe disposal instructions:\n\n${text}`;
    return performAnalysis(userPrompt, drugResponseSchema, systemInstruction);
};

export const refineAnalysis = async (
    currentAnalysis: ProductAnalysis,
    vulnerableMode: VulnerableMode,
    language: 'en' | 'ko' = 'en'
): Promise<ProductAnalysis> => {
     try {
        const t = translations[language];
        const translatedMode = t.vulnerableModes[vulnerableMode];

        const systemInstruction = `You are an expert household product safety analyst. Re-evaluate an existing analysis for a specific vulnerable group based *only* on the provided JSON. A higher score means a higher risk. Adjust the riskScore, grade, summary, and ingredient risks to reflect heightened sensitivity. If any part of the original analysis is unclear, preserve it as-is and add a note in the 'analysis.notes' field. Do not add new ingredients or invent information. The environmental analysis and alternatives should remain unchanged. Return a complete, updated JSON response. ${getLangInstruction(language)}`;
        
        const userPrompt = `Re-evaluate this analysis for the [${translatedMode}] group. Adjust risks accordingly. Original Analysis:\n${JSON.stringify(currentAnalysis)}`;

        const parsedJson = await performAnalysis(userPrompt, householdResponseSchema, systemInstruction);
        return parsedJson as ProductAnalysis;

    } catch (error) {
        console.error("Error refining analysis:", error);
        throw new Error(`Failed to refine analysis for ${vulnerableMode}.`);
    }
}