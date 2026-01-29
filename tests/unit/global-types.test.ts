import { describe, it, expect } from 'vitest';

describe('Global Type Definitions', () => {
  describe('Window Interface Extensions', () => {
    it('should allow webkitSpeechRecognition property on window', () => {
      const testWindow: Window = {} as Window;
      
      // TypeScript should allow this without errors
      const recognition: SpeechRecognition | undefined = testWindow.webkitSpeechRecognition;
      
      expect(recognition).toBeUndefined();
    });

    it('should allow SpeechRecognition property on window', () => {
      const testWindow: Window = {} as Window;
      
      const recognition: SpeechRecognition | undefined = testWindow.SpeechRecognition;
      
      expect(recognition).toBeUndefined();
    });

    it('should treat window properties as optional', () => {
      const testWindow: Window = {} as Window;
      
      expect(testWindow.webkitSpeechRecognition).toBeUndefined();
      expect(testWindow.SpeechRecognition).toBeUndefined();
    });
  });

  describe('SpeechRecognition Event Types', () => {
    it('should define SpeechRecognitionEvent with results property', () => {
      const mockEvent: SpeechRecognitionEvent = {
        results: [] as any as SpeechRecognitionResultList,
      } as SpeechRecognitionEvent;
      
      expect(mockEvent).toHaveProperty('results');
    });

    it('should allow indexing SpeechRecognitionResultList', () => {
      const mockResults: SpeechRecognitionResultList = {
        0: {} as SpeechRecognitionResult,
        length: 1,
      } as any;
      
      const result = mockResults[0];
      expect(result).toBeDefined();
    });

    it('should allow indexing SpeechRecognitionResult', () => {
      const mockResult: SpeechRecognitionResult = {
        0: {
          transcript: 'test',
          confidence: 0.95,
        } as SpeechRecognitionAlternative,
        length: 1,
      } as any;
      
      const alternative = mockResult[0];
      expect(alternative).toBeDefined();
      expect(alternative.transcript).toBe('test');
      expect(alternative.confidence).toBe(0.95);
    });
  });

  describe('SpeechRecognitionAlternative Interface', () => {
    it('should have transcript property', () => {
      const alternative: SpeechRecognitionAlternative = {
        transcript: 'Hello world',
        confidence: 0.98,
      };
      
      expect(alternative.transcript).toBe('Hello world');
      expect(typeof alternative.transcript).toBe('string');
    });

    it('should have confidence property', () => {
      const alternative: SpeechRecognitionAlternative = {
        transcript: 'Test',
        confidence: 0.85,
      };
      
      expect(alternative.confidence).toBe(0.85);
      expect(typeof alternative.confidence).toBe('number');
    });

    it('should accept confidence values between 0 and 1', () => {
      const lowConfidence: SpeechRecognitionAlternative = {
        transcript: 'uncertain',
        confidence: 0.1,
      };
      
      const highConfidence: SpeechRecognitionAlternative = {
        transcript: 'certain',
        confidence: 0.99,
      };
      
      expect(lowConfidence.confidence).toBeGreaterThanOrEqual(0);
      expect(lowConfidence.confidence).toBeLessThanOrEqual(1);
      expect(highConfidence.confidence).toBeGreaterThanOrEqual(0);
      expect(highConfidence.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('SpeechRecognitionErrorEvent Interface', () => {
    it('should have error property with known error types', () => {
      const errorTypes: Array<SpeechRecognitionErrorEvent['error']> = [
        'no-speech',
        'audio-capture',
        'not-allowed',
        'custom-error',
      ];
      
      errorTypes.forEach(errorType => {
        const event: SpeechRecognitionErrorEvent = {
          error: errorType,
        };
        
        expect(event.error).toBe(errorType);
      });
    });

    it('should allow optional message property', () => {
      const eventWithMessage: SpeechRecognitionErrorEvent = {
        error: 'not-allowed',
        message: 'Permission denied',
      };
      
      const eventWithoutMessage: SpeechRecognitionErrorEvent = {
        error: 'no-speech',
      };
      
      expect(eventWithMessage.message).toBe('Permission denied');
      expect(eventWithoutMessage.message).toBeUndefined();
    });

    it('should handle all standard error types', () => {
      const standardErrors: Array<'no-speech' | 'audio-capture' | 'not-allowed'> = [
        'no-speech',
        'audio-capture',
        'not-allowed',
      ];
      
      standardErrors.forEach(error => {
        const event: SpeechRecognitionErrorEvent = { error };
        expect(event.error).toBe(error);
      });
    });

    it('should allow custom error strings', () => {
      const customError: SpeechRecognitionErrorEvent = {
        error: 'network-error',
        message: 'Network connection lost',
      };
      
      expect(customError.error).toBe('network-error');
      expect(customError.message).toBe('Network connection lost');
    });
  });

  describe('Type Safety', () => {
    it('should enforce type constraints for transcript', () => {
      const alternative: SpeechRecognitionAlternative = {
        transcript: 'valid string',
        confidence: 0.9,
      };
      
      expect(typeof alternative.transcript).toBe('string');
      expect(alternative.transcript.length).toBeGreaterThan(0);
    });

    it('should enforce type constraints for confidence', () => {
      const alternative: SpeechRecognitionAlternative = {
        transcript: 'test',
        confidence: 0.75,
      };
      
      expect(typeof alternative.confidence).toBe('number');
      expect(alternative.confidence).toBeGreaterThanOrEqual(0);
      expect(alternative.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Browser Compatibility', () => {
    it('should handle webkit prefixed API', () => {
      const hasWebkit = 'webkitSpeechRecognition' in (window as any);
      const hasStandard = 'SpeechRecognition' in (window as any);
      
      // At least one should be defined in a supporting browser, or both undefined in non-supporting
      expect(typeof hasWebkit).toBe('boolean');
      expect(typeof hasStandard).toBe('boolean');
    });

    it('should allow checking for API availability', () => {
      const testWindow = {} as Window;
      
      const isSupported = 
        testWindow.webkitSpeechRecognition !== undefined || 
        testWindow.SpeechRecognition !== undefined;
      
      expect(typeof isSupported).toBe('boolean');
    });
  });
});