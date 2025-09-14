import React from 'react';
import { XIcon } from './Icons';
import { translations } from '../translations';

interface UserManualModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: 'en' | 'ko';
}

const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose, language }) => {
    if (!isOpen) return null;

    const t = translations[language];

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
            aria-labelledby="usermanual-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4 transform translate-y-0"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center">
                    <h2 id="usermanual-title" className="text-xl font-bold text-slate-800">{t.userManualTitle}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
                        <XIcon className="w-5 h-5" />
                        <span className="sr-only">{t.closeButton}</span>
                    </button>
                </div>
                
                <div className="text-sm text-slate-600 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {t.userManualSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-bold text-slate-800 mb-1">{section.title}</h3>
                            <p className="whitespace-pre-line">{section.content}</p>
                        </div>
                    ))}
                </div>

                <div className="text-right">
                    <button 
                        onClick={onClose} 
                        className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {t.closeButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserManualModal;