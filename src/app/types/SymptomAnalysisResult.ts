export interface SymptomAnalysisResult {
  possibleCondition: string;
  severity: 'mild' | 'moderate' | 'severe';
  selfCareTips: string;
  recommendedDoctor: string;
  symptomsExtracted: string[];
  feelingSummary: string;
  additionalNotes: string;
  nextSteps: string[];
}
