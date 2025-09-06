import express from "express";
import multer from "multer";
import getBookNamesFromImage from "../../services/geminiGetBookNames.services.ts";
import assert from "node:assert";

const router: express.Router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/', upload.single('book-image'), (req: express.Request, res: express.Response) => {

  const file = req.file;

  if (!file) {
    res.send({
      code: 404,
      message: "no file found"
    });
  }
  assert(file !== undefined);
  const jsonData = getBookNamesFromImage(file);
  res.send({});
});

export default router;
