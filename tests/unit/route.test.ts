import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';
vi.mock('../../src/settings.ts', () => ({
  SERVER_SETTINGS: { groqApiKey: 'test-key' },
}));

const { createSpy } = vi.hoisted(() => ({
  createSpy: vi.fn(),
}));

vi.mock('groq-sdk', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: { create: createSpy },
      },
    })),
  };
});

import { POST } from '../../src/app/api/analyze-symptoms/route';
const AnalyzeSymptomsInputSchema = z.object({
  userInput: z.string(),
  language: z.enum(['en', 'ar']).optional().default('en'),
});
type AnalyzeSymptomsBody = z.infer<typeof AnalyzeSymptomsInputSchema>;

function makeRequest(body: AnalyzeSymptomsBody) {
  return { json: async () => body } as unknown as Pick<Request, 'json'>;
}

async function readJson(res: Response) {
  const data = await res.json();
  return { status: (res as Response).status, data };
}

const validGroqPayload = {
  possibleCondition: 'Common cold',
  severity: 'mild',
  selfCareTips: 'Rest and drink fluids.',
  recommendedDoctor: 'General practitioner',
  symptomsExtracted: ['cough', 'runny nose'],
  feelingSummary: 'Feeling tired and stuffy.',
  additionalNotes: 'Monitor symptoms for 48 hours.',
  nextSteps: ['Rest', 'Hydrate'],
};

describe('POST /api/health', () => {
  beforeEach(() => {
    createSpy.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when userInput is missing', async () => {
    const req = makeRequest({ language: 'en' } as AnalyzeSymptomsBody);
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);
    expect(status).toBe(400);
    expect(data).toEqual({ error: 'Input is required' });
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('returns 200 with valid parsed data (English)', async () => {
    createSpy.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(validGroqPayload),
          },
        },
      ],
    });

    const req = makeRequest({
      userInput: 'I have a cough and runny nose',
      language: 'en',
    } as AnalyzeSymptomsBody);
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);

    expect(status).toBe(200);
    expect(data).toEqual(validGroqPayload);
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'llama-3.1-8b-instant',
        response_format: { type: 'json_object' },
      })
    );
  });

  it('returns 200 with valid parsed data (Arabic)', async () => {
    const arabicPayload = {
      possibleCondition: 'نزلة برد',
      severity: 'moderate',
      selfCareTips: 'اشرب سوائل دافئة واسترح.',
      recommendedDoctor: 'طبيب عام',
      symptomsExtracted: ['سعال', 'انسداد الأنف'],
      feelingSummary: 'أشعر بالإرهاق وانسداد الأنف.',
      additionalNotes: 'راقب الأعراض لمدة 48 ساعة.',
      nextSteps: ['الراحة', 'السوائل'],
    };
    createSpy.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(arabicPayload) } }],
    });

    const req = makeRequest({
      userInput: 'سعال وانسداد الأنف',
      language: 'ar',
    } as AnalyzeSymptomsBody);
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);

    expect(status).toBe(200);
    expect(data).toEqual(arabicPayload);
  });

  it('returns 500 if Groq returns no content', async () => {
    createSpy.mockResolvedValueOnce({
      choices: [{ message: { content: undefined } }],
    });

    const req = makeRequest({ userInput: 'headache', language: 'en' } as AnalyzeSymptomsBody);
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);

    expect(status).toBe(500);
    expect(data).toEqual({ error: 'No content returned by Groq' });
  });

  it('returns 500 if schema validation fails', async () => {
    createSpy.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ foo: 'bar' }) } }],
    });

    const req = makeRequest({ userInput: 'random text', language: 'en' } as AnalyzeSymptomsBody);
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);

    expect(status).toBe(500);
    expect(data.error).toBe('Invalid response format from Groq');
    expect(typeof data.rawContent).toBe('string');
  });

  it('returns 500 on Groq client error (exception thrown)', async () => {
    createSpy.mockRejectedValueOnce(new Error('API down'));

    const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);

    expect(status).toBe(500);
    expect(data.error).toMatch(/Server error: API down/);
  });
});

