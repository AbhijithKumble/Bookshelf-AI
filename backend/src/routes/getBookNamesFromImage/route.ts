import express from "express";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import fs from "fs";

const router: express.Router = express.Router();

router.post('/getBookNamesFromImage', (req: express.Request, res: express.Response) => {

  const ai = new GoogleGenAI({});
  const imgPath = "./images/book_to_understand.png";

  async function main() {
    // Read file and convert to Base64
    const imageBase64 = fs.readFileSync(imgPath, {
      encoding: "base64",
    });
    console.log("trying to get response")
    // Call Gemini API
    const response = await ai.models.generateContent({
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

    // Print the response text
    console.log(response.text);
  }

  main().catch(console.error);




  console.log(req)

  res.send({
    "message": "done"
  });

});

export default router;

