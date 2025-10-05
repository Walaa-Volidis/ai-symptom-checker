'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Heart, Stethoscope, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; 
import { SymptomAnalysisResult } from '../types/SymptomAnalysisResult';

export function SymptomResultCard({ data }: { data: SymptomAnalysisResult }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const getSeverityColor = (severity: string) => {
    const severityLower = severity.toLowerCase();
    const colors: Record<string, string> = {
      mild: 'text-green-600 bg-green-50 border-green-200',
      moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      severe: 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[severityLower] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const translateSeverity = (severity: string) => {
    const severityLower = severity.toLowerCase();
    const severityMap: Record<string, string> = {
      'mild': t('mild'),
      'moderate': t('moderate'),
      'severe': t('severe'),
    };
    return severityMap[severityLower] || severity;
  };

  return (
    <div className="space-y-6 mt-8 opacity-0 animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main Result Card */}
      <Card className="bg-white rounded-3xl shadow-xl border-2 border-blue-100 overflow-hidden">
        <CardHeader className="pb-4">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}> 
            <CheckCircle className="w-8 h-8 text-green-600" />
            <CardTitle className="text-3xl font-bold text-gray-800">
              {t('analysisComplete')} 
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Possible Condition */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              {t('possibleCondition')}
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {data.possibleCondition}
            </p>
          </div>

          {/* Severity Badge */}
          <div>
            <p className="text-sm text-gray-600 mb-2 font-medium">
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
          <div className="p-6 bg-gray-50 rounded-2xl">
            <p className="text-sm text-gray-600 mb-2 font-medium">{t('summary')}</p>
            <p className="text-gray-700 leading-relaxed">
              {data.feelingSummary}
            </p>
          </div>

          {/* Extracted Symptoms */}
          <div>
            <p className="text-sm text-gray-600 mb-3 font-medium">
              {t('identifiedSymptoms')} 
            </p>
            <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
              {data.symptomsExtracted.map((symptom: string, idx: number) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-200 hover:scale-105"
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
        <Card className="bg-white rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}> 
              <Heart className="w-6 h-6 text-pink-600" />
              <CardTitle className="text-xl font-bold text-gray-800">
                {t('selfCareTips')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{data.selfCareTips}</p>
          </CardContent>
        </Card>

        {/* Recommended Doctor */}
        <Card className="bg-white rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}> 
              <Stethoscope className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-xl font-bold text-gray-800">
                {t('recommendedSpecialist')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600">
              {data.recommendedDoctor}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="bg-white rounded-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {t('nextSteps')} 
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.nextSteps.map((step: string, idx: number) => (
              <div
                key={idx}
                className={`flex items-start gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:bg-gray-100 hover:translate-x-1 ${
                  isRTL ? 'flex-row-reverse' : ''
                }`} 
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <p className="text-gray-700 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6">
        <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-2">
              {t('importantNote')} 
            </h3>
            <p className="text-amber-700 leading-relaxed">
              {data.additionalNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}