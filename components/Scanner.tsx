import React, { useState, useRef } from 'react';
import { CameraIcon, UploadCloudIcon, InfoIcon, XIcon, FileUpIcon } from './Icons';
import { translations } from '../translations';

interface ScannerProps {
    onScan: (value: File[] | string) => void;
    isLoading: boolean;
    language: 'en' | 'ko';
}

const Scanner: React.FC<ScannerProps> = ({ onScan, isLoading, language }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [text, setText] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const t = translations[language];
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const newPreviews = newFiles.map((file: File) => URL.createObjectURL(file));
            setFiles(prev => [...prev, ...newFiles]);
            setImagePreviews(prev => [...prev, ...newPreviews]);
            setText(''); // Clear text when files are added
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (files.length > 0) {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            setFiles([]);
            setImagePreviews([]);
        }
    };

    const handleAnalysisSubmit = () => {
        if (files.length > 0) {
            onScan(files);
        } else if (text.trim()) {
            onScan(text.trim());
        }
    };

    const handleFileClick = () => fileInputRef.current?.click();
    const handleCameraClick = () => cameraInputRef.current?.click();

    const removeFile = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const canSubmit = !isLoading && (files.length > 0 || text.trim().length > 0);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">{t.scanTitle}</h2>

            <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-start">
                    <InfoIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{t.scanInfo}</p>
                </div>

                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" disabled={isLoading} multiple />
                <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" disabled={isLoading} />
                    
                {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="relative group aspect-square">
                                <img src={src} alt={t.imagePreviewAlt.replace('{index}', (index + 1).toString())} className="w-full h-full object-cover rounded-lg shadow-sm" />
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/75 rounded-full p-1 text-white transition-opacity opacity-0 group-hover:opacity-100"
                                    aria-label="Remove image"
                                >
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <button type="button" onClick={handleFileClick} disabled={isLoading} className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-brand-primary hover:text-brand-primary transition">
                        <UploadCloudIcon className="w-5 h-5 mr-2" />
                        <span>{t.ocrButton}</span>
                    </button>
                    <button type="button" onClick={handleCameraClick} disabled={isLoading} className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-brand-primary hover:text-brand-primary transition">
                        <CameraIcon className="w-5 h-5 mr-2" />
                        <span>{t.addPhotoButton}</span>
                    </button>
                </div>

                <div className="relative flex items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-sm font-semibold">{t.orDivider}</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div>
                    <label htmlFor="text-input" className="block text-sm font-medium text-slate-700 mb-1">{t.textInputLabel}</label>
                    <textarea
                        id="text-input"
                        value={text}
                        onChange={handleTextChange}
                        placeholder={t.textInputPlaceholder}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors disabled:bg-slate-50"
                        rows={3}
                        disabled={isLoading}
                        aria-label={t.textInputLabel}
                    />
                </div>

                 <button onClick={handleAnalysisSubmit} disabled={!canSubmit} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center">
                    <FileUpIcon className="w-5 h-5 mr-2" />
                    {files.length > 0 ? t.analyzeButton.replace('{count}', files.length.toString()) : t.analyzeTextButton}
                </button>
            </div>
        </div>
    );
};

export default Scanner;