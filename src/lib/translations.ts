export const translations = {
  en: {
    // Header
    appTitle: 'AI Symptom Checker',
    appSubtitle:
      'Describe your symptoms and get instant insights powered by AI',

    // Input Section
    inputTitle: "Tell us how you're feeling",
    inputPlaceholder:
      "Describe your symptoms in detail... (e.g., 'I have a headache, feeling tired, and have a sore throat')",
    analyzeButton: 'Analyze Symptoms',
    analyzing: 'Analyzing...',

    // Voice Input
    voiceInput: 'Voice Input',
    listening: 'Listening...',
    stopRecording: 'Stop Recording',
    voiceNotSupported:
      'Voice input is not supported in your browser. Please use Chrome or Edge.',
    noSpeechDetected: 'No speech detected. Please try again.',
    microphoneAccess: 'Microphone access is required.',
    speakNow: 'Speak now...',

    // Results
    analysisComplete: 'Analysis Complete',
    possibleCondition: 'Possible Condition',
    severityLevel: 'Severity Level',
    summary: 'Summary',
    identifiedSymptoms: 'Identified Symptoms',
    selfCareTips: 'Self-Care Tips',
    recommendedSpecialist: 'Recommended Specialist',
    nextSteps: 'Next Steps',
    importantNote: 'Important Note',

    // Severity
    mild: 'Mild',
    moderate: 'Moderate',
    severe: 'Severe',

    // Loading
    analyzingSymptoms: 'Analyzing your symptoms...',
    takeMoments: 'This may take a few moments',

    // Language
    language: 'Language',
    selectLanguage: 'Select Language',
  },
  ar: {
    // Header
    appTitle: 'فاحص الأعراض بالذكاء الاصطناعي',
    appSubtitle: 'صف أعراضك واحصل على رؤى فورية بواسطة الذكاء الاصطناعي',

    // Input Section
    inputTitle: 'أخبرنا كيف تشعر',
    inputPlaceholder:
      "صف أعراضك بالتفصيل... (مثال: 'لدي صداع، أشعر بالتعب، ولدي التهاب في الحلق')",
    analyzeButton: 'تحليل الأعراض',
    analyzing: 'جاري التحليل...',

    // Voice Input
    voiceInput: 'الإدخال الصوتي',
    listening: 'جاري الاستماع...',
    stopRecording: 'إيقاف التسجيل',
    voiceNotSupported:
      'الإدخال الصوتي غير مدعوم في متصفحك. يرجى استخدام Chrome أو Edge.',
    noSpeechDetected: 'لم يتم اكتشاف صوت. حاول مرة أخرى.',
    microphoneAccess: 'يجب السماح بالوصول إلى الميكروفون.',
    speakNow: 'تحدث الآن...',
    // Results
    analysisComplete: 'اكتمل التحليل',
    possibleCondition: 'الحالة المحتملة',
    severityLevel: 'مستوى الخطورة',
    summary: 'ملخص',
    identifiedSymptoms: 'الأعراض المحددة',
    selfCareTips: 'نصائح للعناية الذاتية',
    recommendedSpecialist: 'الاختصاصي الموصى به',
    nextSteps: 'الخطوات التالية',
    importantNote: 'ملاحظة هامة',

    // Severity
    mild: 'خفيف',
    moderate: 'متوسط',
    severe: 'شديد',

    // Loading
    analyzingSymptoms: 'جاري تحليل الأعراض...',
    takeMoments: 'قد يستغرق ذلك بضع لحظات',

    // Language
    language: 'اللغة',
    selectLanguage: 'اختر اللغة',
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;