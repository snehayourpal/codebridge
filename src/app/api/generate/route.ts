import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { TEMPLATES } from '@/lib/templates';
import { AppStructure } from '@/lib/types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(request: Request) {
  try {
    const { prompt, template } = await request.json();
    const selectedTemplate = TEMPLATES.find(t => t.id === template);

    const systemPrompt = `
    You are an app generator. Create a JSON structure for a ${selectedTemplate?.name} app.
    Required fields: pages[], features[], models{}
    Format models as: { "ModelName": { "field1": "type", "field2": "type" } }
    `;

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

    // Make sure the response matches the AppStructure type
    const generatedApp: AppStructure = {
      pages: ['Home', 'About', 'Services', 'Contact'],
      features: ['ContentManagement', 'ContactForm'],
      models: {
        BusinessInfo: {
          name: 'string',
          description: 'string',
          contact: 'object'
        },
        Service: {
          title: 'string',
          description: 'string',
          price: 'string'
        }
      }
    };

    return NextResponse.json(generatedApp);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate app structure' },
      { status: 500 }
    );
  }
}