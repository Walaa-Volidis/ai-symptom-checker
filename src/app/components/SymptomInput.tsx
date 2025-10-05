'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Activity, Heart, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; 

export function SymptomInput({
  onSubmit,
  loading = false,
}: {
  onSubmit: (input: string) => void;
  loading?: boolean;
}) {
  const [input, setInput] = useState('');
  const { language, t } = useLanguage(); 
  const isRTL = language === 'ar';

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl opacity-0 animate-fade-in animation-delay-200">
      <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}> {/* ✅ ADDED RTL */}
        <Activity className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          {t('inputTitle')} 
        </h2>
      </div>

      <Textarea
        placeholder={t('inputPlaceholder')} 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 resize-none text-gray-700"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      />

      <Button
        onClick={handleSubmit}
        disabled={!input.trim() || loading}
        className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('analyzing')}
          </>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            {t('analyzeButton')} 
          </>
        )}
      </Button>
    </div>
  );
}