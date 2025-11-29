export interface Question {
  id: string;
  text: string;
}

export interface ExamData {
  universityName: string;
  collegeName: string;
  examTitle: string;
  studentNameLabel: string;
  date: string;
  note: string;
  logoUrl: string | null;
  professorName: string;
  questions: Question[];
}

export const DEFAULT_LOGO = "https://i.imgur.com/8Q5X4Xk.png"; // Placeholder for the university logo provided in prompt logic or generic

export const INITIAL_DATA: ExamData = {
  universityName: "جامعة العلوم العراقية",
  collegeName: "كلية القانون",
  examTitle: "الامتحان النهائي / الدور الأول",
  studentNameLabel: "اسم الطالب: __________________",
  date: new Date().toLocaleDateString('ar-IQ'),
  note: "ملاحظة: أجب عن خمسة أسئلة فقط من أصل سبعة.",
  logoUrl: null, // Will use placeholder if null
  professorName: "",
  questions: [
    { id: '1', text: 'عرف القانون الدستوري واذكر مصادره بالتفصيل.' },
    { id: '2', text: 'ميز بين الحقوق الشخصية والحقوق العينية مع ذكر الأمثلة.' },
    { id: '3', text: 'اشرح أركان العقد في القانون المدني العراقي.' },
  ]
};