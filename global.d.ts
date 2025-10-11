interface Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: 'no-speech' | 'audio-capture' | 'not-allowed' | string;
  message?: string;
}
