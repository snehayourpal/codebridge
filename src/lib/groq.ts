import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 30000, // 30 second timeout
});

interface LlamaResponse {
  pages: string[];
  features: string[];
  models: Record<string, Record<string, string>>;
  error?: string;
}

export async function parseAppDescription(description: string): Promise<LlamaResponse> {
  // Validate input
  if (!description.trim()) {
    throw new Error("Description cannot be empty");
  }

  const systemPrompt = `
  You are an expert app architect. Extract the following from user descriptions:
  1. pages: Array of page names (e.g., ["Login", "Dashboard"])
  2. features: Array of features (e.g., ["Authentication", "CRUD"])
  3. models: Object with data models and their fields (e.g., { User: { email: "string" } })
  
  Rules:
  - Always return valid JSON
  - Field types must be: "string", "number", "boolean", or "date"
  - Never add explanations or markdown
  - If unclear about a field, default to "string"

  Example output for "A todo app":
  {
    "pages": ["Login", "TodoList"],
    "features": ["Authentication", "Task Management"],
    "models": {
      "Todo": {
        "task": "string",
        "completed": "boolean"
      }
    }
  }
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: description,
        },
      ],
      model: "llama3-70b-8192", // or "llama3-8b-8192" for faster response
      response_format: { type: "json_object" },
      temperature: 0.3, // Less creative but more precise
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) throw new Error("Empty response from AI");

    // Parse and validate response
    const result = JSON.parse(responseText) as LlamaResponse;
    
    if (!result.pages || !result.features || !result.models) {
      throw new Error("Invalid response structure from AI");
    }

    return {
      pages: Array.isArray(result.pages) ? result.pages : [],
      features: Array.isArray(result.features) ? result.features : [],
      models: result.models && typeof result.models === "object" ? result.models : {},
    };
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to parse app description"
    );
  }
}

// Utility function for testing
export async function testGroqConnection() {
  try {
    const testResponse = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Say 'hello'" }],
      model: "llama3-8b-8192",
    });
    return testResponse.choices[0]?.message?.content === "hello";
  } catch (error) {
    return false;
  }
}