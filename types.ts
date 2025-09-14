// FIX: Removed a self-referential import of `VulnerableMode` that was causing a declaration conflict.
export enum VulnerableMode {
    Infant = 'Infant',
    Pregnant = 'Pregnant',
    Pet = 'Pet',
    Respiratory = 'Respiratory',
}

export interface Product {
    name: string;
    brand: string;
    category: string;
}

export interface Analysis {
    score: number;
    grade: 'Safe' | 'Caution' | 'High Risk';
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
    score: number;
    grade: 'Eco-Friendly' | 'Moderate Impact' | 'High Impact';
    summary: string;
    packagingRecyclability: string;
    keyFactors: string[];
    safeDisposalTip: string;
}

export interface ProductAnalysis {
    product: Product;
    analysis: Analysis;
    ingredients: Ingredient[];
    incidents: Incident[];
    alternatives: Alternative[];
    environmentalImpact: EnvironmentalImpact;
}

export enum ScanMode {
    OCR = 'ocr',
}