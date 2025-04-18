import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
  try {
    const { description } = await req.json();
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Return JSON in this exact format:
          {
            "pages": string[],
            "features": string[],
            "models": { [name: string]: { [field: string]: "string" | "number" | "boolean" | "date" } }
          }`
        },
        { role: "user", content: description }
      ],
      model: "llama3-70b-8192",
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No content returned');

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    );
  }
}