import React from 'react';
import { ExamData, DEFAULT_LOGO } from '../types';

interface ExamPaperProps {
  data: ExamData;
  examRef: React.RefObject<HTMLDivElement>;
}

export const ExamPaper: React.FC<ExamPaperProps> = ({ data, examRef }) => {
  return (
    <div className="w-full flex justify-center py-8 print:p-0 print:w-full">
      {/* A4 Paper Container */}
      <div 
        ref={examRef}
        lang="ar"
        dir="rtl"
        className="bg-white w-[210mm] min-h-[297mm] shadow-2xl print:shadow-none p-[20mm] relative flex flex-col font-serif text-black"
      >
        {/* Header */}
        <header className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
          {/* Right Side */}
          <div className="flex flex-col items-start w-1/3 space-y-2">
            <h2 className="text-xl font-bold">{data.universityName}</h2>
            <h3 className="text-lg">{data.collegeName}</h3>
            <div className="w-24 h-0.5 bg-black mt-1"></div>
          </div>

          {/* Center Side */}
          <div className="flex flex-col items-center w-1/3 text-center px-2">
            <div className="w-24 h-24 mb-2 relative overflow-hidden">
               <img 
                 src={data.logoUrl || DEFAULT_LOGO} 
                 alt="University Logo" 
                 className="w-full h-full object-contain"
               />
            </div>
            <h1 className="text-xl font-bold mt-2 leading-tight">{data.examTitle}</h1>
          </div>

          {/* Left Side */}
          {/* Using items-end in RTL aligns content to the visual Left without forcing LTR direction, keeping Arabic text intact */}
          <div className="flex flex-col items-end w-1/3 space-y-2 text-left">
             <div className="flex items-center gap-2">
               <span className="font-bold">التاريخ:</span>
               <span>{data.date}</span>
             </div>
             <div className="w-full text-left font-bold mt-4 pl-1" style={{ direction: 'rtl', textAlign: 'left' }}>
                {data.studentNameLabel}
             </div>
             <div className="w-full text-left mt-2 pl-1" style={{ direction: 'rtl', textAlign: 'left' }}>
                رقم الامتحان: ____________
             </div>
          </div>
        </header>

        {/* Instructions */}
        <div className="mb-8">
           <div className="border border-black p-3 bg-gray-50 print:bg-transparent rounded-sm">
             <p className="font-bold text-lg">{data.note}</p>
           </div>
        </div>

        {/* Questions Section */}
        <div className="flex-grow space-y-8">
          {data.questions.map((q, index) => (
            <div key={q.id} className="flex items-start gap-4">
               <div className="font-bold whitespace-nowrap text-lg min-w-[80px]">
                 سؤال ({index + 1}):
               </div>
               <div className="text-lg leading-relaxed w-full border-b border-gray-300 border-dashed pb-1">
                 {q.text}
               </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 flex justify-between items-end">
          <div className="flex flex-col gap-4">
             <div>
                <span className="font-bold ml-2">اسم التدريسي:</span>
                <span className="border-b border-black border-dotted px-8 inline-block min-w-[150px]">{data.professorName}</span>
             </div>
          </div>
        </footer>

      </div>
    </div>
  );
};