import React, { useState, useCallback } from 'react';
import Scanner from './components/Scanner';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';
import DisclaimerModal from './components/DisclaimerModal';
import UserManualModal from './components/UserManualModal';
import { ProductAnalysis } from './types';
import { analyzeProduct } from './services/geminiService';
import { fileToBase64, fileToDataUrl } from './utils/imageHelper';
import { translations } from './translations';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ko'>('ko');
  const [scannedImageUrls, setScannedImageUrls] = useState<string[]>([]);
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);
  const [isUserManualVisible, setIsUserManualVisible] = useState(false);


  const t = translations[language];

  const handleScan = useCallback(async (value: File[]) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    setScannedImageUrls([]);

    try {
      let result: ProductAnalysis;
      if (Array.isArray(value) && value.length > 0) {
        const previewUrls = await Promise.all(value.map(fileToDataUrl));
        setScannedImageUrls(previewUrls);

        const imageParts = await Promise.all(
          value.map(async (file) => {
            const base64Data = await fileToBase64(file);
            return { data: base64Data, mimeType: file.type };
          })
        );
        
        result = await analyzeProduct(imageParts, language);

      } else {
        throw new Error("No image files were provided for analysis.");
      }
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    setScannedImageUrls([]);
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ko' : 'en'));
    handleReset();
  };

  const year = new Date().getFullYear();

  const renderContent = () => {
    if (isLoading) {
      return <Spinner language={language} />;
    }
    if (error) {
      return (
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <h3 className="text-xl font-bold text-red-800">{t.analysisFailedTitle}</h3>
          <p className="text-red-600 mt-2 mb-4">{error}</p>
          <button onClick={handleReset} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
            {t.tryAgainButton}
          </button>
        </div>
      );
    }
    if (analysisResult) {
      return <ResultDisplay result={analysisResult} onReset={handleReset} language={language} scannedImageUrls={scannedImageUrls} />;
    }
    return <Scanner onScan={handleScan} isLoading={isLoading} language={language} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">{t.headerTitle}</h1>
          <button onClick={toggleLanguage} className="text-sm font-semibold text-brand-primary hover:underline">
            {language === 'en' ? t.toggleToKorean : t.toggleToEnglish}
          </button>
        </header>
        
        <main>
          {renderContent()}
        </main>

        <footer className="text-center mt-8 text-slate-500 text-sm space-y-3">
            <div className="flex justify-center items-center gap-4">
                <button onClick={() => setIsUserManualVisible(true)} className="text-brand-primary hover:underline">
                    {t.userManualLink}
                </button>
                <span className="text-slate-300">|</span>
                <button onClick={() => setIsDisclaimerVisible(true)} className="text-brand-primary hover:underline">
                    {t.legalDisclaimerLink}
                </button>
            </div>
            <div>
                <p>{translations['en'].footerText.replace('{year}', year.toString())}</p>
                <p>Contact: <a href="mailto:uplus50@gmail.com" className="text-brand-primary hover:underline">uplus50@gmail.com</a></p>
            </div>
        </footer>
      </div>
      
      <DisclaimerModal
        isOpen={isDisclaimerVisible}
        onClose={() => setIsDisclaimerVisible(false)}
        language={language}
      />
      <UserManualModal
        isOpen={isUserManualVisible}
        onClose={() => setIsUserManualVisible(false)}
        language={language}
      />
    </div>
  );
};

export default App;