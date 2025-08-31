import express, { json } from "express";
import cors from "cors";
import uploadImage from "./routes/uploadImage/route.ts";

const app: express.Application = express();

app.use(cors());
app.use(json());
app.use('/uploadImage', uploadImage);

export default app;
