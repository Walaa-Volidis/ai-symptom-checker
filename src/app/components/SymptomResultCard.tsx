'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Heart, Stethoscope, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SymptomAnalysisResult } from '../types/SymptomAnalysisResult';
import { TextToSpeech } from './TextToSpeech';
export const SymptomResultCard: React.FC<{ data: SymptomAnalysisResult }> = ({
  data,
}) => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const getSeverityColor = (severity: string) => {
    const severityLower = severity.toLowerCase();
    const colors: Record<string, string> = {
      mild: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      moderate:
        'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      severe:
        'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    };
    return (
      colors[severityLower] ||
      'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    );
  };

  const translateSeverity = (severity: string) => {
    const severityLower = severity.toLowerCase();
    const severityMap: Record<string, string> = {
      mild: t('mild'),
      moderate: t('moderate'),
      severe: t('severe'),
    };
    return severityMap[severityLower] || severity;
  };


  const createSpeechText = () => {
  const severityText = translateSeverity(data.severity);
  
  return `
    ${t('analysisComplete')}.
    ${t('possibleCondition')}: ${data.possibleCondition}.
    ${t('severityLevel')}: ${severityText}.
    
    ${t('summary')}: ${data.feelingSummary}.
    
    ${t('selfCareTips')}: ${data.selfCareTips}.
    
    ${t('recommendedSpecialist')}: ${data.recommendedDoctor}.
    
    ${t('nextSteps')}:
    ${data.nextSteps
      .map((step: string, idx: number) => `${idx + 1}. ${step}`)
      .join('. ')}.
    
    ${t('importantNote')}: ${data.additionalNotes}.
  `.trim();
};

  return (
    <div
      className="space-y-6 mt-8 opacity-0 animate-fade-in"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Main Result Card */}
      <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-2 border-blue-100 dark:border-gray-700 overflow-hidden">
        <CardHeader className="pb-4">
          <div
            className={`flex items-center justify-between ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Left side: Title with icon */}
            <div
              className={`flex items-center gap-3 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {t('analysisComplete')}
              </CardTitle>
            </div>

            <TextToSpeech text={createSpeechText()} autoPlay={false} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Possible Condition */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
              {t('possibleCondition')}
            </p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {data.possibleCondition}
            </p>
          </div>

          {/* Severity Badge */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
              {t('severityLevel')}
            </p>
            <span
              className={`inline-block px-6 py-3 rounded-full font-semibold text-lg border-2 ${getSeverityColor(
                data.severity
              )}`}
            >
              {translateSeverity(data.severity)}
            </span>
          </div>

          {/* Feeling Summary */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
              {t('summary')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.feelingSummary}
            </p>
          </div>

          {/* Extracted Symptoms */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
              {t('identifiedSymptoms')}
            </p>
            <div
              className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}
            >
              {data.symptomsExtracted.map((symptom: string, idx: number) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:scale-105"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Self-Care Tips */}
        <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border dark:border-gray-700">
          <CardHeader>
            <div
              className={`flex items-center gap-2 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {t('selfCareTips')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.selfCareTips}
            </p>
          </CardContent>
        </Card>

        {/* Recommended Doctor */}
        <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border dark:border-gray-700">
          <CardHeader>
            <div
              className={`flex items-center gap-2 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {t('recommendedSpecialist')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {data.recommendedDoctor}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t('nextSteps')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.nextSteps.map((step: string, idx: number) => (
              <div
                key={idx}
                className={`flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1 ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-3xl p-6">
        <div
          className={`flex items-start gap-4 ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
              {t('importantNote')}
            </h3>
            <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
              {data.additionalNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
