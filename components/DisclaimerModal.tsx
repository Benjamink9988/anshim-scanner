
import React from 'react';
import { XIcon } from './Icons';
import { translations } from '../translations';

interface DisclaimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: 'en' | 'ko';
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose, language }) => {
    if (!isOpen) return null;

    const t = translations[language];

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
            aria-labelledby="disclaimer-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4 transform translate-y-0"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center">
                    <h2 id="disclaimer-title" className="text-xl font-bold text-slate-800">{t.disclaimerTitle}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
                        <XIcon className="w-5 h-5" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                
                <div className="text-sm text-slate-600 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    <p><strong>{t.disclaimerContent1.split(':')[0]}:</strong> {t.disclaimerContent1.split(':').slice(1).join(':')}</p>
                    <p><strong>{t.disclaimerContent2.split(':')[0]}:</strong> {t.disclaimerContent2.split(':').slice(1).join(':')}</p>
                    <p><strong>{t.disclaimerContent3.split(':')[0]}:</strong> {t.disclaimerContent3.split(':').slice(1).join(':')}</p>
                </div>

                <div className="text-right">
                    <button 
                        onClick={onClose} 
                        className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {t.iUnderstandButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisclaimerModal;
