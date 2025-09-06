import { GoogleGenAI } from "@google/genai";
import safeParseJSON from "../utils/verifyJSONParsable.ts";

async function getBookNamesFromImage(file: Express.Multer.File) {

  const imageBase64 = file.buffer.toString('base64');

  const ai = new GoogleGenAI({});

  console.log("trying to get response")
  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/png",
                data: imageBase64,
              },
            },
            {
              text: `Get the books names from the given image and 
                      Return ONLY a valid JSON object in this format:
                      { "books": ["title1", "title2", "title3"] }
                      - No authors
                      - No extra text or explanation
                      - No markdown or code block
                  `
            },
          ],
        },
      ],
    });

    // TODO: error handling and output of the error 
      
    if (!response) {
      return new Error("could not get the output from ML model");
    }

    const jsonData = safeParseJSON(response.text!);
    return jsonData;
  } catch (error) {
    console.log(error)
    return error;
  }
}

export default getBookNamesFromImage;

