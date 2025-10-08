import React from 'react';

interface GaugeProps {
  score: number;
  title: string;
  grade: string;
  description: string[];
}

const Gauge: React.FC<GaugeProps> = ({ score, title, grade, description }) => {
  const getGradeStyles = (gradeString: string) => {
    const gradeLC = gradeString.toLowerCase();
    if (gradeLC.includes('low') || gradeLC.includes('eco-friendly') || gradeLC.includes('good') || gradeLC.includes('낮은') || gradeLC.includes('안전')) {
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        progressBarColor: 'bg-green-500', 
      };
    }
    if (gradeLC.includes('caution') || gradeLC.includes('moderate') || gradeLC.includes('주의') || gradeLC.includes('보통')) {
      return {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-400',
        textColor: 'text-yellow-800',
        progressBarColor: 'bg-yellow-500',
      };
    }
    if (gradeLC.includes('high') || gradeLC.includes('poor') || gradeLC.includes('높은') || gradeLC.includes('나쁨')) {
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        progressBarColor: 'bg-red-600',
      };
    }
    return {
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-600',
      progressBarColor: 'bg-slate-500',
    };
  };

  const { bgColor, borderColor, textColor, progressBarColor } = getGradeStyles(grade);
  const clampedScore = Math.max(0, Math.min(100, score));
  const meaning = description[0] || '';
  const judgment = description[1] || '';

  return (
    <div className={`p-4 sm:p-5 rounded-xl border ${borderColor} ${bgColor} flex flex-col h-full`}>
      {/* Top Section */}
      <div>
        {/* Line 1: Title */}
        <h4 className="font-bold text-slate-800 text-lg text-left">{title}</h4>

        {/* Line 2 & 3: Description */}
        <div className="text-xs text-slate-600 space-y-1 text-left mt-2">
          <p className="leading-relaxed" style={{ wordBreak: 'keep-all' }}>{meaning}</p>
          <p className="leading-relaxed" style={{ wordBreak: 'keep-all' }}>{judgment}</p>
        </div>
      </div>

      {/* Spacer to push content below it to the bottom */}
      <div className="flex-grow" />

      {/* Bottom Section */}
      <div className="mt-4">
        {/* Line 4: Score and Graph */}
        <div className="flex items-center gap-4">
          <p className="flex items-baseline flex-shrink-0">
            <span className={`text-3xl font-bold ${textColor}`}>{clampedScore}</span>
            <span className="text-slate-500 font-semibold text-base ml-1">/100</span>
          </p>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`${progressBarColor} h-2.5 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${clampedScore}%` }}
              role="progressbar"
              aria-valuenow={clampedScore}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${title}: ${clampedScore} out of 100`}
            ></div>
          </div>
        </div>

        {/* Line 5: Grade */}
        <div className="text-right mt-1">
          <span className={`font-bold text-2xl ${textColor}`}>{grade}</span>
        </div>
      </div>
    </div>
  );
};

export default Gauge;