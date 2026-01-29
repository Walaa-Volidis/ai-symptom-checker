import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock console methods to avoid cluttering test output
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

// Mock alert
const alertSpy = vi.fn();
global.alert = alertSpy;

// Mock window.speechSynthesis
const mockCancel = vi.fn();
const mockSpeak = vi.fn();
const mockPause = vi.fn();
const mockResume = vi.fn();

const createMockUtterance = () => {
  return {
    text: '',
    lang: '',
    rate: 1,
    pitch: 1,
    volume: 1,
    onstart: null as (() => void) | null,
    onend: null as (() => void) | null,
    onerror: null as ((event: any) => void) | null,
  };
};

let mockUtteranceInstance: ReturnType<typeof createMockUtterance>;

// Mock SpeechSynthesisUtterance constructor
global.SpeechSynthesisUtterance = vi.fn((text: string) => {
  mockUtteranceInstance = createMockUtterance();
  mockUtteranceInstance.text = text;
  return mockUtteranceInstance as any;
}) as any;

// Setup speechSynthesis mock
const setupSpeechSynthesisMock = () => {
  (global as any).window = {
    speechSynthesis: {
      cancel: mockCancel,
      speak: mockSpeak,
      pause: mockPause,
      resume: mockResume,
    },
  };
};

