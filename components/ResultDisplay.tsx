import React, { useState, useRef } from 'react';
import { ProductAnalysis, FoodProductAnalysis, VulnerableMode, AnalysisMode } from '../types';
import { translations } from '../translations';
import { VULNERABLE_MODES } from '../constants';
import { refineAnalysis } from '../services/geminiService';
import {
    ShieldCheckIcon, AlertTriangleIcon, ShieldAlertIcon, InfoIcon, RecycleIcon, RefreshCwIcon, HistoryIcon, ClipboardListIcon, FileTextIcon,
    StarIcon, LeafIcon, Trash2Icon, UserCheckIcon, InfantIcon, PregnantIcon,
    PetIcon, RespiratoryIcon, ImageIcon, CopyIcon, UtensilsCrossedIcon
} from './Icons';
import html2canvas from 'html2canvas';

// PROPS
interface ResultDisplayProps {
    result: ProductAnalysis | FoodProductAnalysis;
    onReset: () => void;
    language: 'en' | 'ko';
    scannedImageUrls: string[];
}

// HELPER COMPONENTS

const ModernScoreMeter: React.FC<{ grade: string, score: number, title: string, subtitle: string }> = ({ grade, score, title, subtitle }) => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const gradeStyles: { [key: string]: { color: string; bgColor: string; } } = {
        'Safe': { color: '#22c55e', bgColor: '#ecfdf5' }, // green-500
        'Eco-Friendly': { color: '#22c55e', bgColor: '#ecfdf5' },
        'Good': { color: '#22c55e', bgColor: '#ecfdf5' },
        'Caution': { color: '#f59e0b', bgColor: '#fffbeb' }, // yellow-500
        'Moderate Impact': { color: '#f59e0b', bgColor: '#fffbeb' },
        'Moderate': { color: '#f59e0b', bgColor: '#fffbeb' },
        'High Risk': { color: '#ef4444', bgColor: '#fef2f2' }, // red-500
        'High Impact': { color: '#ef4444', bgColor: '#fef2f2' },
        'Poor': { color: '#ef4444', bgColor: '#fef2f2' },
    };
    
    const style = gradeStyles[grade] || { color: '#64748b', bgColor: '#f8fafc' }; // slate-500

    return (
        <div className="flex flex-col items-center justify-center p-4 rounded-xl text-center h-full" style={{ backgroundColor: style.bgColor }}>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 120 120">
                    <circle
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        fill="transparent"
                        r={radius}
                        cx="60"
                        cy="60"
                    />
                    <circle
                        stroke={style.color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="transparent"
                        r={radius}
                        cx="60"
                        cy="60"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: offset,
                        }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color: style.color }}>{score}</span>
                    <span className="text-xs font-semibold text-slate-500">/ 100</span>
                </div>
            </div>
            <h4 className="text-lg font-bold mt-3" style={{ color: style.color }}>{grade}</h4>
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
    );
};


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
    
    const isFoodMode = result.mode === AnalysisMode.Food;

    const handleRefine = async (mode: VulnerableMode) => {
        if (isFoodMode) return;
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
    
    const displayData = refinedAnalysis || result;

    const riskColorMap: { [key: string]: { dot: string; text: string; bg: string; } } = {
        'Low': { dot: 'bg-green-500', text: 'text-green-800', bg: 'bg-green-50' },
        'Moderate': { dot: 'bg-yellow-500', text: 'text-yellow-800', bg: 'bg-yellow-50' },
        'High': { dot: 'bg-red-500', text: 'text-red-800', bg: 'bg-red-50' },
        'Unknown': { dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-200' },
    };
    
    const generateTextReport = () => {
        const data = displayData;
        const sections: string[] = [];
        
        sections.push(t.reportTitle);
        sections.push('='.repeat(t.reportTitle.length));
        sections.push(`${t.reportDate}: ${new Date().toLocaleDateString()}`);
        sections.push('');

        sections.push(`[ ${t.productName} ]`);
        sections.push(`${data.product.name} (${data.product.brand}) - ${data.product.category}`);
        sections.push('');

        if (data.mode === AnalysisMode.Household) {
            sections.push(`[ ${t.analysisSummary} ]`);
            sections.push(`${t.grade}: ${data.analysis.grade} (${data.analysis.score}/100)`);
            sections.push(`${t.ecoGrade}: ${data.environmentalImpact.grade} (${data.environmentalImpact.score}/100)`);
            sections.push('');
            sections.push(data.analysis.summary);
            sections.push('');

            if (data.analysis.mitigationTips?.length > 0) {
                sections.push(`[ ${t.safetyTips} ]`);
                data.analysis.mitigationTips.forEach(tip => sections.push(`- ${tip}`));
                sections.push('');
            }

            sections.push(`[ ${t.ingredientDeepDive} (${data.ingredients.length}) ]`);
            data.ingredients.forEach(ing => {
                sections.push(`- ${ing.name} [${ing.riskLevel.toUpperCase()}]`);
                sections.push(`  ${ing.reason}`);
            });
            sections.push('');
            
            sections.push(`[ ${t.environmentalImpact} ]`);
            sections.push(data.environmentalImpact.summary);
            sections.push(`${t.packaging}: ${data.environmentalImpact.packagingRecyclability}`);
            sections.push(`${t.disposalTip}: ${data.environmentalImpact.safeDisposalTip}`);
            sections.push('');
        } else { // Food Mode
            sections.push(`[ ${t.analysisSummary} ]`);
            sections.push(`${t.foodSafetyGrade}: ${data.analysis.grade} (${data.analysis.score}/100)`);
            sections.push(`${t.nutritionalGrade}: ${data.nutrition.grade}`);
            sections.push('');
            sections.push(data.analysis.summary);
            sections.push('');

            sections.push(`[ ${t.allergenInfo} ]`);
            sections.push(data.allergens.summary);
            if (data.allergens.contains.length > 0) sections.push(`${t.allergenContains}: ${data.allergens.contains.join(', ')}`);
            if (data.allergens.mayContain.length > 0) sections.push(`${t.allergenMayContain}: ${data.allergens.mayContain.join(', ')}`);
            sections.push('');

            sections.push(`[ ${t.foodAdditiveAnalysis} (${data.additives.length}) ]`);
            data.additives.forEach(add => {
                sections.push(`- ${add.name} [${add.riskLevel.toUpperCase()}]`);
                sections.push(`  ${t.purpose}: ${add.purpose}`);
                sections.push(`  ${t.reason}: ${add.reason}`);
            });
            sections.push('');
            
            sections.push(`[ ${t.nutritionalSummary} ]`);
            sections.push(data.nutrition.summary);
            data.nutrition.keyPoints.forEach(p => sections.push(`- ${p}`));
            sections.push('');
        }

        return sections.join('\n');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateTextReport());
        setActionStatus(t.reportCopied);
        setTimeout(() => setActionStatus(''), 2000);
    };

    const handleSaveJPG = () => {
        if (!reportRef.current) return;
        
        setActionStatus(t.saving);
        
        html2canvas(reportRef.current!, { 
            scale: 2,
            useCORS: true,
            backgroundColor: '#f8fafc', // Same as body bg
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `${result.product.name.replace(/ /g, '_')}_analysis.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
            setActionStatus(t.saved);
        }).catch(error => {
            console.error("Failed to save as JPG:", error instanceof Error ? error.message : String(error), error);
            setActionStatus('Error!');
        }).finally(() => {
            setTimeout(() => setActionStatus(''), 2000);
        });
    };
    
    const handleSaveTXT = () => {
        setActionStatus(t.saving);
        try {
            const text = generateTextReport();
            const blob = new Blob(['\uFEFF' + text], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.download = `${result.product.name.replace(/ /g, '_')}_analysis.txt`;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            setActionStatus(t.saved);
        } catch (error) {
            console.error("Failed to save as TXT", error);
            setActionStatus('Error!');
        } finally {
            setTimeout(() => setActionStatus(''), 2000);
        }
    };
    
    return (
        <div className="space-y-6 animate-fade-in">
            <div ref={reportRef} className="bg-slate-50 p-2 md:p-4">
              <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
                {/* Header */}
                <div className="text-center">
                    <p className="text-sm font-semibold text-brand-primary uppercase tracking-wider">{displayData.product.category || t.noDataAvailable}</p>
                    <h1 className="text-3xl font-bold text-slate-800 mt-1">{displayData.product.name || t.noDataAvailable}</h1>
                    <p className="text-slate-500 mt-1">{t.byBrand.replace('{brand}', displayData.product.brand || t.noDataAvailable)}</p>
                </div>

                {/* Key Findings */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 text-center">{!isFoodMode && selectedMode ? t.refinedAnalysisTitle.replace('{group}', t.vulnerableModes[selectedMode as keyof typeof t.vulnerableModes]) : t.analysisSummary}</h2>
                    
                    {displayData.mode === AnalysisMode.Household ? (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ModernScoreMeter grade={displayData.analysis.grade} score={displayData.analysis.score} title={t.grade} subtitle={t.gradeSubtitles[displayData.analysis.grade as keyof typeof t.gradeSubtitles] || ''}/>
                            <ModernScoreMeter grade={displayData.environmentalImpact.grade} score={displayData.environmentalImpact.score} title={t.ecoGrade} subtitle={t.gradeSubtitles[displayData.environmentalImpact.grade as keyof typeof t.gradeSubtitles] || ''}/>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-50/50 text-center">
                            <p className="text-sm text-slate-600">{displayData.analysis.summary || t.noDataAvailable}</p>
                        </div>
                        </>
                    ) : (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <ModernScoreMeter grade={displayData.analysis.grade} score={displayData.analysis.score} title={t.foodSafetyGrade} subtitle={t.gradeSubtitles[displayData.analysis.grade as keyof typeof t.gradeSubtitles] || ''}/>
                             <div className="flex flex-col items-center justify-center p-4 rounded-xl text-center bg-slate-50">
                                <h3 className="text-lg font-semibold text-slate-700">{t.nutritionalGrade}</h3>
                                <p className="text-4xl font-bold text-brand-primary mt-2">{displayData.nutrition.grade}</p>
                                <p className="text-xs text-slate-500 mt-2">{t.gradeSubtitles[displayData.nutrition.grade as keyof typeof t.gradeSubtitles] || ''}</p>
                             </div>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-50/50 text-center">
                            <p className="text-sm text-slate-600">{displayData.analysis.summary || t.noDataAvailable}</p>
                        </div>
                        </>
                    )}
                </div>

                 {/* Vulnerable Group Analysis Card */}
                 {!isFoodMode && (displayData.mode === AnalysisMode.Household) && (
                     <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-700 text-center">{t.vulnerableGroupAnalysis}</h2>
                        <p className="text-sm text-slate-600 text-center mt-1 mb-4">{t.vulnerableGroupPrompt}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {VULNERABLE_MODES.map(mode => (
                                <VulnerableModeButton 
                                    key={mode}
                                    mode={mode} 
                                    onClick={handleRefine}
                                    language={language}
                                    isActive={selectedMode === mode}
                                    disabled={isRefining}
                                />
                            ))}
                        </div>
                        {isRefining && <p className="text-sm text-center text-slate-600 mt-3 animate-pulse">{t.refining}</p>}
                        {refineError && <p className="text-sm text-center text-red-600 mt-3">{refineError}</p>}
                    </div>
                 )}

                {/* Details Section */}
                <div className="space-y-6">
                    { displayData.mode === AnalysisMode.Household ? (
                        <>
                            {displayData.analysis.mitigationTips && displayData.analysis.mitigationTips.length > 0 && (
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                                    <div className="flex items-center mb-3">
                                        <UserCheckIcon className="w-6 h-6 text-blue-800 mr-3" />
                                        <h3 className="text-lg font-bold text-blue-800">{t.safetyTips}</h3>
                                    </div>
                                    <ul className="space-y-2 list-disc list-inside text-sm text-blue-800">
                                        {displayData.analysis.mitigationTips.map((tip, i) => <li key={i}>{tip}</li>)}
                                    </ul>
                                </div>
                            )}

                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <div className="flex items-center mb-3">
                                <ClipboardListIcon className="w-6 h-6 text-slate-700 mr-3" />
                                <h3 className="text-lg font-bold text-slate-700">{t.ingredientDeepDive} <span className="text-sm font-medium bg-slate-200 text-slate-600 rounded-full px-2 py-0.5 align-middle">{displayData.ingredients.length}</span></h3>
                                </div>
                                <div className="space-y-2 -mx-2">
                                    {displayData.ingredients.map((ing, i) => (
                                        <div key={i} className="p-2 border-b border-slate-100 last:border-b-0">
                                            <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <span className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${riskColorMap[ing.riskLevel]?.dot || 'bg-slate-400'}`}></span>
                                                <p className="font-semibold text-slate-800">{ing.name}</p>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${riskColorMap[ing.riskLevel]?.bg || 'bg-slate-200'} ${riskColorMap[ing.riskLevel]?.text || 'text-slate-600'}`}>{ing.riskLevel}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1 ml-6">{ing.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <div className="flex items-center mb-3">
                                <LeafIcon className="w-6 h-6 text-slate-700 mr-3" />
                                <h3 className="text-lg font-bold text-slate-700">{t.environmentalImpact}</h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <p className="text-slate-600 italic text-center">"{displayData.environmentalImpact.summary}"</p>
                                    <div className="flex items-start"><RecycleIcon className="w-5 h-5 mr-3 mt-0.5 text-green-600 flex-shrink-0"/><p><strong className="font-semibold text-slate-800">{t.packaging}:</strong> {displayData.environmentalImpact.packagingRecyclability}</p></div>
                                    <div className="flex items-start"><Trash2Icon className="w-5 h-5 mr-3 mt-0.5 text-slate-600 flex-shrink-0"/><p><strong className="font-semibold text-slate-800">{t.disposalTip}:</strong> {displayData.environmentalImpact.safeDisposalTip}</p></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl border border-slate-200">
                                    <div className="flex items-center mb-3">
                                    <HistoryIcon className="w-6 h-6 text-slate-700 mr-3" />
                                    <h3 className="text-lg font-bold text-slate-700">{t.incidentHistory}</h3>
                                    </div>
                                    {displayData.incidents.length > 0 ? (
                                        <ul className="space-y-3 text-sm">
                                            {displayData.incidents.map((inc, i) => (
                                                <li key={i} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                                                    <p className="font-semibold">{inc.type} - {inc.date}</p>
                                                    <p className="mt-1 text-slate-600">{inc.summary}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-sm text-slate-500">{t.noIncidents}</p>}
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-slate-200">
                                    <div className="flex items-center mb-3">
                                    <StarIcon className="w-6 h-6 text-slate-700 mr-3" />
                                    <h3 className="text-lg font-bold text-slate-700">{t.saferAlternatives}</h3>
                                    </div>
                                    {displayData.alternatives.length > 0 ? (
                                    <ul className="space-y-3 text-sm">
                                            {displayData.alternatives.map((alt, i) => (
                                                <li key={i} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                                                    <p className="font-semibold">{alt.name} <span className="font-normal text-slate-500">by {alt.brand}</span></p>
                                                    <p className="mt-1 text-slate-600">{alt.reason}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-sm text-slate-500">{t.noAlternatives}</p>}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-400">
                                <div className="flex items-center mb-3">
                                    <AlertTriangleIcon className="w-6 h-6 text-yellow-700 mr-3" />
                                    <h3 className="text-lg font-bold text-yellow-800">{t.allergenInfo}</h3>
                                </div>
                                <div className="space-y-2 text-sm text-yellow-700">
                                    <p className="italic text-center mb-3">"{displayData.allergens.summary}"</p>
                                    {displayData.allergens.contains.length > 0 && <p><strong className="font-semibold">{t.allergenContains}:</strong> {displayData.allergens.contains.join(', ')}</p>}
                                    {displayData.allergens.mayContain.length > 0 && <p><strong className="font-semibold">{t.allergenMayContain}:</strong> {displayData.allergens.mayContain.join(', ')}</p>}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <div className="flex items-center mb-3">
                                    <ClipboardListIcon className="w-6 h-6 text-slate-700 mr-3" />
                                    <h3 className="text-lg font-bold text-slate-700">{t.foodAdditiveAnalysis} <span className="text-sm font-medium bg-slate-200 text-slate-600 rounded-full px-2 py-0.5 align-middle">{displayData.additives.length}</span></h3>
                                </div>
                                <div className="space-y-3">
                                    {displayData.additives.map((add, i) => (
                                        <div key={i} className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center">
                                                    <span className={`w-3 h-3 rounded-full mr-3 mt-1 flex-shrink-0 ${riskColorMap[add.riskLevel]?.dot || 'bg-slate-400'}`}></span>
                                                    <p className="font-semibold text-slate-800">{add.name}</p>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${riskColorMap[add.riskLevel]?.bg || 'bg-slate-200'} ${riskColorMap[add.riskLevel]?.text || 'text-slate-600'}`}>{add.riskLevel}</span>
                                            </div>
                                            <div className="text-sm text-slate-500 mt-1.5 ml-6 space-y-1">
                                                <p><strong className="text-slate-600">{t.purpose}:</strong> {add.purpose}</p>
                                                <p><strong className="text-slate-600">{t.reason}:</strong> {add.reason}</p>
                                                <div>
                                                    <p><strong className="text-slate-600">{t.permissibleIntakeADI}:</strong> {add.adi}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{t.adiDescription}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <div className="flex items-center mb-3">
                                   <UtensilsCrossedIcon className="w-6 h-6 text-slate-700 mr-3" />
                                   <h3 className="text-lg font-bold text-slate-700">{t.nutritionalSummary}</h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <p className="text-slate-600 italic text-center">"{displayData.nutrition.summary}"</p>
                                    <ul className="space-y-2 list-disc list-inside text-slate-700">
                                        {displayData.nutrition.keyPoints.map((point, i) => <li key={i}>{point}</li>)}
                                    </ul>
                                </div>
                            </div>
                             <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <div className="flex items-center mb-3">
                                   <StarIcon className="w-6 h-6 text-slate-700 mr-3" />
                                   <h3 className="text-lg font-bold text-slate-700">{t.saferAlternatives}</h3>
                                </div>
                                {displayData.alternatives.length > 0 ? (
                                   <ul className="space-y-3 text-sm">
                                        {displayData.alternatives.map((alt, i) => (
                                            <li key={i} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                                                <p className="font-semibold">{alt.name} <span className="font-normal text-slate-500">by {alt.brand}</span></p>
                                                <p className="mt-1 text-slate-600">{alt.reason}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-sm text-slate-500">{t.noAlternatives}</p>}
                            </div>
                        </>
                    )}

                    {scannedImageUrls.length > 0 && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="flex items-center mb-3">
                               <ImageIcon className="w-6 h-6 text-slate-700 mr-3" />
                               <h3 className="text-lg font-bold text-slate-700">{t.scannedImagesTitle}</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {scannedImageUrls.map((url, i) => (
                                    <img key={i} src={url} alt={`Scanned content ${i + 1}`} className="w-full h-auto object-contain rounded-md border" />
                                ))}
                            </div>
                        </div>
                    )}

                    {displayData.analysis.notes && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="flex items-center mb-3">
                               <FileTextIcon className="w-6 h-6 text-slate-700 mr-3" />
                               <h3 className="text-lg font-bold text-slate-700">{t.notes}</h3>
                            </div>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap italic">{displayData.analysis.notes}</p>
                        </div>
                    )}
                  </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-white rounded-xl shadow-lg sticky bottom-4">
                <div className="flex items-center justify-between">
                     <p className="text-sm font-semibold text-brand-primary w-20 text-center h-5">{actionStatus}</p>
                     <div className="flex-1 flex justify-center gap-2">
                        <button onClick={handleCopy} title={t.copyReport} className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"><CopyIcon className="w-5 h-5"/></button>
                        <button onClick={handleSaveJPG} title={t.saveAsJpg} className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"><ImageIcon className="w-5 h-5"/></button>
                        <button onClick={handleSaveTXT} title={t.saveAsTxt} className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"><FileTextIcon className="w-5 h-5"/></button>
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