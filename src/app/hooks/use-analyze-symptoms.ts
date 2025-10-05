import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext'; 

export function useSymptomCheck() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const { language } = useLanguage();

  async function checkSymptoms(userInput: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput, language }), 
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to analyze symptoms');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, result, checkSymptoms };
}
