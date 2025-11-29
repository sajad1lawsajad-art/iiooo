import React, { useState } from 'react';
import { Plus, Trash2, Printer, Wand2, RefreshCcw, Image as ImageIcon, Download } from 'lucide-react';
import { ExamData, Question } from '../types';
import { generateExamQuestions } from '../services/geminiService';

interface ControlsProps {
  data: ExamData;
  onChange: (newData: ExamData) => void;
  onPrint: () => void;
  onDownload: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ data, onChange, onPrint, onDownload }) => {
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof ExamData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleQuestionChange = (id: string, text: string) => {
    const newQuestions = data.questions.map(q => 
      q.id === id ? { ...q, text } : q
    );
    onChange({ ...data, questions: newQuestions });
  };

  const addQuestion = () => {
    const newId = Date.now().toString();
    onChange({
      ...data,
      questions: [...data.questions, { id: newId, text: '' }]
    });
  };

  const removeQuestion = (id: string) => {
    onChange({
      ...data,
      questions: data.questions.filter(q => q.id !== id)
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiTopic) return;
    setIsGenerating(true);
    try {
      const newQuestions = await generateExamQuestions(aiTopic, 3);
      if (newQuestions.length > 0) {
        onChange({
          ...data,
          questions: [...data.questions, ...newQuestions]
        });
      }
    } catch (e) {
      alert("Error generating questions. Check API Key configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  const inputClass = "w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-right bg-yellow-50 border-yellow-200 text-gray-900 placeholder-gray-400";

  return (
    <div className="w-full lg:w-96 bg-white border-l border-gray-200 h-screen overflow-y-auto p-6 shadow-xl print:hidden flex flex-col font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">إعدادات الامتحان</h2>
        <div className="flex gap-2">
            <button 
              onClick={onDownload}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-lg"
              title="تحميل كصورة"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={onPrint}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg"
              title="طباعة / حفظ كملف PDF"
            >
              <Printer size={20} />
            </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Header Info */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">الترويسة</h3>
          <input 
            type="text" 
            value={data.universityName}
            onChange={(e) => handleInputChange('universityName', e.target.value)}
            className={inputClass}
            placeholder="اسم الجامعة"
          />
          <input 
            type="text" 
            value={data.collegeName}
            onChange={(e) => handleInputChange('collegeName', e.target.value)}
            className={inputClass}
            placeholder="اسم الكلية"
          />
          <input 
            type="text" 
            value={data.examTitle}
            onChange={(e) => handleInputChange('examTitle', e.target.value)}
            className={inputClass}
            placeholder="عنوان الامتحان"
          />
          <input 
            type="text" 
            value={data.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={inputClass}
            placeholder="التاريخ"
          />
        </section>

        {/* Logo Upload */}
        <section className="space-y-3">
             <h3 className="text-sm font-semibold text-gray-500 uppercase">الشعار</h3>
             <div className="flex items-center gap-2">
                 <label className="flex-1 cursor-pointer flex items-center justify-center border border-dashed border-gray-300 rounded p-2 hover:bg-gray-50 transition">
                     <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                     <ImageIcon size={16} className="mr-2" />
                     <span className="text-sm text-gray-600">رفع شعار جديد</span>
                 </label>
                 {data.logoUrl && (
                     <button 
                       onClick={() => onChange({...data, logoUrl: null})}
                       className="p-2 text-red-500 hover:bg-red-50 rounded"
                     >
                        <Trash2 size={16} />
                     </button>
                 )}
             </div>
        </section>

        {/* Instructions */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">التعليمات</h3>
          <textarea 
            value={data.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            className={`${inputClass} min-h-[80px]`}
            placeholder="ملاحظات الامتحان"
          />
        </section>

        {/* AI Generator */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
           <h3 className="text-sm font-semibold text-indigo-700 uppercase flex items-center gap-2 mb-2">
             <Wand2 size={16} />
             توليد أسئلة بالذكاء الاصطناعي
           </h3>
           <div className="flex gap-2">
             <input 
                type="text" 
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="موضوع الامتحان (مثلاً: القانون الجنائي)"
                className="flex-1 p-2 text-sm border border-indigo-200 rounded text-right bg-yellow-50 border-yellow-200 text-gray-900 placeholder-gray-400"
             />
             <button 
               onClick={handleAiGenerate}
               disabled={isGenerating || !aiTopic}
               className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition"
             >
                {isGenerating ? <RefreshCcw className="animate-spin" size={18}/> : <Plus size={18} />}
             </button>
           </div>
           <p className="text-xs text-indigo-400 mt-2">يعتمد على Gemini API</p>
        </section>

        {/* Questions List */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">الأسئلة ({data.questions.length})</h3>
            <button 
              onClick={addQuestion}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <Plus size={16} />
              إضافة سؤال
            </button>
          </div>
          <div className="space-y-3">
            {data.questions.map((q, idx) => (
              <div key={q.id} className="group relative">
                <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition">
                  <button 
                    onClick={() => removeQuestion(q.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-400 mb-1 text-right">سؤال {idx + 1}</div>
                <textarea
                  value={q.text}
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  className={`${inputClass} min-h-[60px]`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Footer Info */}
        <section className="space-y-3 pb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">التذييل</h3>
          <input 
            type="text" 
            value={data.professorName}
            onChange={(e) => handleInputChange('professorName', e.target.value)}
            className={inputClass}
            placeholder="اسم التدريسي"
          />
        </section>
      </div>
    </div>
  );
};