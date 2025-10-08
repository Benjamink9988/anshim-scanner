// FIX: Removed a self-referential import of `VulnerableMode` that was causing a declaration conflict.
export enum VulnerableMode {
    Infant = 'Infant',
    Pregnant = 'Pregnant',
    Pet = 'Pet',
    Respiratory = 'Respiratory',
}

export enum AnalysisMode {
    Household = 'household',
    Food = 'food',
    Drug = 'drug',
}

export interface Product {
    name: string;
    brand: string;
    category: string;
}

export interface Analysis {
    riskScore: number;
    grade: 'Low Risk' | 'Caution' | 'High Risk';
    summary: string;
    notes: string;
    mitigationTips: string[];
}

export interface Ingredient {
    name: string;
    riskLevel: 'Low' | 'Moderate' | 'High';
    reason: string;
    concentrationRange?: string;
    hazards?: string[];
    chemicalFormula?: string;
}

export interface Incident {
    type: 'Recall' | 'Violation' | 'Accident';
    date: string;
    summary: string;
}

export interface Alternative {
    name: string;
    brand: string;
    reason: string;
}

export interface EnvironmentalImpact {
    riskScore: number;
    grade: 'Eco-Friendly' | 'Moderate Impact' | 'High Impact';
    summary: string;
    packagingRecyclability: string;
    keyFactors: string[];
    safeDisposalTip: string;
}

export interface ProductAnalysis {
    mode: AnalysisMode.Household;
    product: Product;
    analysis: Analysis;
    ingredients: Ingredient[];
    incidents: Incident[];
    alternatives: Alternative[];
    environmentalImpact: EnvironmentalImpact;
}

export interface FoodProduct {
    name: string;
    brand: string;
    category: string;
}

export interface FoodSafetyAnalysis {
    riskScore: number;
    grade: 'Low Risk' | 'Caution' | 'High Risk';
    summary: string;
    notes: string;
}

export interface FoodAdditive {
    name: string;
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Unknown';
    reason: string;
    purpose: string;
    adi: string;
}

export interface AllergenInfo {
    contains: string[];
    mayContain: string[];
    summary: string;
}

export interface NutritionalAnalysis {
    grade: 'Good' | 'Moderate' | 'Poor';
    summary: string;
    keyPoints: string[];
}

export interface FoodProductAnalysis {
    mode: AnalysisMode.Food;
    product: FoodProduct;
    analysis: FoodSafetyAnalysis;
    additives: FoodAdditive[];
    allergens: AllergenInfo;
    nutrition: NutritionalAnalysis;
    alternatives: Alternative[];
}

export interface DrugProduct {
    name: string;
    brand: string;
    category: string;
}

export interface DrugSafetyAnalysis {
    riskScore: number;
    grade: 'Low Risk' | 'Moderate Risk' | 'High Risk';
    summary: string;
    notes: string;
}

export interface ActiveIngredient {
    name: string;
    function: string;
    riskLevel: 'Low' | 'Moderate' | 'High';
    reason: string;
}

export interface SideEffect {
    name: string;
    frequency: 'Common' | 'Uncommon' | 'Rare';
    description: string;
}

export interface Contraindication {
    condition: string;
    reason: string;
}

export interface DrugProductAnalysis {
    mode: AnalysisMode.Drug;
    product: DrugProduct;
    analysis: DrugSafetyAnalysis;
    activeIngredients: ActiveIngredient[];
    sideEffects: SideEffect[];
    contraindications: Contraindication[];
    environmentalImpact: EnvironmentalImpact;
}

export enum ScanMode {
    OCR = 'ocr',
}