'use client';
import { useSymptomCheck } from './hooks/use-analyze-symptoms';
import { SymptomInput } from './components/SymptomInput';
import { SymptomResultCard } from './components/SymptomResultCard';
import { LanguageSelector } from './components/LanguageSelector';
import { useLanguage } from './contexts/LanguageContext'; 
import { Stethoscope, Sparkles, Loader2 } from 'lucide-react';

export default function HomePage() {
  const { loading, error, result, checkSymptoms } = useSymptomCheck();
  const { language, t } = useLanguage(); 
  const isRTL = language === 'ar'; 

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>
      <main className="relative max-w-4xl mx-auto px-4 py-12">
        <div
          className={`flex justify-end mb-6 opacity-0 animate-fade-in ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <LanguageSelector />
        </div>

        {/* Header */}
        <div className="text-center mb-12 opacity-0 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Stethoscope className="w-12 h-12 text-blue-600" />
              <Sparkles className="w-5 h-5 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {t('appTitle')} 
          </h1>
          <p className="text-gray-600 text-lg">
            {t('appSubtitle')}
          </p>
        </div>

        {/* Input Section */}
        <SymptomInput onSubmit={checkSymptoms} loading={loading} />

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center mt-8 opacity-0 animate-fade-in">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">{t('analyzingSymptoms')}</p>{' '}
            <p className="text-gray-400 text-sm mt-2">
              {t('takeMoments')} 
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 mt-8 opacity-0 animate-fade-in">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && <SymptomResultCard data={result} />}
      </main>
    </div>
  );
}
