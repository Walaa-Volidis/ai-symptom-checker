import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { z } from 'zod';
import { SERVER_SETTINGS } from '../../../settings';

const SymptomResponseSchema = z.object({
  possibleCondition: z.string(),
  severity: z.enum(['mild', 'moderate', 'severe']),
  selfCareTips: z.string(),
  recommendedDoctor: z.string(),
  symptomsExtracted: z.array(z.string()),
  feelingSummary: z.string(),
  additionalNotes: z.string(),
  nextSteps: z.array(z.string()),
});

const groq = new Groq({
  apiKey: SERVER_SETTINGS.groqApiKey,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInput, language = 'en' } = body;

    if (!userInput) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const languageInstructions = {
      en: 'Respond in English.',
      ar: 'Respond in Arabic (العربية). All fields must be in Arabic language.',
    };

    const prompt = `
You are a professional medical AI assistant. The user provides the following information about their health:

"${userInput}"

${
  languageInstructions[language as keyof typeof languageInstructions] ||
  languageInstructions.en
}

Analyze the information carefully and provide a detailed response including:
1) The most likely medical condition.
2) Severity level (mild, moderate, severe).
3) Self-care tips.
4) Recommended doctor type to consult.
5) Extracted symptoms from the text as a list.
6) Summary of how the user is feeling.
7) Any additional notes or warnings.
8) Next steps or actions the user should take.

Output ONLY in JSON format as an object with the following structure:
{
  "possibleCondition": "string",
  "severity": "mild | moderate | severe",
  "selfCareTips": "string",
  "recommendedDoctor": "string",
  "symptomsExtracted": ["string", ...],
  "feelingSummary": "string",
  "additionalNotes": "string",
  "nextSteps": ["string", ...]
}

IMPORTANT: 
- Keep severity in English lowercase (mild, moderate, or severe)
- All other text content should be in ${
      language === 'ar' ? 'Arabic' : 'English'
    }
- Respond concisely, clearly, and ONLY in JSON format. Do NOT include any extra text.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      max_completion_tokens: 1500,
      top_p: 1,
      stream: false,
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'No content returned by Groq' },
        { status: 500 }
      );
    }

    const parsedData = SymptomResponseSchema.safeParse(JSON.parse(content));
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid response format from Groq', rawContent: content },
        { status: 500 }
      );
    }
    return NextResponse.json(parsedData.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}