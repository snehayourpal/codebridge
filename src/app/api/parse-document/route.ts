import { NextResponse } from 'next/server';
import { BusinessContent } from '@/lib/types';
import { extractTextFromDocument } from '@/lib/text-utils';

export async function POST(request: Request) {
  try {
    console.log('Received document parsing request');
    
    const formData = await request.formData();
    const file = formData.get('document') as File;
    
    if (!file) {
      console.log('No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const extractedText = await extractTextFromDocument(arrayBuffer);

      console.log('Extracted text sample:', extractedText.substring(0, 200));

      // Send to Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: `You are a document parser that extracts business information from text. 
              Extract the following information and return it in JSON format:
              - Business name
              - Description
              - Mission statement
              - Contact information (email, phone, address)
              - Services (array of objects with title, description, price, and features)
              - Sections (array of objects with id, title, content, and order)
              
              Return the data in this exact format:
              {
                "businessInfo": {
                  "name": string,
                  "description": string,
                  "mission": string,
                  "contact": {
                    "email": string,
                    "phone": string,
                    "address": string
                  }
                },
                "services": [
                  {
                    "title": string,
                    "description": string,
                    "price": string,
                    "features": string[]
                  }
                ],
                "sections": [
                  {
                    "id": string,
                    "title": string,
                    "content": string,
                    "order": number
                  }
                ]
              }`
            },
            {
              role: 'user',
              content: `Here is the extracted text from the document. Please parse it and extract the business information: ${extractedText}`
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API error details:', errorData);
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      const parsedContent = JSON.parse(data.choices[0].message.content);

      console.log('Successfully parsed content:', parsedContent);
      return NextResponse.json(parsedContent);
    } catch (error) {
      console.error('File parsing error:', error);
      return NextResponse.json(
        { error: 'Failed to parse file content' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Document parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
} 