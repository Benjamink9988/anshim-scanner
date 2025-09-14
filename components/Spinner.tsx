import React, { useState, useEffect } from 'react';
import { translations } from '../translations';

interface SpinnerProps {
    language: 'en' | 'ko';
}

const Spinner: React.FC<SpinnerProps> = ({ language }) => {
    const t = translations[language];
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        t.loadingText,
        t.loadingText_contacting,
        t.loadingText_analyzing,
        t.loadingText_generating,
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 2500); // Change message every 2.5 seconds

        return () => clearInterval(intervalId);
    }, [messages.length]);
    
    return (
        <div className="flex flex-col items-center justify-center p-10">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-slate-600 font-semibold text-center transition-opacity duration-500">
                {messages[messageIndex]}
            </p>
        </div>
    );
};

export default Spinner;