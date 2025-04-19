import pdfParse from 'pdf-parse';

/**
 * Extracts and truncates PDF text to fit within Groq token limits.
 * @param arrayBuffer - The PDF file as an ArrayBuffer
 * @param maxChars - Max characters to return (default ~16k for ~4k tokens)
 * @returns A Promise that resolves with truncated extracted text
 */
export async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function extractTextFromDocument(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    return new TextDecoder().decode(arrayBuffer).trim();
  } catch (error) {
    console.error('Document parsing error:', error);
    throw new Error('Failed to extract text from document');
  }
}