describe('POST /api/health - Extended Tests', () => {
  beforeEach(() => {
    createSpy.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Input Validation Edge Cases', () => {
    it('returns 400 when userInput is an empty string', async () => {
      const req = makeRequest({ userInput: '', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status, data } = await readJson(res as unknown as Response);
      
      expect(status).toBe(400);
      expect(data).toEqual({ error: 'Input is required' });
    });

    it('returns 400 when userInput is only whitespace', async () => {
      const req = makeRequest({ userInput: '   ', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status, data } = await readJson(res as unknown as Response);
      
      expect(status).toBe(400);
      expect(data).toEqual({ error: 'Input is required' });
    });

    it('handles very long userInput', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validGroqPayload) } }],
      });

      const longInput = 'A'.repeat(5000);
      const req = makeRequest({ userInput: longInput, language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status } = await readJson(res as unknown as Response);
      
      expect(status).toBe(200);
      expect(createSpy).toHaveBeenCalled();
    });

    it('handles special characters in userInput', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validGroqPayload) } }],
      });

      const specialInput = '!@#$%^&*() headache <script>alert("test")</script>';
      const req = makeRequest({ userInput: specialInput, language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status } = await readJson(res as unknown as Response);
      
      expect(status).toBe(200);
    });

    it('handles unicode characters in userInput', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validGroqPayload) } }],
      });

      const unicodeInput = '头痛 тошнота 🤒😷';
      const req = makeRequest({ userInput: unicodeInput, language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status } = await readJson(res as unknown as Response);
      
      expect(status).toBe(200);
    });
  });

  describe('Language Parameter Tests', () => {
    it('defaults to English when language is not specified', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validGroqPayload) } }],
      });

      const req = makeRequest({ userInput: 'headache' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status } = await readJson(res as unknown as Response);
      
      expect(status).toBe(200);
      expect(createSpy).toHaveBeenCalled();
    });

    it('processes mixed language input', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validGroqPayload) } }],
      });

      const mixedInput = 'I have صداع and cough';
      const req = makeRequest({ userInput: mixedInput, language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status } = await readJson(res as unknown as Response);
      
      expect(status).toBe(200);
    });
  });

  describe('Response Format Validation', () => {
    it('returns 500 when Groq returns empty string', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: '' } }],
      });

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status, data } = await readJson(res as unknown as Response);
      
      expect(status).toBe(500);
      expect(data.error).toBeDefined();
    });

    it('returns 500 when Groq returns null content', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: null } }],
      });

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status } = await readJson(res as unknown as Response);
      
      expect(status).toBe(500);
    });

    it('returns 500 when Groq returns invalid JSON', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: '{invalid json}' } }],
      });

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status, data } = await readJson(res as unknown as Response);
      
      expect(status).toBe(500);
      expect(data.error).toBeDefined();
    });

    it('returns 500 when response is missing required fields', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ 
          message: { 
            content: JSON.stringify({ 
              possibleCondition: 'Flu',
            }) 
          } 
        }],
      });

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status, data } = await readJson(res as unknown as Response);
      
      expect(status).toBe(500);
      expect(data.error).toBe('Invalid response format from Groq');
    });

    it('returns 500 when choices array is empty', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [],
      });

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status } = await readJson(res as unknown as Response);
      
      expect(status).toBe(500);
    });
  });

  describe('API Call Parameters', () => {
    it('calls Groq with correct model', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validGroqPayload) } }],
      });

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      await POST(req);
      
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'llama-3.1-8b-instant',
        })
      );
    });

    it('calls Groq with JSON response format', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validGroqPayload) } }],
      });

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      await POST(req);
      
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          response_format: { type: 'json_object' },
        })
      );
    });

    it('includes user input in API call', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validGroqPayload) } }],
      });

      const userInput = 'I have a severe headache and nausea';
      const req = makeRequest({ userInput, language: 'en' } as AnalyzeSymptomsBody);
      await POST(req);
      
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining(userInput),
            }),
          ]),
        })
      );
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('handles network timeout errors', async () => {
      createSpy.mockRejectedValueOnce(new Error('Network timeout'));

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status, data } = await readJson(res as unknown as Response);
      
      expect(status).toBe(500);
      expect(data.error).toMatch(/Network timeout/);
    });

    it('handles rate limit errors', async () => {
      createSpy.mockRejectedValueOnce(new Error('Rate limit exceeded'));

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status, data } = await readJson(res as unknown as Response);
      
      expect(status).toBe(500);
      expect(data.error).toMatch(/Rate limit exceeded/);
    });

    it('handles authentication errors', async () => {
      createSpy.mockRejectedValueOnce(new Error('Invalid API key'));

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status, data } = await readJson(res as unknown as Response);
      
      expect(status).toBe(500);
      expect(data.error).toMatch(/Invalid API key/);
    });

    it('handles unexpected error types', async () => {
      createSpy.mockRejectedValueOnce('Unexpected string error');

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status, data } = await readJson(res as unknown as Response);
      
      expect(status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('Concurrent Request Handling', () => {
    it('handles multiple simultaneous requests', async () => {
      createSpy.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(validGroqPayload) } }],
      });

      const requests = Array.from({ length: 5 }, (_, i) => 
        makeRequest({ userInput: `symptom ${i}`, language: 'en' } as AnalyzeSymptomsBody)
      );

      const responses = await Promise.all(requests.map(req => POST(req)));
      
      responses.forEach(async (res) => {
        const { status } = await readJson(res as unknown as Response);
        expect(status).toBe(200);
      });
      
      expect(createSpy).toHaveBeenCalledTimes(5);
    });
  });

  describe('Data Integrity', () => {
    it('preserves Arabic text correctly', async () => {
      const arabicPayload = {
        possibleCondition: 'نزلة برد شديدة',
        severity: 'severe',
        selfCareTips: 'اشرب الماء الدافئ مع العسل',
        recommendedDoctor: 'طبيب أمراض باطنية',
        symptomsExtracted: ['صداع', 'حمى', 'سعال'],
        feelingSummary: 'الشعور بالتعب والإرهاق الشديد',
        additionalNotes: 'يجب المتابعة مع الطبيب في حالة تفاقم الأعراض',
        nextSteps: ['الراحة التامة', 'شرب السوائل', 'قياس درجة الحرارة'],
      };

      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(arabicPayload) } }],
      });

      const req = makeRequest({ userInput: 'صداع وحمى', language: 'ar' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status, data } = await readJson(res as unknown as Response);
      
      expect(status).toBe(200);
      expect(data).toEqual(arabicPayload);
      expect(data.possibleCondition).toBe('نزلة برد شديدة');
    });

    it('handles arrays correctly in response', async () => {
      const payloadWithArrays = {
        ...validGroqPayload,
        symptomsExtracted: ['cough', 'fever', 'headache', 'fatigue', 'nausea'],
        nextSteps: ['Rest', 'Drink fluids', 'Monitor temperature', 'Take pain relievers'],
      };

      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(payloadWithArrays) } }],
      });

      const req = makeRequest({ userInput: 'multiple symptoms', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      const { status, data } = await readJson(res as unknown as Response);
      
      expect(status).toBe(200);
      expect(Array.isArray(data.symptomsExtracted)).toBe(true);
      expect(data.symptomsExtracted.length).toBe(5);
      expect(Array.isArray(data.nextSteps)).toBe(true);
      expect(data.nextSteps.length).toBe(4);
    });
  });

  describe('Response Status Codes', () => {
    it('returns exactly 200 for successful requests', async () => {
      createSpy.mockResolvedValueOnce({
        choices: [{ message: { content: JSON.stringify(validGroqPayload) } }],
      });

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      
      expect(res.status).toBe(200);
    });

    it('returns exactly 400 for invalid input', async () => {
      const req = makeRequest({ userInput: '', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      
      expect(res.status).toBe(400);
    });

    it('returns exactly 500 for server errors', async () => {
      createSpy.mockRejectedValueOnce(new Error('Server error'));

      const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
      const res = await POST(req);
      
      expect(res.status).toBe(500);
    });
  });
});