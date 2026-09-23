import { GoogleGenAI, Type } from "@google/genai";

export async function getBookNamesFromLLM(buffer: Buffer, mimeType: string) {
  const ai = new GoogleGenAI({});

  // Validate supported image type
  const supportedTypes = ["jpeg", "jpg", "png", "gif", "webp", "bmp", "tiff", "svg", "ico", "heic", "avif"];
  const imgType = mimeType.split("/")[1]?.toLowerCase();
  if (!imgType || !supportedTypes.includes(imgType)) {
    throw new Error("Image type not supported");
  }

  const base64ImageFile = buffer.toString("base64");

  const contents = [
    {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageFile,
      },
    },
    {
      text:
        "You are an expert OCR recognizer. Extract all book names from the provided text. " +
        "If a book's author is available, include it as well. " +
        "Return ONLY a JSON object in the following format: " +
        '{ "1": {"name": "Book Name", "author": "Author Name"}, ' +
        '  "2": {"name": "Another Book", "author": "Another Author"}, ... }. ' +
        "If no books are found, return an empty JSON object: {}. " +
        "Do not include any explanations or extra text.",
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            BookName: {
              type: Type.STRING,
            },
            AuthorName: {
              type: Type.STRING,
            },
          },
        },
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from the LLM ");
  }

  const jsonObject = JSON.parse(response.text);

  return jsonObject;
}
