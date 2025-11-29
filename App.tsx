import React, { useState, useRef } from 'react';
// @ts-ignore
import ReactToPrintPkg from 'react-to-print';
import { toPng } from 'html-to-image';
import { Controls } from './components/Controls';
import { ExamPaper } from './components/ExamPaper';
import { INITIAL_DATA, ExamData } from './types';
import { Copy, Check } from 'lucide-react';

// Safely extract the hook from the package object (handling CommonJS/ESM interop)
const useReactToPrint = ReactToPrintPkg.useReactToPrint || (ReactToPrintPkg as any).default?.useReactToPrint;

const App: React.FC = () => {
  const [examData, setExamData] = useState<ExamData>(INITIAL_DATA);
  const examRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Check if hook is loaded correctly, fallback to no-op or error handling if needed
  const handlePrint = useReactToPrint ? useReactToPrint({
    content: () => examRef.current,
    documentTitle: `Exam-${examData.universityName}-${new Date().toISOString()}`,
  }) : () => { console.error("Print module not loaded"); };

  const handleDownload = async () => {
    if (examRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(examRef.current, { 
        backgroundColor: 'white', 
        pixelRatio: 2,
        cacheBust: true
      });
      const link = document.createElement('a');
      link.download = `Exam-${examData.universityName || 'paper'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
      alert('حدث خطأ أثناء تحميل الصورة. يرجى المحاولة مرة أخرى.');
    }
  };

  // Function to generate the description for image generation (Prompt Requirement #2)
  const generateImagePrompt = () => {
    return `Create a high-resolution, realistic academic exam paper texture. 
    Top header text in Arabic: "${examData.universityName}" on right, "${examData.collegeName}" below it.
    Center contains a circular academic logo.
    Paper texture: Clean white A4 paper with subtle shadows.
    Font style: Traditional Arabic serif. 
    Layout: Formal, minimalist, educational document.`;
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generateImagePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Controls */}
      <div className="lg:order-2 flex-shrink-0 z-20 print:hidden relative">
         <Controls 
            data={examData} 
            onChange={setExamData} 
            onPrint={() => handlePrint && handlePrint()} 
            onDownload={handleDownload}
         />
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4 lg:p-8 flex flex-col items-center gap-6 lg:order-1 relative">
        
        {/* Helper Banner for Image Generation Requirement */}
        <div className="w-full max-w-[210mm] bg-white border border-blue-200 rounded-lg p-4 shadow-sm flex items-center justify-between print:hidden">
          <div className="text-sm text-gray-600">
             <span className="font-bold text-blue-700 block mb-1">وصف تصميم الصورة (Nano Banana Pro):</span>
             استخدم هذا الوصف لتوليد صورة واقعية للنموذج باستخدام أدوات الذكاء الاصطناعي.
          </div>
          <button 
            onClick={copyPrompt}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition"
          >
            {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16}/>}
            {copied ? "تم النسخ" : "نسخ الوصف"}
          </button>
        </div>

        {/* The Live Exam Paper */}
        <div className="transform scale-90 lg:scale-100 origin-top transition-transform duration-300">
          <ExamPaper data={examData} examRef={examRef} />
        </div>

        <div className="text-gray-400 text-sm print:hidden pb-10 font-sans">
           تصميم أكاديمي موحد - {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default App;