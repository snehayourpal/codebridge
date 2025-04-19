export async function extractTextFromDocument(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    return new TextDecoder().decode(arrayBuffer).trim();
  } catch (error) {
    console.error('Document parsing error:', error);
    throw new Error('Failed to extract text from document');
  }
} 