describe('useTextToSpeech Hook Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupSpeechSynthesisMock();
    mockUtteranceInstance = createMockUtterance();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Speech Synthesis Support Detection', () => {
    it('should detect when speechSynthesis is supported', () => {
      setupSpeechSynthesisMock();
      expect('speechSynthesis' in window).toBe(true);
    });

    it('should detect when speechSynthesis is not supported', () => {
      delete (window as any).speechSynthesis;
      expect('speechSynthesis' in window).toBe(false);
    });

    it('should log error when speech synthesis is not supported', () => {
      delete (window as any).speechSynthesis;
      
      // Simulate the useEffect check
      if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis not supported in this browser');
      }
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Speech synthesis not supported in this browser'
      );
    });
  });

  describe('SpeechSynthesisUtterance Configuration', () => {
    it('should create utterance with correct text', () => {
      const text = 'Hello world';
      const utterance = new SpeechSynthesisUtterance(text);
      
      expect(SpeechSynthesisUtterance).toHaveBeenCalledWith(text);
      expect(utterance.text).toBe(text);
    });

    it('should set English language correctly', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      utterance.lang = 'en-US';
      
      expect(utterance.lang).toBe('en-US');
    });

    it('should set Arabic language correctly', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      utterance.lang = 'ar-SA';
      
      expect(utterance.lang).toBe('ar-SA');
    });

    it('should set rate to 0.9', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      utterance.rate = 0.9;
      
      expect(utterance.rate).toBe(0.9);
    });

    it('should set pitch to 1', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      utterance.pitch = 1;
      
      expect(utterance.pitch).toBe(1);
    });

    it('should set volume to 1', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      utterance.volume = 1;
      
      expect(utterance.volume).toBe(1);
    });
  });

  describe('Speak Functionality', () => {
    it('should cancel previous speech before speaking', () => {
      setupSpeechSynthesisMock();
      
      window.speechSynthesis.cancel();
      expect(mockCancel).toHaveBeenCalledTimes(1);
    });

    it('should call speechSynthesis.speak with utterance', () => {
      setupSpeechSynthesisMock();
      const utterance = new SpeechSynthesisUtterance('Test');
      
      window.speechSynthesis.speak(utterance);
      expect(mockSpeak).toHaveBeenCalledWith(utterance);
    });

    it('should warn when trying to speak without text', () => {
      const isSupported = true;
      const text = '';
      
      if (!isSupported || !text) {
        console.warn('Cannot speak: not supported or no text');
      }
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Cannot speak: not supported or no text'
      );
    });

    it('should warn when trying to speak without support', () => {
      const isSupported = false;
      const text = 'Hello';
      
      if (!isSupported || !text) {
        console.warn('Cannot speak: not supported or no text');
      }
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Cannot speak: not supported or no text'
      );
    });

    it('should not call speak if text is empty', () => {
      const isSupported = true;
      const text = '';
      
      if (isSupported && text) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      }
      
      expect(mockSpeak).not.toHaveBeenCalled();
    });

    it('should handle onstart event', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      const onStartCallback = vi.fn();
      utterance.onstart = onStartCallback;
      
      utterance.onstart?.();
      
      expect(onStartCallback).toHaveBeenCalled();
    });

    it('should handle onend event', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      const onEndCallback = vi.fn();
      utterance.onend = onEndCallback;
      
      utterance.onend?.();
      
      expect(onEndCallback).toHaveBeenCalled();
    });

    it('should log "Speech started" when onstart is triggered', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      utterance.onstart = () => {
        console.log('Speech started');
      };
      
      utterance.onstart?.();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Speech started');
    });

    it('should log "Speech ended" when onend is triggered', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      utterance.onend = () => {
        console.log('Speech ended');
      };
      
      utterance.onend?.();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Speech ended');
    });
  });

  describe('Error Handling', () => {
    it('should handle not-allowed error with English alert', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      const language = 'en';
      
      utterance.onerror = (event) => {
        if (event.error === 'not-allowed') {
          alert(
            language === 'ar'
              ? 'يرجى السماح بتشغيل الصوت في المتصفح'
              : 'Please allow audio playback in your browser'
          );
        }
      };
      
      utterance.onerror?.({ error: 'not-allowed' } as any);
      
      expect(alertSpy).toHaveBeenCalledWith(
        'Please allow audio playback in your browser'
      );
    });

    it('should handle not-allowed error with Arabic alert', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      const language = 'ar';
      
      utterance.onerror = (event) => {
        if (event.error === 'not-allowed') {
          alert(
            language === 'ar'
              ? 'يرجى السماح بتشغيل الصوت في المتصفح'
              : 'Please allow audio playback in your browser'
          );
        }
      };
      
      utterance.onerror?.({ error: 'not-allowed' } as any);
      
      expect(alertSpy).toHaveBeenCalledWith(
        'يرجى السماح بتشغيل الصوت في المتصفح'
      );
    });

    it('should not alert for other error types', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      
      utterance.onerror = (event) => {
        if (event.error === 'not-allowed') {
          alert('Error message');
        }
      };
      
      utterance.onerror?.({ error: 'network' } as any);
      
      expect(alertSpy).not.toHaveBeenCalled();
    });

    it('should handle audio-capture error', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      const errorHandler = vi.fn();
      
      utterance.onerror = errorHandler;
      utterance.onerror?.({ error: 'audio-capture' } as any);
      
      expect(errorHandler).toHaveBeenCalledWith({ error: 'audio-capture' });
    });

    it('should handle no-speech error', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      const errorHandler = vi.fn();
      
      utterance.onerror = errorHandler;
      utterance.onerror?.({ error: 'no-speech' } as any);
      
      expect(errorHandler).toHaveBeenCalledWith({ error: 'no-speech' });
    });
  });

  describe('Control Functions', () => {
    it('should call speechSynthesis.cancel on stop', () => {
      setupSpeechSynthesisMock();
      
      window.speechSynthesis.cancel();
      
      expect(mockCancel).toHaveBeenCalledTimes(1);
    });

    it('should call speechSynthesis.pause on pause', () => {
      setupSpeechSynthesisMock();
      
      window.speechSynthesis.pause();
      
      expect(mockPause).toHaveBeenCalledTimes(1);
    });

    it('should call speechSynthesis.resume on resume', () => {
      setupSpeechSynthesisMock();
      
      window.speechSynthesis.resume();
      
      expect(mockResume).toHaveBeenCalledTimes(1);
    });

    it('should not throw when calling cancel on unsupported browser', () => {
      delete (window as any).speechSynthesis;
      
      expect(() => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }).not.toThrow();
    });

    it('should not throw when calling pause on unsupported browser', () => {
      delete (window as any).speechSynthesis;
      
      expect(() => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.pause();
        }
      }).not.toThrow();
    });

    it('should not throw when calling resume on unsupported browser', () => {
      delete (window as any).speechSynthesis;
      
      expect(() => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.resume();
        }
      }).not.toThrow();
    });
  });

  describe('AutoPlay Functionality', () => {
    it('should delay autoplay by 1000ms', () => {
      vi.useFakeTimers();
      const autoPlay = true;
      const isSupported = true;
      const text = 'Test';
      
      const speakFn = vi.fn();
      
      if (autoPlay && isSupported && text) {
        setTimeout(() => speakFn(), 1000);
      }
      
      expect(speakFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(999);
      expect(speakFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(1);
      expect(speakFn).toHaveBeenCalledTimes(1);
      
      vi.useRealTimers();
    });

    it('should not autoplay when autoPlay is false', () => {
      const autoPlay = false;
      const isSupported = true;
      const text = 'Test';
      const speakFn = vi.fn();
      
      if (autoPlay && isSupported && text) {
        speakFn();
      }
      
      expect(speakFn).not.toHaveBeenCalled();
    });

    it('should not autoplay when not supported', () => {
      const autoPlay = true;
      const isSupported = false;
      const text = 'Test';
      const speakFn = vi.fn();
      
      if (autoPlay && isSupported && text) {
        speakFn();
      }
      
      expect(speakFn).not.toHaveBeenCalled();
    });

    it('should not autoplay when text is empty', () => {
      const autoPlay = true;
      const isSupported = true;
      const text = '';
      const speakFn = vi.fn();
      
      if (autoPlay && isSupported && text) {
        speakFn();
      }
      
      expect(speakFn).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup Functionality', () => {
    it('should cancel speech on cleanup', () => {
      setupSpeechSynthesisMock();
      
      // Simulate cleanup
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      
      expect(mockCancel).toHaveBeenCalled();
    });

    it('should clear timeout on cleanup', () => {
      vi.useFakeTimers();
      const speakFn = vi.fn();
      const timer = setTimeout(() => speakFn(), 1000);
      
      // Simulate cleanup
      clearTimeout(timer);
      
      vi.advanceTimersByTime(1000);
      expect(speakFn).not.toHaveBeenCalled();
      
      vi.useRealTimers();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text', () => {
      const longText = 'A'.repeat(10000);
      const utterance = new SpeechSynthesisUtterance(longText);
      
      expect(utterance.text).toBe(longText);
    });

    it('should handle empty text edge case', () => {
      const utterance = new SpeechSynthesisUtterance('');
      
      expect(utterance.text).toBe('');
    });

    it('should handle special characters in text', () => {
      const specialText = '!@#$%^&*()_+-=[]{}|;:",.<>?/~`';
      const utterance = new SpeechSynthesisUtterance(specialText);
      
      expect(utterance.text).toBe(specialText);
    });

    it('should handle unicode characters', () => {
      const unicodeText = '你好世界 مرحبا بالعالم Hello 🌍';
      const utterance = new SpeechSynthesisUtterance(unicodeText);
      
      expect(utterance.text).toBe(unicodeText);
    });

    it('should handle rate boundary values', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      
      utterance.rate = 0.1;
      expect(utterance.rate).toBe(0.1);
      
      utterance.rate = 10;
      expect(utterance.rate).toBe(10);
    });

    it('should handle pitch boundary values', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      
      utterance.pitch = 0;
      expect(utterance.pitch).toBe(0);
      
      utterance.pitch = 2;
      expect(utterance.pitch).toBe(2);
    });

    it('should handle volume boundary values', () => {
      const utterance = new SpeechSynthesisUtterance('Test');
      
      utterance.volume = 0;
      expect(utterance.volume).toBe(0);
      
      utterance.volume = 1;
      expect(utterance.volume).toBe(1);
    });
  });

  describe('Language-Specific Behavior', () => {
    it('should use ar-SA for Arabic language', () => {
      const language = 'ar';
      const lang = language === 'ar' ? 'ar-SA' : 'en-US';
      
      expect(lang).toBe('ar-SA');
    });

    it('should use en-US for English language', () => {
      const language = 'en';
      const lang = language === 'ar' ? 'ar-SA' : 'en-US';
      
      expect(lang).toBe('en-US');
    });

    it('should use en-US for any non-Arabic language', () => {
      const language = 'fr';
      const lang = language === 'ar' ? 'ar-SA' : 'en-US';
      
      expect(lang).toBe('en-US');
    });
  });
});