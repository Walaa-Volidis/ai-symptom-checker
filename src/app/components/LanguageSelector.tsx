'use client';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSelector() {
  const { language, setLanguage} = useLanguage();

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl shadow-lg px-4 py-3 border-2 border-blue-100">
      <Languages className="w-5 h-5 text-blue-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
        className="bg-transparent outline-none cursor-pointer text-gray-700 font-medium"
        style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}
