import React, { useState, useRef, useEffect } from 'react';
import { ProductAnalysis, FoodProductAnalysis, DrugProductAnalysis, VulnerableMode, AnalysisMode, Ingredient } from '../types';
import { translations } from '../translations';
import { VULNERABLE_MODES } from '../constants';
import { refineAnalysis } from '../services/geminiService';
import {
    AlertTriangleIcon, RecycleIcon, RefreshCwIcon, ClipboardListIcon, FileTextIcon,
    StarIcon, LeafIcon, Trash2Icon, UserCheckIcon, InfantIcon, PregnantIcon,
    PetIcon, RespiratoryIcon, ImageIcon, CopyIcon, UtensilsCrossedIcon, PillIcon, BeakerIcon, InfoIcon
} from './Icons';
import html2canvas from 'html2canvas';
import Gauge from './Gauge';


// PROPS
interface ResultDisplayProps {
    result: ProductAnalysis | FoodProductAnalysis | DrugProductAnalysis;
    onReset: () => void;
    language: 'en' | 'ko';
    scannedImageUrls: string[];
}

// HELPER COMPONENTS
const VulnerableModeButton: React.FC<{
    mode: VulnerableMode;
    onClick: (mode: VulnerableMode) => void;
    language: 'en' | 'ko';
    isActive: boolean;
    disabled: boolean;
}> = ({ mode, onClick, language, isActive, disabled }) => {
    const t = translations[language];
    const details = {
        [VulnerableMode.Infant]: { Icon: InfantIcon, label: t.vulnerableModes.Infant },
        [VulnerableMode.Pregnant]: { Icon: PregnantIcon, label: t.vulnerableModes.Pregnant },
        [VulnerableMode.Pet]: { Icon: PetIcon, label: t.vulnerableModes.Pet },
        [VulnerableMode.Respiratory]: { Icon: RespiratoryIcon, label: t.vulnerableModes.Respiratory },
    };
    const { Icon, label } = details[mode];

    return (
        <button
            onClick={() => onClick(mode)}
            disabled={disabled}
            className={`flex-1 flex flex-col items-center justify-center p-3 border rounded-lg text-sm text-center transition-all duration-200
                ${isActive ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-white hover:bg-slate-50 hover:border-slate-300'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Icon className="w-6 h-6 mb-1" />
            <span className="font-semibold">{label}</span>
        </button>
    );
};

// MAIN COMPONENT
const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset, language, scannedImageUrls }) => {
    const t = translations[language];
    const [refinedAnalysis, setRefinedAnalysis] = useState<ProductAnalysis | null>(null);
    const [isRefining, setIsRefining] = useState(false);
    const [refineError, setRefineError] = useState<string | null>(null);
    const [selectedMode, setSelectedMode] = useState<VulnerableMode | null>(null);
    const [actionStatus, setActionStatus] = useState('');
    const reportRef = useRef<HTMLDivElement>(null);
    
    const displayData = refinedAnalysis || result;

    const handleRefine = async (mode: VulnerableMode) => {
        if (result.mode !== AnalysisMode.Household) return;
        setIsRefining(true);
        setRefineError(null);
        setSelectedMode(mode);
        try {
            const refinedResult = await refineAnalysis(result as ProductAnalysis, mode, language);
            setRefinedAnalysis(refinedResult);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setRefineError(errorMessage);
        } finally {
            setIsRefining(false);
        }
    };
    
    const riskColorMap: { [key: string]: { dot: string; text: string; bg: string; } } = {
        'Low': { dot: 'bg-green-500', text: 'text-green-800', bg: 'bg-green-50' },
        'Moderate': { dot: 'bg-yellow-500', text: 'text-yellow-800', bg: 'bg-yellow-50' },
        'High': { dot: 'bg-red-500', text: 'text-red-800', bg: 'bg-red-50' },
        'Unknown': { dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-100' },
        'Common': { dot: 'bg-yellow-500', text: 'text-yellow-800', bg: 'bg-yellow-50' },
        'Uncommon': { dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-100' },
        'Rare': { dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-100' },
    };
    
    const handleSaveJPG = () => {
        if (!reportRef.current) return;
        setActionStatus(t.saving);
        html2canvas(reportRef.current!, { scale: 2, useCORS: true, backgroundColor: '#f8fafc' })
          .then(canvas => {
            const link = document.createElement('a');
            link.download = `${result.product.name.replace(/ /g, '_')}_analysis.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
            setActionStatus(t.saved);
          }).catch(err => {
            console.error("Failed to save as JPG:", err);
            setActionStatus('Error!');
          }).finally(() => setTimeout(() => setActionStatus(''), 2000));
    };

    const handleCopy = () => {
        const generateReportText = (data: ProductAnalysis | FoodProductAnalysis | DrugProductAnalysis, lang: 'en' | 'ko'): string => {
            const t = translations[lang];
            const lines: string[] = [];

            lines.push(`--- ${t.reportTitle} ---`);
            lines.push(``);
            lines.push(`${t.productName}: ${data.product.name || t.noDataAvailable}`);
            lines.push(`${t.byBrand.replace('{brand}', data.product.brand || t.noDataAvailable)}`);
            lines.push(`${t.category}: ${data.product.category || t.noDataAvailable}`);
            lines.push(`------------------------------------`);
            lines.push(``);

            lines.push(`[ ${t.analysisSummary} ]`);
            lines.push(`${t.riskScore}: ${data.analysis.riskScore}/100 (${data.analysis.grade})`);
            lines.push(data.analysis.summary);
            lines.push(``);

            if (data.mode === AnalysisMode.Household) {
                const d = data as ProductAnalysis;
                lines.push(`[ ${t.environmentalImpact} ]`);
                lines.push(`${t.ecoRiskScore}: ${d.environmentalImpact.riskScore}/100 (${d.environmentalImpact.grade})`);
                lines.push(d.environmentalImpact.summary);
                lines.push(`${t.packaging}: ${d.environmentalImpact.packagingRecyclability}`);
                lines.push(`${t.disposalTip}: ${d.environmentalImpact.safeDisposalTip}`);
                lines.push(``);

                if (d.analysis.mitigationTips && d.analysis.mitigationTips.length > 0) {
                    lines.push(`[ ${t.safetyTips} ]`);
                    d.analysis.mitigationTips.forEach(tip => lines.push(`- ${tip}`));
                    lines.push(``);
                }

                lines.push(`[ ${t.ingredientDeepDive} ]`);
                d.ingredients.forEach(ing => {
                    const formula = ing.chemicalFormula ? ` (${ing.chemicalFormula})` : '';
                    lines.push(`- ${ing.name}${formula} (${ing.riskLevel}): ${ing.reason}`);
                });
                lines.push(``);
            }

            if (data.mode === AnalysisMode.Food) {
                const d = data as FoodProductAnalysis;
                lines.push(`[ ${t.nutritionalGrade} ]`);
                lines.push(`${d.nutrition.grade}: ${d.nutrition.summary}`);
                lines.push(``);

                lines.push(`[ ${t.allergenInfo} ]`);
                if (d.allergens.contains.length > 0) lines.push(`${t.allergenContains}: ${d.allergens.contains.join(', ')}`);
                if (d.allergens.mayContain.length > 0) lines.push(`${t.allergenMayContain}: ${d.allergens.mayContain.join(', ')}`);
                lines.push(d.allergens.summary);
                lines.push(``);

                lines.push(`[ ${t.foodAdditiveAnalysis} ]`);
                d.additives.forEach(add => {
                    lines.push(`- ${add.name} (${add.riskLevel})`);
                    lines.push(`  ${t.purpose}: ${add.purpose}`);
                    lines.push(`  ${t.reason}: ${add.reason}`);
                    lines.push(`  ${t.permissibleIntakeADI}: ${add.adi}`);
                });
                lines.push(``);
            }
            
            if (data.mode === AnalysisMode.Drug) {
                const d = data as DrugProductAnalysis;
                lines.push(`*** ${t.drugWarning} ***`);
                lines.push(``);
                
                lines.push(`[ ${t.activeIngredients} ]`);
                d.activeIngredients.forEach(ing => {
                    lines.push(`- ${ing.name} (${ing.riskLevel})`);
                    lines.push(`  ${t.function}: ${ing.function}`);
                    lines.push(`  ${t.reason}: ${ing.reason}`);
                });
                lines.push(``);
                
                lines.push(`[ ${t.sideEffects} ]`);
                d.sideEffects.forEach(effect => lines.push(`- ${effect.name} (${effect.frequency}): ${effect.description}`));
                lines.push(``);
                
                lines.push(`[ ${t.contraindications} ]`);
                d.contraindications.forEach(con => lines.push(`- ${con.condition}: ${con.reason}`));
                lines.push(``);
                
                lines.push(`[ ${t.environmentalImpact} ]`);
                lines.push(`${t.disposalTip}: ${d.environmentalImpact.safeDisposalTip}`);
                lines.push(``);
            }

            lines.push(`---`);
            lines.push(`${t.footerText.replace('{year}', new Date().getFullYear().toString())}`);
            
            return lines.join('\n');
        };

        const reportText = generateReportText(displayData, language);
        navigator.clipboard.writeText(reportText).then(() => {
            setActionStatus(t.reportCopied);
            setTimeout(() => setActionStatus(''), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setActionStatus('Error!');
            setTimeout(() => setActionStatus(''), 2000);
        });
    };
    
    const ModeIcon = {
        [AnalysisMode.Household]: BeakerIcon,
        [AnalysisMode.Food]: UtensilsCrossedIcon,
        [AnalysisMode.Drug]: PillIcon,
    }[displayData.mode];

    const renderHeader = () => (
        <div className="flex items-center gap-4">
            <ModeIcon className="w-10 h-10 text-brand-primary flex-shrink-0" />
            <div className="flex-1">
                <p className="text-sm font-semibold text-brand-primary uppercase tracking-wider">{displayData.product.category || t.noDataAvailable}</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{displayData.product.name || t.noDataAvailable}</h1>
                <p className="text-slate-500 text-sm">{t.byBrand.replace('{brand}', displayData.product.brand || t.noDataAvailable)}</p>
            </div>
        </div>
    );
    
     const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
        <div className={`bg-white p-4 sm:p-6 rounded-xl border border-slate-200 ${className}`}>
            <h3 className="text-lg font-bold text-slate-700 mb-3 flex items-center">
                {icon}
                <span className="ml-2">{title}</span>
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
                {children}
            </div>
        </div>
    );

    const renderKeyFindingsHousehold = (data: ProductAnalysis) => (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Gauge 
                title={t.riskScore}
                score={data.analysis.riskScore} 
                grade={data.analysis.grade}
                description={[
                    `${t.meaningPrefix}${t.scoreMeaningGeneric}`,
                    `${t.judgmentPrefix}${t.riskGradeSubtitles[data.analysis.grade as keyof typeof t.riskGradeSubtitles] || ''}`
                ]}
            />
            <Gauge 
                title={t.ecoRiskScore}
                score={data.environmentalImpact.riskScore} 
                grade={data.environmentalImpact.grade}
                description={[
                    `${t.meaningPrefix}${t.scoreMeaningGeneric}`,
                    `${t.judgmentPrefix}${t.riskGradeSubtitles[data.environmentalImpact.grade as keyof typeof t.riskGradeSubtitles] || ''}`
                ]}
            />
        </div>
    );

    const renderKeyFindingsFood = (data: FoodProductAnalysis) => {
         const getNutritionStyles = (grade: string) => {
            const gradeLC = grade.toLowerCase();
            if (gradeLC.includes('good')) return { color: 'text-green-800', bg: 'bg-green-50', border: 'border-green-200' };
            if (gradeLC.includes('moderate')) return { color: 'text-yellow-800', bg: 'bg-yellow-50', border: 'border-yellow-400' };
            if (gradeLC.includes('poor')) return { color: 'text-red-800', bg: 'bg-red-50', border: 'border-red-200' };
            return { color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
        };
        const nutritionStyles = getNutritionStyles(data.nutrition.grade);

        return (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Gauge 
                    title={t.riskScore} 
                    score={data.analysis.riskScore} 
                    grade={data.analysis.grade}
                    description={[
                        `${t.meaningPrefix}${t.scoreMeaningGeneric}`,
                        `${t.judgmentPrefix}${t.riskGradeSubtitles[data.analysis.grade as keyof typeof t.riskGradeSubtitles] || ''}`
                    ]}
                />
                 <div className={`p-4 rounded-xl text-center flex flex-col justify-center items-center ${nutritionStyles.bg} ${nutritionStyles.border}`}>
                    <h3 className="text-lg font-semibold text-slate-700">{t.nutritionalGrade}</h3>
                    <p className={`text-4xl font-bold ${nutritionStyles.color} mt-2`}>{data.nutrition.grade}</p>
                    <p className="text-xs text-slate-500 mt-2">{t.nutritionalGradeSubtitles[data.nutrition.grade as keyof typeof t.nutritionalGradeSubtitles] || ''}</p>
                 </div>
            </div>
        );
    }

    const renderKeyFindingsDrug = (data: DrugProductAnalysis) => (
         <div className="space-y-4">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p className="font-bold">{t.drugWarning}</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Gauge 
                    title={t.riskScore}
                    score={data.analysis.riskScore} 
                    grade={data.analysis.grade}
                     description={[
                        `${t.meaningPrefix}${t.scoreMeaningGeneric}`,
                        `${t.judgmentPrefix}${t.riskGradeSubtitles[data.analysis.grade as keyof typeof t.riskGradeSubtitles] || ''}`
                    ]}
                />
                 <Gauge 
                    title={t.ecoRiskScore}
                    score={data.environmentalImpact.riskScore} 
                    grade={data.environmentalImpact.grade}
                    description={[
                       `${t.meaningPrefix}${t.scoreMeaningGeneric}`,
                       `${t.judgmentPrefix}${t.riskGradeSubtitles[data.environmentalImpact.grade as keyof typeof t.riskGradeSubtitles] || ''}`
                    ]}
                />
             </div>
        </div>
    );
    
    return (
        <div className="space-y-6 animate-fade-in">
            <div ref={reportRef} className="bg-slate-50 p-2 sm:p-4 rounded-xl">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg space-y-6">
                {renderHeader()}
                
                 {result.mode === AnalysisMode.Household && (
                     <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-700 text-center">{t.vulnerableGroupAnalysis}</h2>
                        <p className="text-sm text-slate-600 text-center mt-1 mb-4">{t.vulnerableGroupPrompt}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {VULNERABLE_MODES.map(mode => (
                                <VulnerableModeButton key={mode} mode={mode} onClick={handleRefine} language={language} isActive={selectedMode === mode} disabled={isRefining} />
                            ))}
                        </div>
                        {isRefining && (
                            <div className="flex items-center justify-center text-center text-brand-primary font-semibold mt-4 text-lg">
                                <RefreshCwIcon className="w-5 h-5 mr-3 animate-spin" />
                                <p>{t.refining}</p>
                            </div>
                        )}
                        {refineError && <p className="text-sm text-center text-red-600 mt-3">{refineError}</p>}
                    </div>
                 )}
              </div>
              
              <hr className="my-6 border-slate-200" />

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg space-y-4">
                <h2 className="text-xl font-bold text-slate-800 text-center">{!selectedMode ? t.analysisSummary : t.refinedAnalysisTitle.replace('{group}', t.vulnerableModes[selectedMode as keyof typeof t.vulnerableModes])}</h2>
                 <div className="p-4 rounded-lg bg-slate-50 text-center">
                    <p className="text-sm text-slate-600">{displayData.analysis.summary || t.noDataAvailable}</p>
                </div>
                {displayData.mode === AnalysisMode.Household && renderKeyFindingsHousehold(displayData as ProductAnalysis)}
                {displayData.mode === AnalysisMode.Food && renderKeyFindingsFood(displayData as FoodProductAnalysis)}
                {displayData.mode === AnalysisMode.Drug && renderKeyFindingsDrug(displayData as DrugProductAnalysis)}
              </div>
              
               <div className="space-y-6 mt-6">
                    {displayData.mode === AnalysisMode.Household && (
                        <>
                         {displayData.analysis.mitigationTips && displayData.analysis.mitigationTips.length > 0 && (
                            <Section title={t.safetyTips} icon={<UserCheckIcon className="w-6 h-6 text-blue-800" />} className="bg-blue-50 border-blue-200">
                                <ul className="space-y-2 list-disc list-inside text-blue-800">
                                    {displayData.analysis.mitigationTips.map((tip, i) => <li key={i}>{tip}</li>)}
                                </ul>
                            </Section>
                         )}
                        <Section title={t.ingredientDeepDive} icon={<ClipboardListIcon className="w-6 h-6 text-slate-500" />}>
                            <div className="divide-y divide-slate-100 -mx-4 sm:-mx-6">
                            {(displayData as ProductAnalysis).ingredients.map((ing: Ingredient, i: number) => (
                                <div key={i} className="px-4 sm:px-6 py-2">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-slate-800 flex items-center">
                                          <span className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${riskColorMap[ing.riskLevel]?.dot}`}></span>
                                          {ing.name}
                                          {ing.chemicalFormula && <span className="ml-2 font-normal text-sm text-slate-500">({ing.chemicalFormula})</span>}
                                        </p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${riskColorMap[ing.riskLevel]?.bg} ${riskColorMap[ing.riskLevel]?.text}`}>{ing.riskLevel}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 ml-6">{ing.reason}</p>
                                </div>
                            ))}
                            </div>
                        </Section>
                        {(displayData.analysis.grade === 'High Risk' || displayData.analysis.grade === 'Caution') && displayData.alternatives && displayData.alternatives.length > 0 && (
                            <Section title={t.saferAlternatives} icon={<StarIcon className="w-6 h-6 text-yellow-500" />}>
                                <div className="divide-y divide-slate-100 -mx-4 sm:-mx-6">
                                    {displayData.alternatives.map((alt, i) => (
                                        <div key={i} className="px-4 sm:px-6 py-3">
                                            <p className="font-semibold text-slate-800">{alt.name} <span className="font-normal text-slate-500">({alt.brand})</span></p>
                                            <p className="text-sm text-slate-500 mt-1">{alt.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}
                        <Section title={t.environmentalImpact} icon={<LeafIcon className="w-6 h-6 text-green-600" />}>
                            <p className="text-slate-600 italic text-center">"{displayData.environmentalImpact.summary}"</p>
                            <div className="flex items-start"><RecycleIcon className="w-5 h-5 mr-3 mt-0.5 text-green-600 flex-shrink-0"/><p><strong className="font-semibold text-slate-800">{t.packaging}:</strong> {displayData.environmentalImpact.packagingRecyclability}</p></div>
                            <div className="flex items-start"><Trash2Icon className="w-5 h-5 mr-3 mt-0.5 text-slate-600 flex-shrink-0"/><p><strong className="font-semibold text-slate-800">{t.disposalTip}:</strong> {displayData.environmentalImpact.safeDisposalTip}</p></div>
                        </Section>
                        </>
                    )}
                    {displayData.mode === AnalysisMode.Food && (
                        <>
                        <Section title={t.allergenInfo} icon={<AlertTriangleIcon className="w-6 h-6 text-yellow-700" />} className="bg-yellow-50 border-yellow-400">
                             <div className="space-y-2 text-yellow-800">
                                <p className="italic text-center mb-3">"{(displayData as FoodProductAnalysis).allergens.summary}"</p>
                                {(displayData as FoodProductAnalysis).allergens.contains.length > 0 && <p><strong className="font-semibold">{t.allergenContains}:</strong> {(displayData as FoodProductAnalysis).allergens.contains.join(', ')}</p>}
                                {(displayData as FoodProductAnalysis).allergens.mayContain.length > 0 && <p><strong className="font-semibold">{t.allergenMayContain}:</strong> {(displayData as FoodProductAnalysis).allergens.mayContain.join(', ')}</p>}
                            </div>
                        </Section>
                        <Section title={t.foodAdditiveAnalysis} icon={<ClipboardListIcon className="w-6 h-6 text-slate-500" />}>
                            <div className="divide-y divide-slate-100 -mx-4 sm:-mx-6">
                            {(displayData as FoodProductAnalysis).additives.map((add, i) => (
                                <div key={i} className="px-4 sm:px-6 py-2">
                                     <div className="flex justify-between items-center">
                                        <p className="font-semibold text-slate-800 flex items-center">
                                          <span className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${riskColorMap[add.riskLevel]?.dot}`}></span>
                                          {add.name}
                                        </p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${riskColorMap[add.riskLevel]?.bg} ${riskColorMap[add.riskLevel]?.text}`}>{add.riskLevel}</span>
                                    </div>
                                    <div className="text-sm text-slate-500 mt-1 ml-6 space-y-1">
                                      <p><strong className="text-slate-600">{t.purpose}:</strong> {add.purpose}</p>
                                      <p><strong className="text-slate-600">{t.reason}:</strong> {add.reason}</p>
                                      <p><strong className="text-slate-600">{t.permissibleIntakeADI}:</strong> {add.adi}</p>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </Section>
                        {(displayData.analysis.grade === 'High Risk' || displayData.analysis.grade === 'Caution') && displayData.alternatives && displayData.alternatives.length > 0 && (
                            <Section title={t.saferAlternatives} icon={<StarIcon className="w-6 h-6 text-yellow-500" />}>
                                <div className="divide-y divide-slate-100 -mx-4 sm:-mx-6">
                                    {displayData.alternatives.map((alt, i) => (
                                        <div key={i} className="px-4 sm:px-6 py-3">
                                            <p className="font-semibold text-slate-800">{alt.name} <span className="font-normal text-slate-500">({alt.brand})</span></p>
                                            <p className="text-sm text-slate-500 mt-1">{alt.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}
                        </>
                    )}
                     {displayData.mode === AnalysisMode.Drug && (
                        <>
                        <Section title={t.activeIngredients} icon={<ClipboardListIcon className="w-6 h-6 text-slate-500" />}>
                            <div className="divide-y divide-slate-100 -mx-4 sm:-mx-6">
                            {(displayData as DrugProductAnalysis).activeIngredients.map((ing, i) => (
                                <div key={i} className="px-4 sm:px-6 py-2">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-slate-800 flex items-center">
                                          <span className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${riskColorMap[ing.riskLevel]?.dot}`}></span>
                                          {ing.name}
                                        </p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${riskColorMap[ing.riskLevel]?.bg} ${riskColorMap[ing.riskLevel]?.text}`}>{ing.riskLevel}</span>
                                    </div>
                                    <div className="text-sm text-slate-500 mt-1 ml-6 space-y-1">
                                      <p><strong className="text-slate-600">{t.function}:</strong> {ing.function}</p>
                                      <p><strong className="text-slate-600">{t.reason}:</strong> {ing.reason}</p>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </Section>
                         <Section title={t.sideEffects} icon={<AlertTriangleIcon className="w-6 h-6 text-slate-500" />}>
                           <div className="divide-y divide-slate-100 -mx-4 sm:-mx-6">
                           {(displayData as DrugProductAnalysis).sideEffects.map((effect, i) => (
                                <div key={i} className="px-4 sm:px-6 py-2">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-slate-800 flex items-center">
                                          <span className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${riskColorMap[effect.frequency]?.dot}`}></span>
                                          {effect.name}
                                        </p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${riskColorMap[effect.frequency]?.bg} ${riskColorMap[effect.frequency]?.text}`}>{effect.frequency}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 ml-6">{effect.description}</p>
                                </div>
                            ))}
                            </div>
                         </Section>
                         <Section title={t.contraindications} icon={<AlertTriangleIcon className="w-6 h-6 text-red-700" />} className="bg-red-50 border-red-200">
                             <ul className="space-y-2 list-disc list-inside text-red-800">
                                {(displayData as DrugProductAnalysis).contraindications.map((con, i) => <li key={i}><strong className="font-semibold">{con.condition}:</strong> {con.reason}</li>)}
                            </ul>
                            <span className="relative inline-block ml-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-white text-slate-700 text-sm font-normal rounded-lg shadow-lg z-10 text-left border border-slate-200 w-64 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {t.definitions.contraindication}
                                </div>
                            </span>
                         </Section>
                         <Section title={t.environmentalImpact} icon={<Trash2Icon className="w-6 h-6 text-slate-500" />}>
                            <div className="flex items-start"><Trash2Icon className="w-5 h-5 mr-3 mt-0.5 text-slate-600 flex-shrink-0"/><p><strong className="font-semibold text-slate-800">{t.disposalTip}:</strong> {(displayData as DrugProductAnalysis).environmentalImpact.safeDisposalTip}</p></div>
                        </Section>
                        </>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-white rounded-xl shadow-lg sticky bottom-4">
                <div className="flex items-center justify-between">
                     <p className="text-sm font-semibold text-brand-primary w-20 text-center h-5">{actionStatus}</p>
                     <div className="flex-1 flex justify-center gap-2">
                        <button onClick={handleCopy} title={t.copyReport} className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"><CopyIcon className="w-5 h-5"/></button>
                        <button onClick={handleSaveJPG} title={t.saveAsJpg} className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"><ImageIcon className="w-5 h-5"/></button>
                     </div>
                     <button onClick={onReset} className="bg-brand-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <RefreshCwIcon className="w-4 h-4 mr-2" />
                        {t.scanAgainButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultDisplay;