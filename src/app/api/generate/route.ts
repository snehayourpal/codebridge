import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { TEMPLATES } from '@/lib/templates';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
  const { prompt, template } = await req.json();
  const selectedTemplate = TEMPLATES.find(t => t.id === template);

  const systemPrompt = `
  You are an app generator. Create a JSON structure for a ${selectedTemplate?.name} app.
  Required fields: pages[], features[], models{}
  Format models as: { "ModelName": { "field1": "type", "field2": "type" } }
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      model: "llama3-70b-8192",
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    const result = JSON.parse(content || '{}');

    // Merge with template defaults if available
    const finalResult = {
      ...selectedTemplate?.defaultStructure,
      ...result
    };

    return NextResponse.json(finalResult);
  } catch (error) {
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}