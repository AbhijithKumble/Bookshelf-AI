import { GoogleGenAI } from "@google/genai";
import fs from "fs";

async function getBookNamesFromImage(imgPath: string) {

  const imageBase64 = fs.readFileSync(imgPath, {
    encoding: "base64",
  });

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
            { text: `Give me all the names of the books in the given image in the form of json with key as books and value as a list of books ` },
          ],
        },
      ],
    });
    
    return response.text;

  } catch (error) {
    console.log(error)
    return {};
  }
}

export default getBookNamesFromImage;

